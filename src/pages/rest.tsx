import { ActionIcon, Box, Button, Container, Group, Progress, rem, Stack, Text, ThemeIcon, Title } from '@mantine/core'; //prettier-ignore
import { IconRocket, IconVolume, IconZzz } from '@tabler/icons-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useTimer } from '../components/Timer';
import useDB from '../lib/database/databaseContext';
import { durationToHHMMSS, useLoaderDataTyped } from '../lib/utils';

// export const RestLoader = () => {
// 	return DB()
// 		.then((e) => e.getOneTaskByStatus('rest'))
// 		.then((task) => {
// 			if (!task) throw redirect('/');
// 			return task;
// 		});
// };

export default function RestPage() {
	const db = useDB();
	const navigate = useNavigate();
	const data = useLoaderDataTyped();

	const onComplete = () => {
		db.setTaskRestToComplete(data.id!).then(() => navigate('/complete'));
	};

	const timer = useTimer(data.startRestAt!, data.restDuration!, onComplete);

	return (
		<Stack justify="center" h="calc(100vh - 68px*3)">
			<Box py="lg">
				<Container
					component={Group}
					p="0"
					size="sm"
					style={{ justifyContent: 'space-between' }}
				>
					<Group>
						<ThemeIcon size="lg" variant="light" children={<IconZzz />} />
						<Text size="lg">
							<Text fw="600" component="span">
								Istirahat :{' '}
							</Text>
							{data.name}
						</Text>
					</Group>
					<Text my="xl" c="dimmed" fz="sm">
						Istirahat selama{' '}
						{durationToHHMMSS(
							moment.duration(data.restDuration!, 's'),
							true
						)}
					</Text>
				</Container>
				<Title
					ta="center"
					fz={rem(175)}
					component="p"
					children={timer.remainingStr}
				/>
				<Container p="0" size="sm">
					<Progress
						radius="xs"
						size="md"
						transitionDuration={750}
						value={
							(timer.remaining.asSeconds() / data.restDuration!) * 100
						}
						striped
						animated
					/>
					<Group justify="space-between">
						<Group>
							<ActionIcon variant="light">
								<IconVolume />
							</ActionIcon>
						</Group>
						<Group>
							<Button
								variant="subtle"
								onClick={() => {
									db.setTaskRestToComplete(data.id!).then(() =>
										navigate('/')
									);
								}}
							>
								Berhenti
							</Button>
							<Button leftSection={<IconRocket />}>Lanjut</Button>
						</Group>
					</Group>
				</Container>
			</Box>
		</Stack>
	);
}
