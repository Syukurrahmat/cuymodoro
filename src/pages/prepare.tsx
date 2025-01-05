import { Box, Button, Container, List, ListItem, Stack, Text, Title } from '@mantine/core'; //prettier-ignore
import { IconArrowLeft, IconArrowNarrowRight, IconPlayerPlay } from '@tabler/icons-react'; //prettier-ignore
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'; //prettier-ignore
import { AppContext } from '../components/Layout/Layout';
import useDB from '../database/databaseContext';

export default function PreparePage() {
	const db = useDB();
	const navigate = useNavigate();
	const location = useLocation();
	const { setData, taskList, setColorTheme } = useOutletContext<AppContext>();
	const { isContinuing } = location.state as LocationState || {}

	setColorTheme('blue');

	const [task, ...nextTask] = taskList;

	const startFocus = () => {
		db.setTaskToFocus(task.id!).then((task) => {
			setData('activeTask', task);
			setData('taskList', (e) => e.filter((f) => f.id !== task.id));
			navigate('/focus');
		});
	};

	return (
		<Container size="sm" component={Stack}>
			<Stack gap="sm">
				<Box>
					<Title size="h2">
						{!isContinuing ? 'Mulai Fokus' : 'Istirahat Selesai'}
					</Title>
					<Title size="h2" c="gray.5">
						{!isContinuing
							? 'dan mulai lebih produktif'
							: 'Lanjut ke tugas kerikutnya'}
					</Title>
				</Box>
				<Title size="h2" fw="600" my="xl" ta="center">
					{task.name}
				</Title>
				<Container size="xs">
					<Button
						size="md"
						fullWidth
						variant="light"
						leftSection={<IconPlayerPlay />}
						onClick={() => startFocus()}
					>
						Fokus {!isContinuing ? 'Sekarang' : 'Lagi'}
					</Button>
				</Container>
			</Stack>

			{!!nextTask?.length && (
				<Box w="100%">
					<Text fw="600" mb="sm">
						Tugas Selanjutnya
					</Text>
					<List
						mt="xs"
						spacing="md"
						size="md"
						center
						icon={
							<IconArrowNarrowRight
								size="16"
								color="var(--mantine-color-blue-5)"
							/>
						}
					>
						{nextTask.slice(0, 3).map((e) => (
							<ListItem key={e.id}>{e.name}</ListItem>
						))}

						{nextTask.length > 3 && (
							<ListItem c="dimmed">
								dan {nextTask.length - 3} tugas lain
							</ListItem>
						)}
					</List>
				</Box>
			)}

			<Container size="xs">
				<Button
					fullWidth
					variant="subtle"
					color="orange"
					children="Batal"
					leftSection={<IconArrowLeft />}
					onClick={() => navigate('/')}
				/>
			</Container>
		</Container>
	);
}
