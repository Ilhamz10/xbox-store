import { memo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon } from '../../assets';
import SectionWithSlide from '../../components/SectionWithSlide/SectionWithSlide';
import { getAllGames } from '../AllGames/api/getAllGames'
import cls from './NewGames.module.css';

const NewGames = memo(function NewPredictionGames() {
	const content = useRef(null);
	const { data, isLoading, isSuccess, isError } = useQuery({
		queryKey: ['new-games'],
		queryFn: () => getAllGames('-release_date', 1, null, 15),
	});

	if (isLoading) {
		content.current = <p className='wrapper'>Loading...</p>;
	}

	if (isError) {
		content.current = <p className='wrapper'>При загрузке произошла ошибка</p>;
	}

	if (isSuccess) {
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
						SectionIcon={CalendarIcon}
						sectionTitle={'Новинки игр'}
						slides={data.results}
					/>
				</div>
			</section>
		);
	}

	return <>{content.current}</>;
});

export default NewGames;
