import { Box, Button, Container, List, ListItem, Stack, Text, ThemeIcon, Title } from '@mantine/core'; //prettier-ignore
import { IconArrowNarrowRight, IconPlayerPlay } from '@tabler/icons-react'; //prettier-ignore
import { Navigate, useLocation, useNavigate } from 'react-router-dom'; //prettier-ignore
import useSWR from 'swr';
import useDB from '../lib/database/databaseContext';

export default function PreparePage() {
	const navigate = useNavigate();
	const location = useLocation();
	const db = useDB();

	const { name, id } = (location.state as Task | null) || {};
	const validRequest = name && id;

	const { data } = useSWR<Task[]>(!!validRequest && 'tasklist');

	if (!validRequest) return <Navigate to="/" />;

	const nextTask = data?.filter((e) => e.id !== id);

	const startFocus = async () => {
		db.setTaskToFocus(+id!).then(() => {
			navigate('/focus', { state: { name, id } });
		});
	};

	if (!nextTask) return 'Loading';

	return (
		<Container size="xs" p="0">
			<Stack align="stretch">
				<Title ta="center" mt="md" py="lg">
					{name}
				</Title>

				<Button
					size="md"
					fullWidth
					variant="light"
					leftSection={<IconPlayerPlay />}
					children="Fokus Sekarang"
					onClick={() => startFocus()}
				/>

				{!!nextTask.length && (
					<Box w="100%">
						<Text fw="600" mb="md">
							Tugas Selanjutnya
						</Text>
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
							{nextTask.slice(0, 5).map((e) => (
								<ListItem key={e.id}>{e.name}</ListItem>
							))}

							{nextTask.length > 5 && (
								<ListItem fs="italic">
									{nextTask.length - 5} Tugas lain
								</ListItem>
							)}
						</List>
					</Box>
				)}

				<Button
					fullWidth
					variant="subtle"
					color="orange"
					children="Batal"
					onClick={() => navigate('/')}
				/>
			</Stack>
		</Container>
	);
}
