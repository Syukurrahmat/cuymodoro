import '@mantine/core/styles.css';
import { createRoot } from 'react-dom/client';
import App from './components/Layout.tsx';
import './index.css';

import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/nprogress/styles.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DBProvider } from './lib/database/DBProvider.tsx';
import FocusPage from './pages/focus.tsx';
import Home from './pages/home.tsx';
import PreparePage from './pages/prepare.tsx';
import RestPage from './pages/rest.tsx';

const theme = createTheme({
	fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
	defaultRadius: 'md',
});

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <Home /> },
			{
				path: '/prepare',
				element: <PreparePage />,
			},
			{ path: '/focus', element: <FocusPage /> },
			{ path: '/rest', element: <RestPage /> },
			{ path: '/complete', element: 'www' },
		],
	},
]);

createRoot(document.getElementById('root')!).render(
	<MantineProvider theme={theme}>
		<DBProvider>
			<RouterProvider router={router} fallbackElement="qq" />
		</DBProvider>
	</MantineProvider>
);
