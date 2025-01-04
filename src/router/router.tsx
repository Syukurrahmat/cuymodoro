import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import FocusPage from '../pages/focus';
import Home from '../pages/home';
import PreparePage from '../pages/prepare';
import RestPage from '../pages/rest';
import { Protection } from './Protection';
import Complete from '../pages/complete';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				element: <Protection />,
				children: [
					{ path: '/', element: <Home /> },
					{ path: '/prepare', element: <PreparePage /> },
					{ path: '/complete', element: <Complete /> },
				],
			},
			{
				element: <Protection onActiveOnly />,
				children: [
					{ path: '/focus', element: <FocusPage /> },
					{ path: '/rest', element: <RestPage /> },
				],
			},
		],
	},
]);
