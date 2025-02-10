import { useQuery } from '@tanstack/react-query';
import { getSubs } from './api/getSubs';
import { useStore } from '../../store';
import { useEffect, useRef } from 'react';
import SubsSectionSlide from './components/SubsSectionSlide/SubsSectionSlide';
import subsMainBg from '../../assets/imgs/gamepass-main-bg.jpg';

import cls from './style.module.css';

const Subscriptions = () => {
	const content = useRef(null);
	const { setLoading } = useStore((state) => state);

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ['all-subs'],
		queryFn: getSubs,
	});

	useEffect(() => {
		if (isSuccess) setLoading(false);
		if (isLoading) setLoading(true);
	}, [setLoading, isSuccess, isLoading]);

	if (isSuccess) {
		setLoading(false);
		content.current = [];
		let index = 0;
		data.results.forEach((result) => {
			if (result.is_carousel) {
				content.current.push(
					result.types.map((type) => {
						index++;
						if (index % 2 !== 0)
							return (
								<section key={type.id}>
									<SubsSectionSlide
										sectionTitle={`${result.title} ${
											type.name === '-' ? '' : type.name
										}`}
										slides={type.periods}
										slideImg={type.image || result.image}
										additionalInfo={type.additional_info}
										sectionIcon={type.icon}
									/>
								</section>
							);
						else {
							return (
								<section
									key={type.id}
									style={{
										backgroundImage: `url(${result.wallpaper})`,
										position: 'relative',
										zIndex: 2,
									}}
									className={cls.NewPredictionGames}>
									<div className={cls.blurBg}>
										<SubsSectionSlide
											sectionTitle={`${result.title} ${
												type.name === '-' ? '' : type.name
											}`}
											slides={type.periods}
											slideImg={type.image || result.image}
											additionalInfo={type.additional_info}
											sectionIcon={type.icon}
										/>
									</div>
								</section>
							);
						}
					})
				);
			}
		});
	}

	return (
		<main style={{ paddingBottom: '72px' }}>
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
