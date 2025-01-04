/* eslint-disable react-hooks/exhaustive-deps */

import { AppShell } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useDB from '../../database/databaseContext';
import Header from './Header';


type ContextDataProps = 'activeTask' | 'taskList';

export type AppContext<S extends TaskStatus = any> = {
	activeTask: S extends TaskStatus ? TaskByStatus<S> : Task | null;
	taskList: Task[];
	isSupportPIP: boolean;
	setData: <T extends ContextDataProps>(
		key: T,
		data: T extends 'activeTask'
			? React.SetStateAction<Task | null>
			: React.SetStateAction<Task[]>
	) => void;
};

export default function Layout() {
	const db = useDB();

	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);
	const [taskList, setTaskList] = useState<Task[]>([]);

	useEffect(() => {
		Promise.all([db.getActiveTask(), db.getTaskByStatus('notStarted')]).then(
			([activeTasks, taskList]) => {
				setActiveTask(activeTasks);
				setTaskList(taskList);
				setLoading(false);
			}
		);
	}, []);

	if (loading) return 'loading';

	const contextValue: AppContext = {
		activeTask,
		taskList,
		isSupportPIP: 'documentPictureInPicture' in window,
		setData: (key, data) => {
			if (key == 'activeTask') {
				setActiveTask(data as React.SetStateAction<Task | null>);
			} else {
				setTaskList(data as React.SetStateAction<Task[]>);
			}
		},
	};

	return (
		<AppShell header={{ height: 58 }} padding="sm" bg="#f6f8fa">
			<AppShell.Header
				bg="blue.0"
				px="sm"
				style={{ borderColor: 'var(--mantine-color-blue-1)' }}
				children={<Header />}
			/>
			<AppShell.Main className="appShellMain">
				<Outlet context={contextValue satisfies AppContext} />
			</AppShell.Main>
		</AppShell>
	);
}
