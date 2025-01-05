import { ActionIcon, Box, Button, Container, Group, Progress, rem, Stack, Text, ThemeIcon, Title } from '@mantine/core'; //prettier-ignore
import { IconFocusCentered, IconMaximize, IconMinimize, IconPictureInPicture, IconRocket, IconZzz } from '@tabler/icons-react'; //prettier-ignore
import { useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AppContext } from '../Layout/Layout';
import styles from './CuymodoroScreen.module.css';

const CuymodoroSessionData = {
	focus: {
		icon: IconFocusCentered,
		name: 'Fokus',
		nextIcon: IconZzz,
		nextLabel: 'Istirahat',
	},
	break: {
		icon: IconZzz,
		name: 'Istirahat',
		nextIcon: IconRocket,
		nextLabel: 'Lanjut',
	},
};

interface CuymodoroScreen {
	taskName: string;
	timeInfo: string;
	timeCount: string;
	nextTaskName?: string;
	type: 'focus' | 'break';
	onStop: () => void;
	onNext: () => void;
	progress?: number;
}

export default function CuymodoroScreen({
	type,
	progress,
	timeCount,
	onNext,
	onStop,
	timeInfo,
	nextTaskName,
	taskName,
}: CuymodoroScreen) {
	const ref = useRef<HTMLDivElement>(null);
	const { isSupportPIP, colorTheme } = useOutletContext<AppContext>();

	const requestPiP = async () => {
		alert('Dalam Proses Pengembangan ');
	};

	const fullScreenToggle = () => {
		if (document.fullscreenElement) document.exitFullscreen();
		else ref.current?.requestFullscreen();
	};

	const sessionData = CuymodoroSessionData[type];

	return (
		<Stack
			className={styles.root}
			ref={ref}
			style={{ '--bg': `var(--mantine-color-${colorTheme}-0)` }}
		>
			<Container px="0" size="sm" w="100%">
				<Group justify="space-between">
					<Group gap="sm" wrap="nowrap">
						<ThemeIcon
							color={colorTheme}
							variant="light"
							children={<sessionData.icon size="20" />}
						/>
						<Text>
							<Text fw="600" component="span">
								{sessionData.name} {' : '}
							</Text>
							{taskName}
						</Text>
					</Group>
					<Text c="dimmed" fz="sm">
						{timeInfo}
					</Text>
				</Group>
				<Box h={rem(26)} />
			</Container>
			<Container px="0" fluid pos="relative">
				<Title
					ta="center"
					fz={{ base: '19vw', sm: '15vw', lg: '12vw' }}
					component="p"
					c="gray.9"
					py="sm"
					className={styles.counter}
					children={timeCount}
				/>
				<Container
					pos="absolute"
					left="0"
					right="0"
					bottom="0"
					h={rem(8)}
					size="sm"
					w="100%"
				>
					{typeof progress == 'number' && (
						<Progress
							radius="md"
							size="md"
							color={colorTheme}
							transitionDuration={500}
							value={progress}
							striped={false}
						/>
					)}
				</Container>
			</Container>
			<Container px="0" size="sm" w="100%">
				<Stack gap="sm">
					<Box h={rem(26)}>
						{!!nextTaskName && (
							<Text c="dimmed">Tugas Selanjutnya : {nextTaskName}</Text>
						)}
					</Box>
					<Group justify="space-between">
						<Group gap="sm">
							<ActionIcon
								onClick={fullScreenToggle}
								size={rem(36)}
								color={colorTheme}
								variant="light"
								children={
									document.fullscreenElement ? (
										<IconMinimize size="20" />
									) : (
										<IconMaximize size="20" />
									)
								}
							/>
							{isSupportPIP && (
								<ActionIcon
									onClick={requestPiP}
									size={rem(36)}
									color={colorTheme}
									variant="light"
									children={<IconPictureInPicture size="20" />}
								/>
							)}
						</Group>

						<Group gap="sm">
							<Button
								color={colorTheme}
								variant="light"
								onClick={onStop}
							>
								Berhenti
							</Button>
							<Button
								color={colorTheme}
								leftSection={<sessionData.nextIcon size="20" />}
								onClick={onNext}
								children={sessionData.nextLabel}
							></Button>
						</Group>
					</Group>
				</Stack>
			</Container>
		</Stack>
	);
}
