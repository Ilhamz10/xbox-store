import { XboxIcon } from '../../assets';
import cls from './series-games.module.css';
import { SwiperSlide, Swiper } from 'swiper/react';
import GameCard from '../../components/GameCard/GameCard';
import { useQuery } from '@tanstack/react-query';
import { getSeriesGames } from './api/getSeriesGames';
import { useEffect, useRef } from 'react';
import { useStore } from '../../store';

const SeriesGames = () => {
	const content = useRef();
	const copyOfGames = useRef([]);
	const { setActiveSeries, setCategoryBottomSheetIsOpen } = useStore(
		(state) => state
	);

	const { data, isLoading, isError, isSuccess } = useQuery({
		queryKey: ['get-series-games'],
		queryFn: getSeriesGames,
	});

	if (isLoading) {
		content.current = <p>Loading...</p>;
	}

	if (isError) {
		content.current = <p>Error</p>;
	}

	function handleOpenSeries(id, name) {
		setActiveSeries(id, name);
		setCategoryBottomSheetIsOpen(true);
	}

	useEffect(() => {
		if (isSuccess) {
			copyOfGames.current = [...data.results];
			const randomIndex = Math.floor(
				Math.random() * copyOfGames.current.length
			);

			[copyOfGames.current[0], copyOfGames.current[randomIndex]] = [
				copyOfGames.current[randomIndex],
				copyOfGames.current[0],
			];
		}
	}, [data, isSuccess]);

	if (isSuccess) {
		content.current = (
			<Swiper
				className={`swiper swiper-initialized swiper-horizontal ${cls.slider}`}
				spaceBetween={20}
				slidesPerView={2.3}>
				{copyOfGames.current.map((serie) => (
					<SwiperSlide key={serie.id}>
						<GameCard
							seriesCard={true}
							onClick={() => handleOpenSeries(serie.id, serie.title)}
							gameTitle={serie.title}
							imgSrc={serie.image}
							size={'md'}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		);
	}

	return (
		<section
			style={{
				background: 'rgb(0 0 0 / 0.2)',
				position: 'relative',
				padding: '2rem 0',
				zIndex: 2,
				marginBottom: 0,
			}}
			className={cls.NewPredictionGames}>
			<div className={cls.blurBg}>
				<div className={`wrapper section-header`}>
					<h3 className='section-title'>
						<XboxIcon /> Серии игр
					</h3>
				</div>
				<div className='wrapper-left'>{content.current}</div>
			</div>
		</section>
	);
};

export default SeriesGames;