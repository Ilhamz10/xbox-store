// import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
	ChatIcon,
	QuestionIcon,
	OrdersIcon,
	TGIcon,
	VKIcon,
	YoutubeIcon,
	WifiIcon,
	IphoneSettingsIcon,
	InfoIcon,
} from '../../assets';
import cls from './account.module.css';
import { AccountButton } from './UI';
// import { getUserData } from './api/getUserData';
import WebApp from '@twa-dev/sdk';
import { hashString } from '../../helpers/hashString';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserData } from './api/getUserData';
import { changeConsole } from '../rent-games/components/select-console/api/changeConsole';
import { Icon } from '@iconify/react/dist/iconify.js';
import ConsolesModal from './component/ConsolesModal/ConsolesModal';
import { useStore } from '../../store';

const settings1 = [
	{
		text: 'Мои покупки',
		iconContBg: '#0284c7',
		Icon: OrdersIcon,
		onClick: () => {
			window.location = 'https://t.me/XboxRent_Bot?start=my_purchases_webapp';
			WebApp.close();
		},
	},
	{
		text: 'Статьи',
		iconContBg: '#0284c7',
		Icon: InfoIcon,
		onClick: () => {
			window.location = 'https://t.me/XboxRent_Bot?start=my_purchases_webapp';
			WebApp.close();
		},
	},
	{
		text: 'Поддержка',
		iconContBg: '#fb923c',
		Icon: QuestionIcon,
		onClick: () => {
			window.location = 'https://t.me/XboxRent_Bot?start=support_webapp';
			WebApp.close();
		},
	},
	{
		text: 'Настройки',
		iconContBg: '#3b82f6',
		Icon: IphoneSettingsIcon,
		fullIcon: true,
		onClick: () => {
			window.location = 'https://t.me/XboxRent_Bot?start=cabinet_webapp';
			WebApp.close();
		},
	},
];

const settings2 = [
	{
		text: 'Telegram канал XboxRent',
		iconContBg: '#05a2f3',
		Icon: TGIcon,
		onClick: () => {
			window.location = 'https://t.me/Xbox_Rent';
			WebApp.close();
		},
	},
	{
		text: 'В Контакте',
		iconContBg: '#3576b6',
		Icon: VKIcon,
		onClick: () => {
			window.location = 'https://vk.com/xbox_one_g';
		},
	},
	{
		text: 'Беседа XboxRent',
		iconContBg: '#18a34a',
		Icon: ChatIcon,
		onClick: () => {
			window.location = 'https://t.me/XboxRentChat';
			WebApp.close();
		},
	},
	{
		text: 'YouTube - XboxRent',
		iconContBg: '#fff',
		Icon: YoutubeIcon,
		onClick: () => {
			window.location = 'https://youtube.com/@xbox_one_g?si=yYOwRnE5jBAco38H';
		},
	},
	{
		text: 'Настройка DNS',
		iconContBg: '#929198',
		Icon: WifiIcon,
	},
];

const consoles = {
	xbox_series_x_s: 'Xbox Series X|S',
	xbox_one: 'Xbox One',
};

export const Account = () => {
	const [hash, setHash] = useState();
	const [alertIsOpen, setAlertIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);
	const { setLoading } = useStore((state) => state);

	const { data, isLoading, isSuccess, isError } = useQuery({
		queryKey: [`user-info`],
		queryFn: () =>
			getUserData({
				token: hash,
				id: WebApp?.initDataUnsafe?.user?.id,
			}),
		enabled: hash !== undefined,
	});

	const { mutate } = useMutation({
		mutationFn: changeConsole,
		onMutate: async (data) => {
			const newConsole = data.consoleType;
			await queryClient.cancelQueries({ queryKey: ['user-info'] });
			const previousUserData = queryClient.getQueryData(['user-info']);

			queryClient.setQueryData(['user-info'], {
				...previousUserData,
				console: newConsole,
			});

			return { previousUserData };
		},
		onError: (error, data, context) => {
			queryClient.setQueryData(['user-info'], context.previousUserData);
		},
		onSettled: () => {
			queryClient.invalidateQueries(['user-info']);
		},
		onSuccess: () => {
			setAlertIsOpen(true);
		},
	});

	function handleSelectConsole(consoleType) {
		hashString(import.meta.env.VITE_AUTH_TOKEN + WebApp?.initDataUnsafe?.user?.id).then((hash) => {
			mutate({
				token: hash,
				id: WebApp?.initDataUnsafe?.user?.id,
				consoleType,
			});
		});
	}

	useEffect(() => {
		hashString(
			import.meta.env.VITE_AUTH_TOKEN +
				(WebApp?.initDataUnsafe?.user?.id)
		).then((hash) => {
			setHash(hash);
		});
	}, []);

	useEffect(() => {
		if (WebApp) {
			console.log(WebApp?.initDataUnsafe);
		}
	}, []);

	useEffect(() => {
		if (isSuccess) {
			setLoading(false);
		}
	}, [isSuccess, setLoading]);

	if (isError) {
		return <p>Произошла ошибка</p>;
	}

	if (isLoading) {
		return (
			<Icon
				style={{ margin: '0 auto' }}
				width={30}
				height={30}
				icon='eos-icons:loading'
			/>
		);
	}

	return (
		<main className={`${cls.accountMain}`}>
			<div className='wrapper'>
				{isSuccess && data.user_image && (
					<img
						className={cls.userPhoto}
						src={`data:image/png;base64, ${data.user_image}`}
						alt=''
					/>
				)}
				<h2 className={cls.fullName}>
					{WebApp?.initDataUnsafe?.user
						? `${WebApp.initDataUnsafe.user.first_name} ${WebApp.initDataUnsafe.user.last_name}`
						: 'User'}
				</h2>
				<p className={cls.userName}>
					Ваш баланс: {isSuccess ? data.balance : '0'} ₽
				</p>
				<div className={cls.consoleButton}>
					<h2 style={{ fontSize: '1.15rem' }} className='section-title'>
						Ваша консоль - {consoles[data?.console]}
					</h2>
					<button onClick={() => setIsOpen(true)}>
						<Icon
							style={{ display: 'block' }}
							width={25}
							height={25}
							icon='cuida:edit-outline'
						/>
					</button>
				</div>
				<div className={cls.allButtons}>
					<ConsolesModal
						handleSelectConsole={handleSelectConsole}
						data={data}
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						alertIsOpen={alertIsOpen}
						setAlertIsOpen={setAlertIsOpen}
					/>
					<div className={cls.buttons}>
						{settings1.map((s, i) => (
							<AccountButton
								key={i}
								isLast={i === settings1.length - 1}
								fullIcon={s.fullIcon}
								onClick={s.onClick}
								className={cls.accountBtn}
								Icon={s.Icon}
								iconContBg={s.iconContBg}
								text={s.text}
								subText={
									data && i === 0
										? data?.orders_count
										: i === 1
										? data?.articles_count
										: ''
								}
							/>
						))}
					</div>
					<div className={cls.buttons}>
						{settings2.map((s, i) => (
							<AccountButton
								key={i}
								isLast={i === settings2.length - 1}
								className={cls.accountBtn}
								onClick={s.onClick}
								Icon={s.Icon}
								iconContBg={s.iconContBg}
								text={s.text}
							/>
						))}
					</div>
				</div>
			</div>
		</main>
	);
};
