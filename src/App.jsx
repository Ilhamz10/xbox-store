import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import Root from './layout/root/root';
import { Account, RentGames, Search } from './pages';
import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import BuyGames from './pages/buy-games/BuyGames';
import NotFound from './pages/404/404';
import WorkInProgress from './pages/work-in-progress/WorkInProgress';
import ForAdmins from './components/ForAdmins';
// import Subscriptions from './pages/subscriptions/Subscriptions';

const router = createHashRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{
				path: '/',
				element: <RentGames />,
			},
			{ path: '/account', element: <Account /> },
			{ path: '/basket', element: <RentGames /> },
			{ path: '/basket/remove-messages', element: <RentGames /> },
			{ path: '/:anything', element: <NotFound /> },
			{
				path: '/buy-games',
				element: (
					<ForAdmins
						PageForAdmin={<BuyGames />}
						PageForUsers={<WorkInProgress title='Покупки игр' />}
					/>
				),
			},
			// {
			// 	path: '/subscriptions',
			// 	element: <Subscriptions />,
			// },
			{
				path: '/subscriptions',
				element: <WorkInProgress title='Подписки' />,
			},
			{
				path: '/currency',
				element: <WorkInProgress title='Валюта' />,
			},
		],
	},
	{
		path: '/search',
		element: <Search />,
	},
]);

function App() {
	const queryClient = new QueryClient();

	useEffect(() => {
		WebApp.ready();
		WebApp.expand();
		WebApp.setHeaderColor('#172729');
		WebApp.disableVerticalSwipes(false);
		if (window?.telegram?.WebApp)
			window?.telegram?.WebApp?.setBottomBarColor('#172729');

		function handleOrientationChange() {
			if (window.orientation === 90) {
				window.orientation === 0;
			}
		}

		document.getElementById('root').style.height = `${WebApp.viewportHeight}px`;

		window.addEventListener('orientationchange', handleOrientationChange);

		return () =>
			window.removeEventListener('orientationchange', handleOrientationChange);
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

export default App;
