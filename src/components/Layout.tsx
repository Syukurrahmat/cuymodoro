import { AppShell } from '@mantine/core';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import Header from './layout/header';

function App() {
	const navigation = useNavigation();

	useEffect(() => {
		if (navigation.state == 'idle') nprogress.complete();
		else nprogress.start();
	}, [navigation.state]);

	return (
		<AppShell header={{ height: 60, offset: true }} padding="xs" bg="blue.0">
			<AppShell.Header
				bg="blue.1"
				style={{ borderColor: 'var(--mantine-color-blue-2)' }}
				children={<Header />}
			/>
			<AppShell.Main>
				<NavigationProgress color="red" />
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}

export default App;
