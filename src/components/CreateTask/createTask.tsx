import { Button, Group, Input, Paper, Stack, Text, Title } from '@mantine/core'; //prettier-ignore
import { IconPlayerPlay } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import useDB from '../../lib/database/databaseContext';

export default function CreateTask() {
	const db = useDB();
	const { mutate } = useSWRConfig();

	const navigate = useNavigate();
	const [name, setName] = useState('');

	const submit = (opt?: { startNow: true }) => {
		if (!name.trim().length) return;
		setName('');

		db.addTask(name).then((task) => {
			if (opt?.startNow) navigate(`/prepare`, { state: task });
			mutate('tasklist');
		});
	};

	return (
		<Paper
			component="form"
			onSubmit={async (e) => {
				e.preventDefault();
				submit();
			}}
			p="md"
			withBorder
		>
			<Title size="h2">Catat Tugas dan Mulai Fokus</Title>
			<Stack mt="md">
				<Input
					value={name}
					onChange={(e) => setName(e.target.value)}
					size="md"
					placeholder="Tulis apa yang mau kamu lakukan"
				/>
				<Group justify="space-between">
					<Text fz="sm" c="dimmed">
						Lorem ipsum, dolor sit elit. Repellat?
					</Text>
					<Group gap="sm">
						<Button
							variant="outline"
							type="submit"
							children="Tambah Tugas"
						/>
						<Button
							leftSection={<IconPlayerPlay size="18" />}
							children="Mulai"
							onClick={() => submit({ startNow: true })}
						/>
					</Group>
				</Group>
			</Stack>
		</Paper>
	);
}
