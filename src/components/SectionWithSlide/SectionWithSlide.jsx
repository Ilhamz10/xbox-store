import { Swiper, SwiperSlide } from 'swiper/react';
import GameCard from '../GameCard/GameCard';

import Button from '../../UI/Button/Button';
import DropdownIcon from '../../assets/icons/dropdown-arrows-icon.svg?react';
import cls from './SectionWithSlide.module.css';
import { useStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';
import { ArrowIcon } from '../../assets'

const SectionWithSlide = ({
	sectionTitle,
	SectionIcon,
	allBtnOnClick,
	clueOnClick,
	slides,
	iconSize = 24,
	withFilter = false,
	clueBtnIcon,
	bigCards = false,
	homeSalePrice = false,
	withAllBtn = false,
	sub = '',
	filterId = 0,
}) => {
	const {
		setGameInfoBottomSheetIsOpen,
		setActiveGame,
		setIsFromHomeSale,
		setMainSubBottomSheetIsOpen,
		setMainSubscription
	} = useStore(useShallow((state) => state));

	function handleOpenGameInfoBottomSheet(game) {
		if (sub) {
			setMainSubscription(game);
			setMainSubBottomSheetIsOpen(true);
		} else {
			setActiveGame(game);
			setGameInfoBottomSheetIsOpen(true);
			setIsFromHomeSale(homeSalePrice);
		}
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
				{clueBtnIcon && (
					<Button onClick={clueOnClick}>
						{clueBtnIcon}
					</Button>
				)}
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
								<SwiperSlide style={{ width: 200, height: 250 }} key={game.id}>
									<GameCard
										release_date={game.release_date}
										preOrder={game.pre_order}
										onClick={() => handleOpenGameInfoBottomSheet(game)}
										game={game}
										xs={game.compatibility === 'xbox_series_x_s'}
										gameTitle={game.title}
										gamePrice={homeSalePrice ? game.home_price : game.price}
										subprice={!homeSalePrice && game.subprice}
										imgSrc={game.image}
										lang={game.voice_acting}
										size={bigCards ? 'lg' : 'md'}
										in_game_pass={game.in_game_pass}
										isDayGame
									/>
								</SwiperSlide>
							)
					)}
					{withAllBtn && (
						<SwiperSlide className={cls.slideBtn}>
							<Button onClick={allBtnOnClick}>
								<ArrowIcon width={20} height={20} />
							</Button>
						</SwiperSlide>
					)}
				</Swiper>
			</div>
		</>
	);
};

export default SectionWithSlide;
