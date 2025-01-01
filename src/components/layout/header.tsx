import { Container, Group, Select, ThemeIcon, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconHourglassHigh, IconStar } from '@tabler/icons-react';
import { useMatch } from 'react-router-dom';
import RestLevel, { LOCALSTORAGE_RESTLEVEL_KEY } from '../../lib/restLevel';

export default function Header() {
	const isHome = Boolean(useMatch('/'));

	const [level, setLevel] = useLocalStorage<TaskLevel>({
		key: LOCALSTORAGE_RESTLEVEL_KEY,
		defaultValue: 'regular',
	});

	return (
		<Container component={Group} size="sm" h="100%" px="xs">
			<Group gap="6" flex="1">
				<ThemeIcon variant="transparent" size="lg">
					<IconHourglassHigh size="28" />
				</ThemeIcon>
				<Title size="h3" c="blue">
					Domoro
				</Title>
			</Group>
			<Group gap="12">
				<Select
					w="150px"
					// variant="unstyled"
					// bg="blue.1"
					rightSectionProps={{
						style: {
							display: 'none',
						},
					}}
					radius="md"
					disabled={!isHome}
					style={{ borderRadius: 'var(--mantine-radius-default)' }}
					allowDeselect={false}
					leftSection={<IconStar size="18" />}
					checkIconPosition="right"
					data={RestLevel.levelList}
					value={level}
					onChange={(e) => {
						setLevel(e as TaskLevel);
					}}
				/>
			</Group>
		</Container>
	);
}
