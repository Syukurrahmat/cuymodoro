import moment from 'moment';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { AppContext } from '../components/Layout/Layout';
import DomoroLayout from '../components/DomoroLayout/DomoroLayout';
import { useTimer } from '../hooks/useTimer';
import useDB from '../database/databaseContext';
import { durationToHHMMSS } from '../lib/utils';

export default function RestPage() {
	const db = useDB();
	const navigate = useNavigate();
	const { activeTask, taskList,  setData} = useOutletContext<AppContext<'rest'>>(); //prettier-ignore

	const onComplete = () => {
		db.setTaskRestToComplete(activeTask.id!).then((e) => {
			setData('activeTask', null);
			if (nextTast) navigate('/prepare', { state: { isContinuing: true } });
			else {
				navigate('/complete', { state: { task: e } });
			}
		});
	};

	const timer = useTimer(
		activeTask.restAt!,
		activeTask.maxRestDuration,
		onComplete
	);

	if (activeTask.status !== 'rest') return <Navigate to="/focus" />;

	const nextTast =
		taskList && taskList.filter((e) => e.id !== activeTask.id)[0];

	return (
		<DomoroLayout
			taskName={activeTask.name}
			timeInfo={`Istirahat selama ${durationToHHMMSS(moment.duration(activeTask.maxRestDuration, 's'), true)}`} //prettier-ignore
			timeCount={timer.remainingStr!}
			onNext={onComplete}
			progress={
				(timer.remaining.asSeconds() / activeTask.maxRestDuration) * 100
			}
			onStop={() => {}}
			nextTaskName={nextTast?.name}
			type="break"
		/>
	);
}
