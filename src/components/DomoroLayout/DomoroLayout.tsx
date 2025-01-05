import {
	ActionIcon,
	Box,
	Button,
	Container,
	Group,
	Progress,
	rem,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import {
	IconFocusCentered,
	IconPictureInPicture,
	IconRocket,
	IconZzz,
} from '@tabler/icons-react';
import { useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AppContext } from '../Layout/Layout';

const DomoroSessionData = {
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

interface DomoroSession {
	taskName: string;
	timeInfo: string;
	timeCount: string;
	nextTaskName?: string;
	type: 'focus' | 'break';
	onStop: () => void;
	onNext: () => void;
	progress?: number;
}

export default function DomoroLayout({
	type,
	progress,
	timeCount,
	onNext,
	onStop,
	timeInfo,
	nextTaskName,
	taskName,
}: DomoroSession) {
	const sessionData = DomoroSessionData[type];
	const ref = useRef<HTMLDivElement>(null);
	const { isSupportPIP, colorTheme } = useOutletContext<AppContext>();

	const dddd = () => {
		(window as any).documentPictureInPicture
			.requestWindow()
			.then((pipWindow: any) => {
				// Copy style sheets over from the initial document
				// so that the player looks the same.
				[...document.styleSheets].forEach((styleSheet) => {
					try {
						const cssRules = [...styleSheet.cssRules]
							.map((rule) => rule.cssText)
							.join('');
						const style = document.createElement('style');

						style.textContent = cssRules;
						pipWindow.document.head.appendChild(style);
					} catch (e) {
						const link = document.createElement('link');

						link.rel = 'stylesheet';
						link.type = styleSheet.type;
						link.media = styleSheet.media;
						link.href = styleSheet.href;
						pipWindow.document.head.appendChild(link);
					}
				});

				pipWindow.document.body.append(ref.current);
			});
	};

	return (
		<Stack className="fullHeightContainer" ref={ref}>
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
					className="font-mono"
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
						{isSupportPIP ? (
							<ActionIcon
								onClick={dddd}
								size={rem(36)}
								color={colorTheme}
								variant="light"
								children={<IconPictureInPicture size="20" />}
							/>
						) : (
							<div />
						)}

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
