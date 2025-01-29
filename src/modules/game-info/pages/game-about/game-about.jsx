import { memo } from 'react';
import { IphoneShareIcon } from '../../../../assets';
import { handleTelegramShare } from '../../../../helpers/handleTelegramShare';
import SeriesGames from './components/series-games/series-games';
import SimilarGames from './components/similar-games/similar-games';
import cls from './game-about.module.css';

const GameAbout = memo(function GameAbout({ data, setBigImage }) {
	console.log('Game about is renders');

	return (
		<>
			<div className='wrapper'>
				<div className={cls.gameTitle}>
					<img
						onClick={() => setBigImage(data.image)}
						src={data.image}
						alt=''
					/>
					<div>
						<h2>{data.title}</h2>
						<span>
							{data.release_date &&
								`${new Date(data.release_date)
									.toLocaleDateString()
									.replace(/\//g, '.')} • `}
							{data.categories.map(
								(category, i, categories) =>
									`${category.name} ${i < categories.length - 1 ? '& ' : ''}`
							)}
						</span>
					</div>
				</div>
				<div className={cls.labelsCont}>
					<div className={cls.labels}>
						<div className={cls.label}>
							Язык озвучки{' '}
							{data.voice_acting === 'russian' ? 'Русский' : 'Английский'}
						</div>
						<div className={cls.label}>
							Язык субтитров{' '}
							{data.subtitles === 'russian' ? 'Русский' : 'Английский'}
						</div>
						{data.has_hdr && <div className={cls.label}>Поддержка HDR</div>}
						<div className={cls.label}>Разрешение {data.resolution}</div>
						{data.publisher && (
							<div className={cls.label}>Издатель {data.publisher}</div>
						)}
						{data.developer && (
							<div className={cls.label}>Разработчик {data.developer}</div>
						)}
					</div>
					{/* <button className={cls.sharebtnIcon}>
						<IphoneShareIcon width={25} height={25} />
					</button> */}
				</div>
				{data.pre_order && (
					<p className={cls.subText}>
						Дата выхода игры{' '}
						{new Date(data.release_date).toLocaleDateString('ru-Ru', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
						})}
						г
					</p>
				)}
				<p style={{ whiteSpace: 'pre-wrap' }} className={cls.gameInfoText}>
					{data.description}
				</p>
				<button
					onClick={() => handleTelegramShare(data)}
					className={cls.sharebtn}>
					<IphoneShareIcon width={20} height={20} />
					Поделиться карточкой
				</button>
			</div>
			{/* <SimilarGames
				categoryId={data.categories[0].id}
				currentGame={data}
				sectionTitle={'Похожие игры'}
			/> */}
			<div style={{ paddingBottom: '80px' }}>
				{data.categories.map((category, index) => (
					<SimilarGames
						key={category.id}
						categoryId={category.id}
						currentGame={data}
						sectionTitle={category.name}
						reverse={index % 2 !== 0}
					/>
				))}
				{data.series && (
					<SeriesGames
						currentGame={data}
						sectionTitle={'Серия игры'}
						seriesId={data.series.id}
					/>
				)}
			</div>
		</>
	);
});

export default GameAbout;
