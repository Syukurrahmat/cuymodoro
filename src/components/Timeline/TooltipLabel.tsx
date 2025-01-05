import { Group, Stack, Text } from '@mantine/core'; //prettier-ignore
import { IconRocket, IconZzz } from '@tabler/icons-react';
import moment from 'moment';
import { durationToHHMMSS } from '../../lib/utils';

interface TooltipLabel {
	task: TaskByStatus<'complete'>;
}

export default function TooltipLabel({ task }: TooltipLabel) {
	return (
		<Stack gap="4">
			<Text fz="sm">{task.name}</Text>
			<Group gap="6">
				<IconRocket size="18" />
				<Text fz="sm">
					{durationToHHMMSS(
						moment.duration(moment(task.restAt).diff(task.startAt))
					)}
				</Text>
			</Group>
			<Group gap="6">
				<IconZzz size="18" />
				<Text fz="sm">
					{durationToHHMMSS(
						moment.duration(moment(task.endAt).diff(task.restAt))
					)}
				</Text>
			</Group>
		</Stack>
	);
}
