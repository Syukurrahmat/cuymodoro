import { Box, Button, Center, Container, Group, Stack, Title } from '@mantine/core'; //prettier-ignore
import moment from 'moment';
import {
	Navigate,
	useLocation,
	useNavigate,
	useOutletContext,
} from 'react-router-dom';
import CheckMark from '../components/CheckMark/CheckMark';
import { AppContext } from '../components/Layout/Layout';

export default function Complete() {
	const navigate = useNavigate();
	const location = useLocation();
	const { setColorTheme } = useOutletContext<AppContext>();

	setColorTheme('blue');

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
					<Button variant="light" onClick={() => navigate('/')}>
						Kembali ke Beranda
					</Button>
				</Group>
			</Stack>
		</Container>
	);
}
