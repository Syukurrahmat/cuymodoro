import { Container, Stack } from '@mantine/core'; //prettier-ignore
import CreateTask from '../components/CreateTask/createTask';
import TaskList from '../components/TaskList/taskList';
import Analytics from '../components/Analytics/Analytics';

// export const HomeLoader = () => DB().then((e) => e.getAllTaskByStatus('notStarted')); //prettier-ignore

export default function Home() {
	
	return (
		<Container size="sm" px="0">
			<Stack gap="sm">
				<CreateTask />
				<TaskList />
				<Analytics />
			</Stack>
		</Container>
	);
}
