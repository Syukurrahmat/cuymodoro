import { DBSchema, IDBPDatabase, openDB } from 'idb';
import moment from 'moment';
import RestLevel from '../lib/restLevel';

const DB_NAME = 'cuymodoro-db';
const DB_VERSION = 1;

interface MyDBSchema extends DBSchema {
	tasks: {
		key: number;
		value: Task
		indexes: {
			status: TaskStatus;
			created: Date;
			startAt: Date;
			endAt: Date
		};
	};
}




export default class Database {
	constructor(private db: IDBPDatabase<MyDBSchema>) { }

	static async createInstance() {
		const db = await openDB<MyDBSchema>(DB_NAME, DB_VERSION, {
			upgrade(db) {
				if (db.objectStoreNames.contains('tasks')) return;

				const taskStore = db.createObjectStore('tasks', {
					keyPath: 'id',
					autoIncrement: true,
				});

				taskStore.createIndex('status', 'status', { unique: false });
				taskStore.createIndex('startAt', 'startAt', { unique: false });
				taskStore.createIndex('endAt', 'endAt', { unique: false });
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

	async getAnalitic(date: Date | string) {
		const start = moment(date).startOf('day')
		const end = moment(date).endOf('day')

		let focusTime = 0;
		let restTime = 0;

		const longestTask = {
			duration: NaN,
			task: null as Task | null
		}
		const shortestTask = {
			duration: NaN,
			task: null as Task | null
		}

		const tasks = await Promise
			.all([
				this.db.getAllFromIndex('tasks', 'startAt', IDBKeyRange.bound(start.toDate(), end.toDate())),
				this.db.getAllFromIndex('tasks', 'endAt', IDBKeyRange.bound(start.toDate(), end.toDate()))
			])
			.then(res => (
				res.flatMap(e => e).filter(e => e.status == 'complete')
			))


		tasks.forEach(task => {
			const startPeriod = start.isAfter(task.startAt) ? start.valueOf() : task.startAt.valueOf()
			const startRestPeriod = start.isAfter(task.restAt) ? start.valueOf() : task.restAt.valueOf()
			const endPeriod = end.isBefore(task.endAt) ? end.valueOf() : task.endAt.valueOf()

			const focusDuration = startRestPeriod - startPeriod
			const restDuration = endPeriod - startRestPeriod

			if (Number.isNaN(longestTask.duration) || longestTask.duration < focusDuration) {
				longestTask.duration = focusDuration
				longestTask.task = task
			}
			if (Number.isNaN(shortestTask.duration) || shortestTask.duration > focusDuration) {
				shortestTask.duration = focusDuration
				shortestTask.task = task
			}

			focusTime += focusDuration;
			restTime += restDuration;
		});

		return {
			count: tasks.length,
			totalTime: focusTime + restTime,
			restTime,
			focusTime,
			longestTask,
			shortestTask,
			tasks
		}
	}

	async removeTask(taskId: number) {
		await this.db.delete('tasks', taskId);
	}

	close() {
		this.db.close();
	}
}


