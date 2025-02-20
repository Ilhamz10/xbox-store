import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useStore } from '../../store';
import subsMainBg from '../../assets/imgs/gamepass-main-bg.jpg';
import { GamePassModal } from './components/GamePassModal/GamePassModal';
import { getSubs } from './api/getSubs';
import cls from './style.module.css';

const Subscriptions = () => {
	const content = useRef(null);
	const {
		setLoading,
		basketBottomSheet,
		setGamePassSubscription,
		setGamePassBottomSheetIsOpen,
		setActiveSub,
		setActiveGame
	} = useStore(state => state);

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ['subscription-gamepass'],
		queryFn: () => getSubs(4)
	});

	useEffect(() => {
		if (isLoading) setLoading(true);
		else if (isSuccess) {
			setLoading(false);
			setGamePassSubscription(data);
		}
	}, [isSuccess, isLoading, setLoading]);

	useEffect(() => {
			setActiveGame({});

			return () => {
				setActiveSub({});
				setGamePassBottomSheetIsOpen(false)
			}
		}, []);

	if (isSuccess) {
		content.current = (
			<div
				onClick={() => setGamePassBottomSheetIsOpen(true)}
				className={`${cls.window} wrapper`}
			>
				<img
					src={data.image}
					alt="game-pass-image"
				/>

				<div className={cls.text}>
					<p>{data.title}</p>
				</div>
			</div>
		);
	}

	return (
		<main style={{ paddingBottom: '90px' }}>
			<GamePassModal adjustPosition={basketBottomSheet} />

			<section
				style={{ background: `url(${subsMainBg}) center/cover no-repeat` }}
				className={cls.subsMainBg}>
				<div style={{ position: 'relative' }} className='wrapper'>
					<h3 className={`${cls.categoryTitle}`}>Подписки</h3>
				</div>
				<div className={cls.backDrop} />
			</section>

			{content.current}
		</main>
	);
};

export default Subscriptions;
