import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

import './index.css';

import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { DBProvider } from './database/DBProvider.tsx';
import { router } from './router/router.tsx';

const theme = createTheme({
	fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
	defaultRadius: 'md',
});

createRoot(document.getElementById('root')!).render(
	<MantineProvider theme={theme}>
		<DBProvider>
			<RouterProvider router={router} fallbackElement="qq" />
		</DBProvider>
	</MantineProvider>
);
