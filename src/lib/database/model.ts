import { DBSchema, IDBPDatabase, openDB } from 'idb';

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

	get notStartedTask() {
		return this.getOneTaskByStatus('notStarted')
	}

	async addTask(name: string) {
		const data: Task = { name, status: 'notStarted', createdAt: new Date() };
		const id = await this.db.add('tasks', data);
		return { id, ...data };
	}

	async setTaskToFocus(taskId: number) {
		const tx = this.db.transaction('tasks', 'readwrite');
		const { store } = tx;

		const task = await store.get(taskId);
		if (!task || task.status !== 'notStarted') throw new Error('error')
		store.put({ ...task, status: 'focus', startAt: new Date() });
		await tx.done;
	}

	async setTaskToRest(taskId: number) {
		const tx = this.db.transaction('tasks', 'readwrite');
		const { store } = tx;

		const task = await store.get(taskId);
		if (!task || task.status !== 'focus') throw new Error('error')
		store.put({ ...task, status: 'rest', restAt: new Date() });

		await tx.done;
	}

	async setTaskRestToComplete(taskId: number) {
		const tx = this.db.transaction('tasks', 'readwrite');
		const { store } = tx;
		const task = await store.get(taskId);

		if (!task || task.status === 'notStarted') throw new Error('error')

		if (task.status == 'focus') {
			store.put({ ...task, status: 'complete', restAt: new Date(), endAt: new Date() })
		}
		else {
			store.put({ ...task, status: 'complete', endAt: new Date() })
		};

		await tx.done;
	}

	async removeTask(taskId: number) {
		await this.db.delete('tasks', taskId);
	}

	async getAllTaskByStatus(status: TaskStatus) {
		return await this.db.getAllFromIndex('tasks', 'status', status)
	}

	async getOneTaskByStatus<T extends TaskStatus>(status: T) {
		return await this.db.getFromIndex('tasks', 'status', status) as TaskByStatus<T> || null
	}

	close() {
		this.db.close();
	}
}


