/* eslint-disable react-hooks/exhaustive-deps */

import { AppShell } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useDB from '../../database/databaseContext';
import ScreenLoader from '../ScreenLoader';
import Header from './Header';

type ContextDataProps = 'activeTask' | 'taskList';

export type AppContext<S extends TaskStatus = any> = {
	activeTask: S extends TaskStatus ? TaskByStatus<S> : Task | null;
	taskList: Task[];
	colorTheme: 'blue' | 'teal' | 'cyan';
	isSupportPIP: boolean;
	setData: <T extends ContextDataProps>(
		key: T,
		data: T extends 'activeTask'
			? React.SetStateAction<Task | null>
			: React.SetStateAction<Task[]>
	) => void;
	setColorTheme: React.Dispatch<
		React.SetStateAction<'blue' | 'teal' | 'cyan'>
	>;
};

export default function Layout() {
	const db = useDB();

	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);
	const [taskList, setTaskList] = useState<Task[]>([]);
	const [colorTheme, setColorTheme] =
		useState<AppContext['colorTheme']>('blue');
	const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		Promise.all([db.getActiveTask(), db.getTaskByStatus('notStarted')]).then(
			([activeTasks, taskList]) => {
				setActiveTask(activeTasks);
				setTaskList(taskList);
				setLoading(false);
			}
		);
		document.fonts.ready.then(() => setFontsLoaded(true));
	}, []);

	if (loading || !fontsLoaded) return <ScreenLoader />;

	const contextValue: AppContext = {
		activeTask,
		taskList,
		colorTheme,
		setColorTheme,
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
		<AppShell
			header={{ height: 58 }}
			transitionDuration={500}
			padding="sm"
			bg={colorTheme == 'blue' ? '#f6f8fa' : colorTheme + '.0'}
		>
			<AppShell.Header
				bg={colorTheme + '.1'}
				px="sm"
				bd="none"
				children={<Header colorTheme={colorTheme} />}
			/>
			<AppShell.Main className="appShellMain">
				<Outlet context={contextValue satisfies AppContext} />
			</AppShell.Main>
		</AppShell>
	);
}
