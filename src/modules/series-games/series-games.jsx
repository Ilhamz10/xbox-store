import { XboxIcon } from '../../assets';
import cls from './series-games.module.css';
import { SwiperSlide, Swiper } from 'swiper/react';
import GameCard from '../../components/GameCard/GameCard';
import { useQuery } from '@tanstack/react-query';
import { getSeriesGames } from './api/getSeriesGames';
import { memo, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import Button from '../../UI/Button/Button';
import { getButtonInfoById } from '../../layout/root/api/getButtonInfoById';

const SeriesGames = memo(function SeriesGames() {
	const content = useRef();
	const copyOfGames = useRef([]);
	const {
		setActiveSeries,
		setCategoryBottomSheetIsOpen,
		changeXsIsOpen,
		setXsText,
		setXsTitle,
	} = useStore((state) => state);

	const { data, isLoading, isError, isSuccess } = useQuery({
		queryKey: ['get-series-games'],
		queryFn: getSeriesGames,
	});

	const {
		data: rentButtonInfo,
		// isLoading: rentButtonInfoIsLoading,
		isError: rentButtonInfoIsError,
		isSuccess: rentButtonInfoIsSuccess,
	} = useQuery({
		queryKey: ['rent-button-info'],
		queryFn: () => getButtonInfoById(1),
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

	function handleOpenInfo() {
		if (rentButtonInfoIsSuccess) {
			setXsTitle(rentButtonInfo.description);
			setXsText(rentButtonInfo.text);
		}
		changeXsIsOpen(true);
	}

	useEffect(() => {
		if (isSuccess) {
			copyOfGames.current = [...data.results];
			let currentIndex = copyOfGames.current.length;

			// While there remain elements to shuffle...
			while (currentIndex != 0) {
				// Pick a remaining element...
				let randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

				// And swap it with the current element.
				[copyOfGames.current[currentIndex], copyOfGames.current[randomIndex]] =
					[copyOfGames.current[randomIndex], copyOfGames.current[currentIndex]];
			}
		}
	}, [data, isSuccess]);

	if (isSuccess) {
		content.current = (
			<Swiper
				className={`swiper swiper-initialized swiper-horizontal ${cls.slider}`}
				style={{
					padding: '0 1rem',
				}}
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
				{content.current}
				<div className='wrapper'>
					{rentButtonInfoIsSuccess && (
						<Button onClick={handleOpenInfo} className={cls.aboutRentBtn}>
							{/* Информация о прокате игр! */}
							{rentButtonInfo.title}
						</Button>
					)}
					{rentButtonInfoIsError && <p>Произошла ошибка</p>}
				</div>
			</div>
		</section>
	);
});

export default SeriesGames;
