import { useQuery } from '@tanstack/react-query';
import cls from './similar-games.module.css';
import { getSimilarGames } from './api/getSimilarGames';
import { memo, useRef } from 'react';
import SectionWithSlide from '../../../../../../components/SectionWithSlide/SectionWithSlide';

const SimilarGames = memo(function SimilarGames({
	categoryId,
	currentGame,
	sectionTitle,
	reverse = false,
}) {
	const content = useRef();

	const { data, isSuccess, isLoading, isError } = useQuery({
		queryKey: [`get-similar-games-${categoryId}`],
		queryFn: () => getSimilarGames(categoryId),
	});

	if (isLoading) {
		content.current = <p>Loading...</p>;
	}

	if (isError) {
		content.current = <p>Error</p>;
	}

	if (isSuccess) {
		const copyOfGames = [...data.results];
		const reversedGames = [...data.results].reverse();

		content.current = (
			<SectionWithSlide
				sectionTitle={sectionTitle}
				slides={reverse ? reversedGames : copyOfGames}
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

export default SimilarGames;
