import { DBSchema, IDBPDatabase, openDB } from 'idb';
import RestLevel from '../lib/restLevel';

interface MyDBSchema extends DBSchema {
	tasks: {
		key: number;
		value: Task;
		indexes: {
			status: TaskStatus;
			created: Date;
		};
	};
}

export default class Database {
	constructor(private db: IDBPDatabase<MyDBSchema>) { }

	static async createInstance(dbName: string, dbVersion: number) {
		const db = await openDB<MyDBSchema>(dbName, dbVersion, {
			upgrade(db) {
				if (db.objectStoreNames.contains('tasks')) return;

				const taskStore = db.createObjectStore('tasks', {
					keyPath: 'id',
					autoIncrement: true,
				});

				taskStore.createIndex('status', 'status', { unique: false });
				taskStore.createIndex('created', 'created', { unique: false });
			},
		});

		return new Database(db);
	}


	async addTask(name: string) {
		const data: Task = { name, status: 'notStarted', createdAt: new Date() };
		const id = await this.db.add('tasks', data);
		return { id, ...data };
	}

	async getActiveTask() {
		return await Promise.all(['focus', 'rest'].map((e) => this.getOneTaskByStatus(e as TaskStatus))).then(
			(e) => e.find((f) => f) || null
		)
	}

	async getTaskByStatus<T extends TaskStatus>(status: T) {
		return await this.db.getAllFromIndex('tasks', 'status', status) as TaskByStatus<T>[]
	}

	async getOneTaskByStatus<T extends TaskStatus>(status: T) {
		return await this.db.getFromIndex('tasks', 'status', status) as TaskByStatus<T> || null
	}


	async setTaskToFocus(taskId: number) {
		const tx = this.db.transaction('tasks', 'readwrite');
		const { store } = tx

		const task = await store.get(taskId);
		if (!task || task.status !== 'notStarted') throw new Error('error')

		const data: Task = { ...task, status: 'focus', startAt: new Date() }
		store.put(data);

		await tx.done;
		return data
	}

	async setTaskToRest(taskId: number) {
		const tx = this.db.transaction('tasks', 'readwrite');
		const { store } = tx;

		const task = await store.get(taskId);
		if (!task || task.status !== 'focus') throw new Error('error')

		const currentTime = new Date()

		const data: Task = {
			...task,
			status: 'rest',
			restAt: currentTime,
			maxRestDuration: RestLevel.getRestTime(task.startAt!, currentTime)
		}

		store.put(data);
		await tx.done;
		return data
	}

	async setTaskRestToComplete(taskId: number) {
		const tx = this.db.transaction('tasks', 'readwrite');
		const { store } = tx;

		const task = await store.get(taskId);
		if (!task || task.status === 'notStarted' || task.status == 'complete') throw new Error('error')

		const currentTime = new Date()

		const data: Task = {
			...task,
			status: 'complete',
			restAt: task.status == 'focus' ? currentTime : task.restAt,
			endAt: currentTime
		}

		store.put(data)
		await tx.done;
		return data
	}

	async removeTask(taskId: number) {
		await this.db.delete('tasks', taskId);
	}


	close() {
		this.db.close();
	}
}


