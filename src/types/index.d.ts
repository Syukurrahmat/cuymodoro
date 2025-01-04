type TaskLevel = 'beginner' | 'regular' | 'enthusiast'
type TaskStatus = 'notStarted' | 'focus' | 'rest' | 'complete'
 
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
	maxRestDuration: number,
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
	endAt: Date
}

type TaskByStatus<T extends Task['status']> = Extract<Task, { status: T }>;

type LocationState = Partial<{
	task: Task,
	isContinuing: boolean
}>

declare module "*.module.css";
 