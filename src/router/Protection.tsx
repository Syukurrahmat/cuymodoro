import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { AppContext } from '../components/Layout/Layout';

export const Protection = ({ onActiveOnly }: { onActiveOnly?: boolean }) => {
	const { activeTask, ...r } = useOutletContext<AppContext>();
	
	if (onActiveOnly && !activeTask) return <Navigate to="/" />;

	if (!onActiveOnly && activeTask) {
		return activeTask.status == 'focus' ? (
			<Navigate to="/focus" />
		) : (
			<Navigate to="/rest" />
		);
	}

	return <Outlet context={{ activeTask,  ...r }} />;
};
