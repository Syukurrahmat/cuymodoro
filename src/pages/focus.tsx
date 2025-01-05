import moment from 'moment';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { AppContext } from '../components/Layout/Layout';

import CuymodoroScreen from '../components/CuymodoroScreen/CuymodoroScreen';
import useDB from '../database/databaseContext';
import { useStopwatch } from '../hooks/useTimer';
import { useEffect } from 'react';

export default function FocusPage() {
	const db = useDB();
	const {activeTask, setData} = useOutletContext<AppContext<'focus'>>(); //prettier-ignore
	const navigate = useNavigate();
	const stopwatch = useStopwatch(activeTask.startAt || new Date());
	const counter = stopwatch.durationStr;

	useEffect(() => {
		document.title = `Fokus: ${counter}`;
	}, [counter]);

	if (activeTask.status !== 'focus') return <Navigate to="/rest" />;

	const onNext = () => {
		db.setTaskToRest(activeTask.id!).then((task) => {
			setData('activeTask', task);
			navigate('/rest');
		});
	};

	return (
		<>
			<title>My Site: Contact Us</title>
			<CuymodoroScreen
				taskName={activeTask.name}
				timeInfo={`Di mulai pada ${moment(activeTask.startAt).format('hh:mm')}`} //prettier-ignore
				timeCount={counter!}
				onNext={onNext}
				onStop={() => {}}
				type="focus"
			/>
		</>
	);
}
