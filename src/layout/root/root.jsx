import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../footer/footer';
// import MainBg from '../../assets/main-bg.jpg';
import MainBg from '../../assets/main-bg.webp';
import { useStore } from '../../store';
import { Modal } from '../../UI';
import {
	useEffect,
	// useRef,
	useState,
} from 'react';
import ScrollToTop from '../../components/ScrollToTop';
import Loading from '../../UI/Loading/Loading';
import { BasketCard } from '../../modules';
import SelectConsole from '../../pages/rent-games/components/select-console/select-console';
import { hashString } from '../../helpers/hashString';
import WebApp from '@twa-dev/sdk';
import { checkUserConsole } from '../../pages/rent-games/api/checkConsole';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAndCreateBasket } from './api/getAndCreateBasket';
import parse from 'html-react-parser';
import { removeMessages } from './api/removeMessages';

// const allContentVariants = {
// 	isHidden: {
// 		opacity: 0,
// 	},
// 	isVisible: {
// 		opacity: 1,
// 	},
// };

const Root = () => {
	const [openConsoleModal, setOpenConsoleModal] = useState(false);
	// const container = useRef();
	const {
		XsIsOpen,
		changeXsIsOpen,
		XsText,
		setBasketBottomSheet,
		loading,
		setIsAdmin,
		setBasketId,
		setBasketGamesCount,
		setBasketGamesId,
		XsTitle,
		isGamePass,
		setIsGamePass
	} = useStore((state) => state);

	// eslint-disable-next-line no-unused-vars
	const { data: basket, isSuccess: basketCreateIsSuccess } = useQuery({
		queryKey: ['create-basket'],
		queryFn: () =>
			getAndCreateBasket({
				id: WebApp?.initDataUnsafe?.user?.id || 1147564292,
			}),
	});

	useEffect(() => {
		if (basketCreateIsSuccess && basket) {
			setBasketId(basket.basket_id);
			setBasketGamesCount(basket.items.length + basket.subs.length);
			setBasketGamesId(basket.current_item_ids);
		}
	}, [
		basketCreateIsSuccess,
		setBasketId,
		basket,
		setBasketGamesCount,
		setBasketGamesId,
	]);

	const [hash, setHash] = useState();

	const location = useLocation();

	const { mutate } = useMutation({
		mutationFn: removeMessages,
		onSettled: () => {
			setBasketBottomSheet(true);
		},
	});

	useEffect(() => {
		switch (location.pathname) {
			case '/basket':
				setBasketBottomSheet(true);
				return;
			case '/basket/remove-messages':
				if (basket?.basket_id)
					mutate({
						client_id: WebApp?.initDataUnsafe?.user?.id || 1147564292,
						basket_id: basket.basket_id,
					});
				return;
			default:
				return;
		}
	}, [basket?.basket_id, location, mutate, setBasketBottomSheet]);

	const { data, isSuccess } = useQuery({
		queryKey: ['user-info'],
		queryFn: () =>
			checkUserConsole({
				token: hash,
				id: WebApp?.initDataUnsafe?.user?.id || 1147564292, //815737483
			}),
		enabled: hash !== undefined,
	});

	useEffect(() => {
		hashString(
			import.meta.env.VITE_AUTH_TOKEN +
				(WebApp?.initDataUnsafe?.user?.id || 1147564292) //815737483
		).then((hash) => {
			setHash(hash);
		});
	}, []);

	useEffect(() => {
		if (isSuccess) {
			if (!data.console) {
				setOpenConsoleModal(true);
			}
			setIsAdmin(data.is_admin);
		}
	}, [data, isSuccess, setIsAdmin]);

	return (
		<>
			<ScrollToTop />
			<img className='main-bg' src={MainBg} alt='Main bg' />
			<Loading loading={loading} />
			<SelectConsole
				openConsoleModal={openConsoleModal}
				setOpenConsoleModal={setOpenConsoleModal}
			/>
			<div style={{ opacity: 1 }} className='allContent'>
				<Outlet />
				<Modal
					isGamePass={isGamePass}
					setIsGamePass={setIsGamePass}
					isOpen={XsIsOpen}
					setIsopen={changeXsIsOpen}
				>
					<div className='xs-info'>
						<h3 className='xs-title section-title'>{XsTitle}</h3>
						<p>{parse(XsText)}</p>
					</div>
				</Modal>
				<BasketCard />
			</div>
			<Footer />
		</>
	);
};

export default Root;
