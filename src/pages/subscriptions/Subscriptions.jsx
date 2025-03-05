import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useStore } from '../../store';
import subsMainBg from '../../assets/imgs/gamepass-main-bg.jpg';
import ubisoftBg from '../../assets/imgs/ubisoft-bg.jpg';
import esoPlusBg from '../../assets/imgs/eso-plus-bg.webp';
import eaPlayBg from '../../assets/imgs/ea-play-bg.webp';
import fortniteBg from '../../assets/imgs/fortnite-bg.webp';
import GameCard from '../../components/GameCard/GameCard';
import { MainSubModal } from './components/MainSubModal/MainSubModal';
import { OtherSubModal } from './components/OtherSubModal/OtherSubModal';
import { getSubs } from './api/getSubs';
import { HorizontalSub } from './components/HorizontalSub/HorizontalSub';
import cls from './style.module.css';

const Subscriptions = () => {
	const content = useRef(null);
	const {
		setLoading,
		basketBottomSheet,
		setMainSubscription,
		setMainSubBottomSheetIsOpen,
		setOtherSubBottomSheetIsOpen,
		setActiveSub,
		setActiveGame
	} = useStore(state => state);

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ['subscriptions'],
		queryFn: getSubs
	});

	function handleOpenModal(data, isFeed) {
		setMainSubscription(data);
		if (isFeed) setOtherSubBottomSheetIsOpen(true);
		else setMainSubBottomSheetIsOpen(true);
	}

	useEffect(() => {
		if (isLoading) setLoading(true);
		else if (isSuccess) setLoading(false);
	}, [isSuccess, isLoading, setLoading]);

	useEffect(() => {
			setActiveGame({});

			return () => {
				setActiveSub({});
				setMainSubBottomSheetIsOpen(false);
			}
		}, []);

	if (isSuccess) {
		const ubisoftData = data.results.find(r => r.id === 10);
		const gamePassData = data.results.find(r => r.id === 4);
		const fortniteData = data.results.find(r => r.id === 8);
		const esoPlusData = data.results.find(r => r.id === 9);
		const eaPlayData = data.results.find(r => r.id === 7);

		const otherSubs = data.results.filter(r => !([4, 7, 8, 9, 10].includes(r.id)));

		content.current = (
			<>
				<MainSubModal adjustPosition={basketBottomSheet} similarSubs={data.results} />
				<OtherSubModal adjustPosition={basketBottomSheet} similarSubs={data.results} />

				<div className={`${cls.firstSub} wrapper`}>
					<GameCard
						isDayGame
						imgSrc={gamePassData.image}
						gamePrice={`от ${gamePassData.price}`}
						gameTitle={gamePassData.title}
						onClick={() => handleOpenModal(gamePassData)}
					/>
				</div>
				<HorizontalSub
					background={ubisoftBg}
					title={ubisoftData.title}
					onClick={() => handleOpenModal(ubisoftData)}
				/>
				<div className={`${cls.inlineSubs} wrapper`}>
					<GameCard
						isDayGame
						imgSrc={fortniteBg}
						gamePrice={fortniteData.price}
						gameTitle={fortniteData.title}
						subprice={fortniteData.subprice}
						onClick={() => handleOpenModal(fortniteData)}
					/>
					<GameCard
						isDayGame
						imgSrc={esoPlusBg}
						gamePrice={esoPlusData.price}
						gameTitle={esoPlusData.title}
						subprice={esoPlusData.subprice}
						onClick={() => handleOpenModal(esoPlusData)}
					/>
				</div>
				<HorizontalSub
					background={eaPlayBg}
					title={eaPlayData.title}
					onClick={() => handleOpenModal(eaPlayData)}
				/>
				<div className={`${cls.subs} wrapper`}>
					{otherSubs.map(sub => (
						<GameCard
							isDayGame
							key={sub.id}
							imgSrc={sub.image}
							gamePrice={sub.price}
							gameTitle={sub.title}
							subprice={sub.subprice}
							onClick={() => handleOpenModal(sub, true)}
						/>
					))}
				</div>
			</>
		);
	}

	return (
		<main style={{ paddingBottom: '90px' }}>
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
