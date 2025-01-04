import { Button, Center, CloseButton, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core'; //prettier-ignore
import {
	IconClipboardList,
	IconGripVertical,
	IconPlayerPlay,
} from '@tabler/icons-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import useDB from '../../database/databaseContext';
import { AppContext } from '../Layout/Layout';
import styles from './taskItem.module.css';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import arrayMoveImmutable from 'array-move';

export default function TaskList() {
	const navigate = useNavigate();
	const { setData } = useOutletContext<AppContext>();
	const db = useDB();

	const { taskList } = useOutletContext<AppContext>();
	const onDelete = (task: Task) => {
		setData('taskList', (e) => e.filter((f) => f.id !== task.id));
		db.removeTask(task.id!);
	};

	const onSortEnd = (oldIndex: number, newIndex: number) => {
		setData('taskList', (array) =>
			arrayMoveImmutable(array, oldIndex, newIndex)
		);
	};

	return (
		<Paper shadow="xs">
			<Group className="borderBottom" justify="space-between" p="sm" gap="8">
				<Group gap="6">
					<ThemeIcon variant="transparent">
						<IconClipboardList />
					</ThemeIcon>
					<Title size="md" fw="600">
						Tugas Saya
					</Title>
				</Group>
				{!!taskList.length && (
					<Button
						leftSection={<IconPlayerPlay size="18" />}
						children="Mulai Fokus"
						onClick={() => navigate(`/prepare`)}
					/>
				)}
			</Group>
			{taskList.length ? (
				<SortableList onSortEnd={onSortEnd} >
					<Stack gap="4" py="sm">
						{taskList.map((task) => (
							<SortableItem key={task.id}>
								<div>
									<TaskItem
										task={task}
										onDelete={() => onDelete(task)}
									/>
								</div>
							</SortableItem>
						))}
					</Stack>
				</SortableList>
			) : (
				<Center p="md" c="dimmed">
					Belum Ada Tugas
				</Center>
			)}
		</Paper>
	);
}

interface TaskItem {
	task: Task;
	onDelete: () => void;
}

function TaskItem({ task, onDelete }: TaskItem) {
	return (
		<Group py="6" gap="xs" className={styles.root} pl='xs' pr="md">
			<SortableKnob>
				<ThemeIcon
					className={styles.sortableKnob}
					variant="transparent"
					color="gray"
				>
					<IconGripVertical size="20" />
				</ThemeIcon>
			</SortableKnob>
			<Text c="dark" flex="1" children={task.name} />
			<CloseButton
				color="blue"
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
			/>
		</Group>
	);
}
