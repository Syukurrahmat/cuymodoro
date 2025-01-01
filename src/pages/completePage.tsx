import { Box, Button, List, ListItem, Stack, Text, ThemeIcon, Title } from '@mantine/core'; //prettier-ignore
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconPlayerPlay } from '@tabler/icons-react'; //prettier-ignore
import { redirect, useNavigate, useParams } from 'react-router-dom'; //prettier-ignore
import useDB from '../lib/database/databaseContext';
import { useFetchCallback } from '../lib/utils';

// export const PrepareLoader = ({ params }: LoaderFunctionArgs) => {
// 	return DB()
// 		.then((e) => e.getAllTaskByStatus('notStarted'))
// 		.then((task) => {
// 			const activeTask = task.find((e) => e.id == params.id);
// 			if (!activeTask) throw redirect('/');
// 			const nextTask = task.filter((e) => e.id != params.id);

// 			return { activeTask, nextTask };
// 		});
// };

export default function PreparePage() {
	const param = useParams();
	const db = useDB();

	const { data } = useFetchCallback(() =>
		db.getAllTaskByStatus('notStarted').then((task) => {
			const activeTask = task.find((e) => e.id == param.id);
			if (!activeTask) throw redirect('/');
			const nextTasks = task.filter((e) => e.id != param.id);
			return { activeTask, nextTasks };
		})
	);

	const navigate = useNavigate();

	const startFocus = async () => {
		await db.setTaskToFocus(+param.id!);
		navigate('/focus');
	};

	if (!data) return 'loading ';

	const { activeTask, nextTasks } = data;

	return (
		<Box>
			<Title ta="center" py="lg">
				{activeTask.name}
			</Title>

			<Stack w="22em" mx="auto" align="center" gap="sm">
				<Button
					size="md"
					fullWidth
					variant="light"
					leftSection={<IconPlayerPlay />}
					children="Fokus Sekarang"
					onClick={() => startFocus()}
				/>
				{!!nextTasks.length && (
					<Box w="100%">
						<Text fw="600">Tugas Selanjutnya</Text>
						<List
							mt="xs"
							spacing="sm"
							size="md"
							center
							icon={
								<ThemeIcon
									color="blue"
									variant="light"
									size={24}
									radius="sm"
								>
									<IconArrowNarrowRight size="16" />
								</ThemeIcon>
							}
						>
							{nextTasks.map((e) => (
								<ListItem key={e.id}>{e.name}</ListItem>
							))}
						</List>
					</Box>
				)}

				<Button
					fullWidth
					variant="subtle"
					color="orange"
					leftSection={<IconArrowNarrowLeft />}
					children="Kembali"
					onClick={() => navigate('/')}
				/>
			</Stack>
		</Box>
	);
}
