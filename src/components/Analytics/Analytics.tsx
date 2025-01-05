import { Box, Center, Group, Input, Paper, Stack, Table, Text, ThemeIcon, Title } from '@mantine/core'; //prettier-ignore
import { IconChartBar } from '@tabler/icons-react';
import moment from 'moment';
import { ReactNode, useState } from 'react';
import useDB from '../../database/databaseContext';
import { durationToHHMMSS, useFetchCallback } from '../../lib/utils';
import TimeLine from '../Timeline/Timeline';

const hourIntervals = [0, 8, 16, 24];

export default function Analytics() {
	const db = useDB();
	const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
	const { data, isloading } = useFetchCallback(() => db.getAnalitic(date));

	if (isloading || !data) return 'loading ';
	
	const timelines = hourIntervals.slice(0, -1).map((hour, index) => {
		const startTime = moment(date).hour(hour).minute(0).second(0);
		const endTime = moment(date)
			.hour(hourIntervals[index + 1])
			.minute(0)
			.second(0);

		return {
			startTime,
			endTime,
			tasks: data.tasks.filter(
				(task) =>
					moment(task.startAt).isBetween(startTime, endTime, null, '[)') ||
					moment(task.endAt).isBetween(startTime, endTime, null, '[)')
			),
		};
	});

	const longShorTaskData = [
		[
			<Text fw="600" fz="sm">
				Terlama
			</Text>,
			data.longestTask.task?.name,
			durationToHHMMSS(moment.duration(data.longestTask.duration)),
		],
		[
			<Text fw="600" fz="sm">
				Tersebentar
			</Text>,
			data.shortestTask.task?.name,
			durationToHHMMSS(moment.duration(data.shortestTask.duration)),
		],
	];

	return (
		<Paper shadow="xs">
			<Group className="borderBottom" justify="space-between" p="sm" gap="8">
				<Group gap="8">
					<ThemeIcon variant="transparent">
						<IconChartBar />
					</ThemeIcon>
					<Title size="md" fw="600">
						Analitik
					</Title>
				</Group>
				<Input
					value={date}
					onChange={(e) => setDate(e.target.value)}
					type="date"
					placeholder="Pick date"
					max={moment().format('YYYY-MM-DD')}
					onClick={(e) => e.currentTarget.showPicker()}
				/>
			</Group>
			{data.count > 0 ? (
				<Stack p="md">
					<Box>
						<Text mb="xs" fw="600">
							Overview
						</Text>
						<Group gap="sm">
							<DataDisplay title="Jumlah Tugas">
								{data.count}
							</DataDisplay>
							<DataDisplay title="Durasi Fokus">
								{durationToHHMMSS(moment.duration(data.focusTime))}
							</DataDisplay>
							<DataDisplay title="Durasi Isirahat">
								{durationToHHMMSS(moment.duration(data.restTime))}
							</DataDisplay>
							<DataDisplay title="Total Durasi">
								{durationToHHMMSS(
									moment.duration(data.focusTime + data.restTime)
								)}
							</DataDisplay>
						</Group>
					</Box>
					<Box>
						<Text mb="xs" fw="600">
							Tugas
						</Text>
						<Paper
							withBorder
							shadow="none"
							style={{ overflow: 'hidden' }}
						>
							<Table
								data={{
									body:
										longShorTaskData[0][1] == longShorTaskData[1][1]
											? longShorTaskData.slice(0, 1)
											: longShorTaskData,
								}}
							/>
						</Paper>
					</Box>
					<Box>
						<Text mb="xs" fw="600">
							Linimasa
						</Text>
						<TimeLine lines={timelines} />
					</Box>
				</Stack>
			) : (
				<Center p="md" c="dimmed">
					{' '}
					Tidak ada tugas
				</Center>
			)}
		</Paper>
	);
}

interface DataDisplay {
	title: string;
	children: ReactNode;
}

function DataDisplay({ children, title }: DataDisplay) {
	return (
		<Paper p="xs" withBorder shadow="none" flex="1">
			<Text fz="sm" mb="4" lineClamp={1}>
				{title}
			</Text>
			<Text fz="h2" fw="600">
				{children}
			</Text>
		</Paper>
	);
}
