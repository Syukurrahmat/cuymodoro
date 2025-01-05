import { Container, Stack } from '@mantine/core'; //prettier-ignore
import Analytics from '../components/Analytics/Analytics';
import CreateTask from '../components/CreateTask/createTask';
import TaskList from '../components/TaskList/taskList';

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
