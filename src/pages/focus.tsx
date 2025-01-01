import {
	ActionIcon,
	Button,
	Container,
	Group,
	Progress,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import {
	IconFocusCentered,
	IconPlayerStopFilled,
	IconVolume,
} from '@tabler/icons-react';
import moment from 'moment';
import { Navigate, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useStopwatch } from '../components/Timer';
import useDB from '../lib/database/databaseContext';

export default function FocusPage() {
	const db = useDB();
	const navigate = useNavigate();
	const { data } = useSWR('focusTask', () => db.getOneTaskByStatus('focus'));
	const stopwatch = useStopwatch(data?.startAt || new Date());

	if (data === undefined) return 'loading';
	if (data === null) return <Navigate to="/" />;

	return (
		<Stack justify="center" h="calc(100vh - 68px*2)">
			<Container
				component={Group}
				p="0"
				w="100%"
				size="sm"
				style={{ justifyContent: 'space-between' }}
			>
				<Group>
					<ThemeIcon
						size="lg"
						variant="light"
						children={<IconFocusCentered />}
					/>
					<Text size="lg">
						<Text fw="600" component="span">
							Fokus :{' '}
						</Text>
						{data.name}
					</Text>
				</Group>
				<Text my="xl" c="dimmed" fz="sm">
					Di mulai pada {moment(data.startAt).format('hh:mm')}
				</Text>
			</Container>
			<Container fluid>
				<Stack justify="center"   align="center" my="lg">
					<Title
						ta="center"
						size="h1"
						fz={{base : '19vw', sm : '15vw', lg : '14vw'}}
						component="p"
						c="gray.9"
						children={stopwatch.durationStr}
					/>
					<Progress
						mt={-24}
						value={100}
						radius="xs"
						w="100%"
						size="md"
					/>
				</Stack>
			</Container>
			<Container
				component={Group}
				p="0"
				w="100%"
				size="sm"
				style={{ justifyContent: 'space-between' }}
			>
				<Group>
					<ActionIcon variant="light">
						<IconVolume />
					</ActionIcon>
				</Group>
				<Group>
					<Button variant="subtle" color="gray">
						Batal
					</Button>
					<Button
						leftSection={<IconPlayerStopFilled />}
						onClick={() => {
							db.setTaskToRest(data.id!).then(() => navigate('/rest'));
						}}
					>
						Berhenti
					</Button>
				</Group>
			</Container>
		</Stack>
	);
}
