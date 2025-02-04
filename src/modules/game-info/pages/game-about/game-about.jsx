import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import {
	IphoneShareIcon,
	RussianFlagIcon,
	USAFlagIcon,
	ShowAllIcon,
	SizeIcon,
} from '../../../../assets';
import { handleTelegramShare } from '../../../../helpers/handleTelegramShare';
import SeriesGames from './components/series-games/series-games';
import SimilarGames from './components/similar-games/similar-games';
import cls from './game-about.module.css';

const labelsContVariants = {
	open: { height: 'auto' },
	close: { height: '23px' },
};

const GameAbout = memo(function GameAbout({ data, setBigImage }) {
	const [showAll, setShowAll] = useState(false);

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
				<div className={cls.allLabelsCont}>
					<motion.div id='framer-div' variants={labelsContVariants} animate={showAll ? 'open' : 'close'} className={cls.labels}>
						{+data.size > 0 && (
							<div className={cls.label}>
								<SizeIcon />
								{data.size} ГБ
							</div>
						)}
						<div className={cls.label}>
							{data.subtitles === 'russian' ? (
								<RussianFlagIcon />
							) : (
								<USAFlagIcon />
							)}
							{data.subtitles === 'russian'
								? 'Русский текст'
								: 'Английский текст'}
						</div>
						<div className={cls.label}>
							{data.voice_acting === 'russian' ? (
								<RussianFlagIcon />
							) : (
								<USAFlagIcon />
							)}
							{data.voice_acting === 'russian'
								? 'Русская озвучка'
								: 'Английская озвучка'}
						</div>
						{data.resolution !== null && (
							<div className={cls.label}>
								{data.resolution.replace('_', ' ').toUpperCase()}
							</div>
						)}
						{data.has_hdr && <div className={cls.label}>HDR</div>}

						<>
							{data.publisher && (
								<div className={cls.label}>Издатель {data.publisher}</div>
							)}
							{data.developer && (
								<div className={cls.label}>Разработчик {data.developer}</div>
							)}
							{data.network_mode == 'yes' && (
								<div className={cls.label}>Есть сетевой режим</div>
							)}
							{data.in_game_pass && (
								<div className={cls.label}>Есть в Game Pass Ultimate</div>
							)}
						</>
					</motion.div>
					<button
						onClick={() => setShowAll((p) => !p)}
						className={`${cls.showBtn} ${showAll && cls.active}`}>
						{!showAll ? 'Всё' : 'Меньше'}
						<ShowAllIcon />
					</button>
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
