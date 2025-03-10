import { XboxIcon } from '../../assets';
import { SwiperSlide, Swiper } from 'swiper/react';
import GameCard from '../../components/GameCard/GameCard';
import { useQuery } from '@tanstack/react-query';
import { getSeriesGames } from './api/getSeriesGames';
import { memo, useEffect, useRef } from 'react';
import { useStore } from '../../store';

const SeriesGames = memo(function SeriesGames() {
	const content = useRef();
	const copyOfGames = useRef([]);
	const { setActiveSeries, setCategoryBottomSheetIsOpen } = useStore((state) => state);

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
		setActiveSeries({ id, name });
		setCategoryBottomSheetIsOpen(true);
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
				className={'swiper swiper-initialized swiper-horizontal'}
				style={{
					padding: '0 1rem',
				}}
				spaceBetween={20}
				slidesPerView={2.3}>
				{copyOfGames.current.map((serie) => (
					<SwiperSlide style={{ minWidth: 200 }} key={serie.id}>
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
		>
			<div>
				<div className={`wrapper section-header`}>
					<h3 className='section-title'>
						<XboxIcon /> Серии игр
					</h3>
				</div>
				{content.current}
			</div>
		</section>
	);
});

export default SeriesGames;
