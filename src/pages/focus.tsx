import moment from 'moment';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { AppContext } from '../components/Layout/Layout';

import DomoroLayout from '../components/DomoroLayout/DomoroLayout';
import { useStopwatch } from '../hooks/useTimer';
import useDB from '../database/databaseContext';

export default function FocusPage() {
	const db = useDB();
	const {activeTask, setData} = useOutletContext<AppContext<'focus'>>(); //prettier-ignore
	const navigate = useNavigate();
	const stopwatch = useStopwatch(activeTask.startAt || new Date());

	if (activeTask.status !== 'focus') return <Navigate to="/rest" />;

	const onNext = () => {
		db.setTaskToRest(activeTask.id!).then((task) => {
			setData('activeTask', task);
			navigate('/rest');
		});
	};

	return (
		<DomoroLayout
			taskName={activeTask.name}
			timeInfo={`Di mulai pada ${moment(activeTask.startAt).format('hh:mm')}`} //prettier-ignore
			timeCount={stopwatch.durationStr!}
			onNext={onNext}
			onStop={() => {}}
			type="focus"
		/>
	);
}
