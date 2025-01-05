import { Box, Group, Stack, Text, Tooltip } from '@mantine/core'; //prettier-ignore
import moment from 'moment';
import { useState } from 'react';
import TooltipLabel from './TooltipLabel';
import styles from './timeline.module.css';

interface TimeLine {
	lines: {
		tasks: TaskByStatus<'complete'>[];
		startTime: moment.Moment;
		endTime: moment.Moment;
	}[];
}

export default function TimeLine({ lines }: TimeLine) {
	const [tooltipTask, setTooltipTask] = useState<TaskByStatus<'complete'>>();

	return (
		<Tooltip.Floating
			label={tooltipTask && <TooltipLabel task={tooltipTask} />}
			disabled={!tooltipTask}
			position="top"
		>
			<Stack gap="sm">
				{lines.map(({ startTime, endTime, tasks }, i) => (
					<Group
						key={i}
						gap="xs"
						style={{
							'--line-start': startTime.valueOf(),
							'--line-end': endTime.valueOf(),
						}}
					>
						<Text w='32px' size="xs" c="dimmed">
							{moment(startTime).format('HH:mm')}
						</Text>
						<Box className={styles.line}>
							{tasks.map((task, i) => (
								<Group
									key={i}
									onMouseEnter={() => setTooltipTask(task)}
									onMouseLeave={() => setTooltipTask(undefined)}
									className={styles.item}
									style={{
										'--task-start': task.startAt.valueOf(),
										'--task-rest': task.restAt.valueOf(),
										'--task-end': task.endAt.valueOf(),
									}}
								>
									<Box className={styles.itemFocus} />
									<Box className={styles.itemRest} />
								</Group>
							))}
						</Box>
						<Text w='32px' size="xs" c="dimmed">
							{moment(endTime).format('HH:mm')}
						</Text>
					</Group>
				))}
			</Stack>
		</Tooltip.Floating>
	);
}
