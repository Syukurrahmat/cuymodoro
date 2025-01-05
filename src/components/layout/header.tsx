import { Container, Group, Select, ThemeIcon, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconHourglassHigh, IconStar } from '@tabler/icons-react';
import { useState } from 'react';
import { useMatch } from 'react-router-dom';
import RestLevel, { LOCALSTORAGE_RESTLEVEL_KEY } from '../../lib/restLevel';

export default function Header({ colorTheme }: { colorTheme: string }) {
	const isHome = Boolean(useMatch('/'));

	const [selectIsOpen, setSelectIsOpen] = useState(false);
	const [level, setLevel] = useLocalStorage<TaskLevel>({
		key: LOCALSTORAGE_RESTLEVEL_KEY,
		defaultValue: 'regular',
	});

	return (
		<Container component={Group} size="sm" h="100%" px="0">
			<Group gap="6" flex="1">
				<ThemeIcon color={colorTheme} variant="transparent" size="lg">
					<IconHourglassHigh size="28" />
				</ThemeIcon>
				<Title size="h3" c={colorTheme}>
					Cuyomoro
				</Title>
			</Group>
			<Select
				w="120px"
				bg="transparent"
				radius="md"
				disabled={!isHome}
				color={colorTheme}
				onBlur={() => setSelectIsOpen(false)}
				onClick={() => setSelectIsOpen(true)}
				dropdownOpened={selectIsOpen}
				styles={{
					input: { background: 'transparent' },
					root: { userSelect: 'none' },
				}}
				rightSectionProps={{
					style: { display: 'none' },
				}}
				allowDeselect={false}
				leftSection={<IconStar size="18" />}
				checkIconPosition="right"
				data={RestLevel.levelList}
				value={level}
				onChange={(e) => {
					setSelectIsOpen(false);
					setLevel(e as TaskLevel);
				}}
			/>
		</Container>
	);
}
