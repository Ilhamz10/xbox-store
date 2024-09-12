import { useQuery } from '@tanstack/react-query';
import NewPredictionGamesIcon from '../../assets/icons/bestseller-icon.svg?react';
import SectionWithSlide from '../../components/SectionWithSlide/SectionWithSlide';
import { getPreorderGames } from './api/getPreorderGames';

import cls from './NewPredictionGames.module.css';
import { useRef } from 'react';

const NewPredictionGames = () => {
	const content = useRef(null);
	const { data, isLoading, isSuccess, isError } = useQuery({
		queryKey: ['preorder-games'],
		queryFn: () => getPreorderGames(),
	});

	if (isLoading) {
		content.current = <p className='wrapper'>Loading...</p>;
	}

	if (isError) {
		content.current = <p className='wrapper'>При загрузке произошла ошибка</p>;
	}

	if (isSuccess) {
		if (data.results.length === 0) content.current = <></>;
		else
			content.current = (
				<section
					style={{
						background: `url(${data.results[0].image})`,
						position: 'relative',
						zIndex: 2,
						marginBottom: 0,
					}}
					className={cls.NewPredictionGames}>
					<div className={cls.blurBg}>
						<SectionWithSlide
							SectionIcon={NewPredictionGamesIcon}
							sectionTitle={'Новинки игр по предзаказу'}
							slides={data.results}
						/>
					</div>
				</section>
			);
	}

	return <>{content.current}</>;
};

export default NewPredictionGames;
