type TaskLevel = 'beginner' | 'regular' | 'enthusiast'
type TaskStatus = 'notStarted' | 'focus' | 'rest' | 'complete'

// type Task = {
// 	id?: number;

// 	name: string;
// 	status: TaskStatus;
// 	createdAt: Date;

// 	startAt?: Date;
// 	restAt?: Date;
// 	restDuration?: number;
// 	endAt?:Date
	
// };


type Task = {
	id?: number;
	name: string;
	status: 'notStarted';
	createdAt: Date;
} | {
	id?: number;

	name: string;
	status: 'focus';
	createdAt: Date;
	startAt: Date;
} | {
	id?: number;

	name: string;
	status: 'rest';
	createdAt: Date;
	startAt: Date;
	restAt: Date;
} | {
	id?: number;

	name: string;
	status: 'complete';
	createdAt: Date;
	startAt: Date;
	restAt: Date;
	endAt:Date
}

type TaskByStatus<T extends Task['status']> = Extract<Task, { status: T }>;



declare module "*.module.css";

 