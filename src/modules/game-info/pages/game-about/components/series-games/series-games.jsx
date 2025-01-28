import { memo, useRef } from 'react';
import SectionWithSlide from '../../../../../../components/SectionWithSlide/SectionWithSlide';
import cls from './style.module.css';
import { useQuery } from '@tanstack/react-query';
import { getGamesSeries } from './api/getGamesSeries';

const SeriesGames = memo(function SeriesGames({
	seriesId,
	currentGame,
	sectionTitle,
}) {
	const content = useRef();

	const { data, isSuccess, isLoading, isError } = useQuery({
		queryKey: [`get-similar-games-${seriesId}`],
		queryFn: () => getGamesSeries(seriesId),
	});

	if (isLoading) {
		content.current = <p>Loading...</p>;
	}

	if (isError) {
		content.current = <p>Error</p>;
	}

	if (isSuccess) {
		content.current = (
			<SectionWithSlide
				sectionTitle={`${sectionTitle} ${currentGame.series.title}`}
				slides={data.results}
				filterId={currentGame.id}
			/>
		);
	}

	return (
		<section className={cls.similarGames}>
			<div className={cls.blurBg}>{content.current}</div>
		</section>
	);
});

export default SeriesGames;
