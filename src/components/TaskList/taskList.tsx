import { Button, CloseButton, Group, Paper, Stack, ThemeIcon, Title } from '@mantine/core'; //prettier-ignore
import { IconClipboardList, IconPlayerPlay } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import useDB from '../../lib/database/databaseContext';
import { MouseEventHandler } from 'react';

export default function TaskList() {
	const db = useDB();
	const { data } = useSWR('tasklist', () =>
		db.getAllTaskByStatus('notStarted')
	);

	return (
		<Paper withBorder>
			<Group className="borderBottom" p="sm" gap="8">
				<ThemeIcon variant="transparent">
					<IconClipboardList />
				</ThemeIcon>
				<Title size="md" fw="600">
					Tugas Saya
				</Title>
			</Group>
			{data ? (
				<Stack gap="6" py="sm">
					{data.map((task) => (
						<TaskItem key={task.id} task={task} />
					))}
				</Stack>
			) : (
				' Loading '
			)}
		</Paper>
	);
}

function TaskItem({ task }: { task: Task }) {
	const navigate = useNavigate();
	const db = useDB();

	const onClick = () => navigate(`/prepare`, { state: task });
	const onDelete: MouseEventHandler<HTMLButtonElement> = (event) => {
		event.stopPropagation();
		db.removeTask(task.id!).then(() => mutate('tasklist'));
	};

	return (
		<Button
			variant="subtle"
			color="gray"
			radius="0"
			size="lg"
			styles={{
				label: {
					paddingInline: '6px',
					flex: '1',
				},
			}}
			leftSection={<IconPlayerPlay size="20" />}
			rightSection={<CloseButton color="blue" onClick={onDelete} />}
			fz="md"
			fw="normal"
			c="dark"
			onClick={onClick}
			children={task.name}
		/>
	);
}
