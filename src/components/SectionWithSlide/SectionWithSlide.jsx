import { Swiper, SwiperSlide } from 'swiper/react';
import GameCard from '../GameCard/GameCard';

import Button from '../../UI/Button/Button';
import DropdownIcon from '../../assets/icons/dropdown-arrows-icon.svg?react';
import cls from './SectionWithSlide.module.css';
import { useStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';

const SectionWithSlide = ({
	sectionTitle,
	SectionIcon,
	allBtnOnClick,
	slides,
	iconSize = 24,
	withFilter = false,
	bigCards = false,
	withAllBtn = false,
	filterId = 0,
}) => {
	const { setGameInfoBottomSheetIsOpen, setActiveGame } = useStore(
		useShallow((state) => state)
	);

	function handleOpenGameInfoBottomSheet(game) {
		setActiveGame(game);
		setGameInfoBottomSheetIsOpen(true);
	}

	return (
		<>
			<div className={`wrapper section-header`}>
				<h3 className='section-title'>
					{SectionIcon && <SectionIcon width={iconSize} height={iconSize} />}{' '}
					{sectionTitle}
				</h3>
				{withFilter && (
					<Button Icon={DropdownIcon} iconSize={16}>
						За неделю
					</Button>
				)}
				{withAllBtn && <Button onClick={allBtnOnClick}>Все</Button>}
			</div>
			<div>
				<Swiper
					nested
					className={`swiper swiper-initialized swiper-horizontal ${cls.slider}`}
					style={{
						padding: '0 1rem',
					}}
					spaceBetween={15}
					slidesPerView={2.3}>
					{slides.map(
						(game) =>
							game.id !== filterId && (
								<SwiperSlide key={game.id}>
									<GameCard
										release_date={game.release_date}
										preOrder={game.pre_order}
										onClick={() => handleOpenGameInfoBottomSheet(game)}
										game={game}
										xs={game.compatibility === 'xbox_series_x_s'}
										gameTitle={game.title}
										gamePrice={game.price}
										subprice={game.subprice}
										imgSrc={game.image}
										lang={game.voice_acting}
										size={bigCards ? 'lg' : 'md'}
										in_game_pass={game.in_game_pass}
									/>
								</SwiperSlide>
							)
					)}
				</Swiper>
			</div>
		</>
	);
};

export default SectionWithSlide;
