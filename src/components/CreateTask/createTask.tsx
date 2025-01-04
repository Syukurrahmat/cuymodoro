import { Input, Paper, Title } from '@mantine/core'; //prettier-ignore
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import useDB from '../../database/databaseContext';
import { AppContext } from '../Layout/Layout';

export default function CreateTask() {
	const db = useDB();
	const { setData } = useOutletContext<AppContext>();
	const navigate = useNavigate();
	const [name, setName] = useState('');

	const submit = (opt?: { startNow: true }) => {
		if (!name.trim().length) return;
		setName('');

		db.addTask(name).then((task) => {
			if (opt?.startNow) navigate(`/prepare`, { state: { task } });
			setData('taskList', (e) => [...e, task]);
		});
	};

	return (
		<Paper
			component="form"
			onSubmit={async (e) => {
				e.preventDefault();
				submit();
			}}
			p={{ base: 'sm', sm: 'md' }}
			shadow="xs"
		>
			<Title size="h3">Catat Tugas dan Mulai Fokus</Title>
			<Input
				mt="sm"
				flex="1"
				value={name}
				onChange={(e) => setName(e.target.value)}
				size="md"
				placeholder="Tulis apa yang mau kamu lakukan"
			/>
		</Paper>
	);
}
