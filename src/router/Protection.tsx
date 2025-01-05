import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { AppContext } from '../components/Layout/Layout';
import { useEffect } from 'react';

export const Protection = ({ onActiveOnly }: { onActiveOnly?: boolean }) => {
	const { activeTask, setColorTheme, ...r } = useOutletContext<AppContext>();

	useEffect(() => {
		if (!onActiveOnly) setColorTheme('blue');
		if (onActiveOnly && activeTask?.status == 'focus') setColorTheme('cyan');
		if (onActiveOnly && activeTask?.status == 'rest') setColorTheme('teal');
	}, [activeTask?.status, onActiveOnly, setColorTheme]);
	
	useEffect(() => {
		if (!onActiveOnly) document.title = 'Cuymodoro';
	}, [onActiveOnly]);

	if (onActiveOnly && !activeTask) return <Navigate to="/" />;

	if (!onActiveOnly && activeTask) {
		return activeTask.status == 'focus' ? (
			<Navigate to="/focus" />
		) : (
			<Navigate to="/rest" />
		);
	}

	return <Outlet context={{ activeTask, setColorTheme, ...r }} />;
};
