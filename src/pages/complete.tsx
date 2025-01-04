import { Box, Button, Center, Container, Group, Stack, Title } from '@mantine/core'; //prettier-ignore
import CheckMark from '../components/CheckMark/CheckMark';
import { IconChartBar } from '@tabler/icons-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

export default function Complete() {
	const navigate = useNavigate();
	const location = useLocation();

	const { task } = (location.state as LocationState) || {};

	if (
		!task ||
		task.status !== 'complete' ||
		!task.endAt ||
		moment().diff(task.endAt, 'minute') > 3
	) {
		return <Navigate to="/" />;
	}

	return (
		<Container size="sm">
			<Stack py="md">
				<Center p="xl">
					<CheckMark />
				</Center>
				<Box>
					<Title ta="center" size="h2">
						Yeay, Selesai 🎉
					</Title>
					<Title ta="center" size="h2" c="gray.5">
						Semua beres! Hebat, kamu luar biasa
					</Title>
				</Box>

				<Group justify="center">
					<Button variant="light" leftSection={<IconChartBar size="18" />}>
						Lihat Analitik
					</Button>
					<Button variant="light" onClick={() => navigate('/')}>
						Beranda
					</Button>
				</Group>
			</Stack>
		</Container>
	);
}
