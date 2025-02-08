import { useState } from 'react';
import { FilterButton, Modal } from '../../UI';
import GameCard from '../GameCard/GameCard';
import { motion } from 'framer-motion';
import useScrollDirection from '../../hooks/useScrollDirection';
import Button from '../../UI/Button/Button';
import FilterIcon from '../../assets/icons/filter-icon.svg?react';
import DropdownIcon from '../../assets/icons/dropdown-arrows-icon.svg?react';
import cls from './GamesCont.module.css';
import { useStore } from '../../store';

const GamesCont = ({ inBottomSheet, scrollContainerRef, games }) => {
	const [filtersIsOpen, setFiltersIsOpen] = useState(false);
	const [sortIsOpen, setSortIsOpen] = useState(false);

	const {
		direction,
		increaseCounter,
		decreaseCounter,
		emptyCounter,
		setGameInfoBottomSheetIsOpen,
		setCountButtonUpIsShown,
		setActiveGame,
		setIsEnd,
		activeSeries,
		setIsFromHomeSale
	} = useStore((state) => state);

	useScrollDirection(inBottomSheet ? scrollContainerRef : undefined);

	function handleCardLeaveViewport() {
		if (direction === 'up') {
			decreaseCounter();
		}
	}

	function handleCardEnterViewport() {
		if (direction === 'down') {
			increaseCounter();
		}
	}

	function enterAllGamesSection() {
		setCountButtonUpIsShown(true);
		setIsEnd(false);
	}

	function leaveAllGamesSection() {
		setCountButtonUpIsShown(false);
		emptyCounter();
	}

	function handleOpenGameInfoBottomSheet(game) {
		setActiveGame(game);
		setGameInfoBottomSheetIsOpen(true);
		setIsFromHomeSale(false);
	}

	return (
		<>
			<section style={{ position: 'relative', zIndex: 1 }}>
				<div className='wrapper'>
					{!activeSeries && (
						<div className={cls.filterButtons}>
							<Button
								onClick={() => setSortIsOpen(true)}
								Icon={DropdownIcon}
								iconSize={16}>
								По умолчанию
							</Button>
							<Button
								onClick={() => setFiltersIsOpen(true)}
								Icon={FilterIcon}
								iconSize={16}>
								Все игры
							</Button>
						</div>
					)}
					<motion.div
						style={{
							position: 'absolute',
							left: '0',
							top: '170px',
							height: inBottomSheet
								? 'calc(100% - 70px - 170px)'
								: 'calc(100% - 70px)',
							width: '100%',
						}}
						onViewportEnter={enterAllGamesSection}
						onViewportLeave={leaveAllGamesSection}
					/>
					<div className={cls.allGamesCont}>
						{games.length > 0 ? (
							games.map((game, i) => (
								<div className={cls.gameCarCont} key={game.id}>
									<GameCard
										onClick={() => handleOpenGameInfoBottomSheet(game)}
										game={game}
										xs={game.compatibility === 'xbox_series_x_s'}
										gameTitle={game.title}
										gamePrice={game.price}
										subprice={game.subprice}
										imgSrc={game.image}
										lang={game.voice_acting}
										in_game_pass={game.in_game_pass}
									/>
									<motion.div
										onViewportEnter={handleCardEnterViewport}
										onViewportLeave={handleCardLeaveViewport}
										style={
											i % 2 === 0
												? { height: 0 }
												: { height: 0, transform: 'translateY(-70px)' }
										}
									/>
								</div>
							))
						) : (
							<p>Не нашли подходящих игр</p>
						)}
					</div>
				</div>

				<motion.div
					onViewportEnter={() => setIsEnd(true)}
					onViewportLeave={() => setIsEnd(false)}
					style={{ height: '0px' }}
				/>
			</section>
			<Modal
				className={inBottomSheet && cls.modal}
				isOpen={filtersIsOpen}
				setIsopen={setFiltersIsOpen}>
				<div className={cls.gameFilters}>
					<h3 className='section-title'>Фильтры</h3>
					<div className={cls.filters}>
						<FilterButton text={'Все игры'} isChecked={true} />
						<FilterButton text={'Полностью русские'} />
						<FilterButton text={'Версия для Series X/S'} />
						<FilterButton text={'Версия для Xbox One'} />
					</div>
				</div>
			</Modal>
			<Modal
				className={inBottomSheet && cls.modal}
				isOpen={filtersIsOpen}
				setIsopen={setFiltersIsOpen}>
				<div className={cls.gameFilters}>
					<h3 className='section-title'>Фильтры</h3>
					<div className={cls.filters}>
						<FilterButton text={'Все игры'} isChecked={true} />
						<FilterButton text={'Полностью русские'} />
						<FilterButton text={'Версия для Series X/S'} />
						<FilterButton text={'Версия для Xbox One'} />
					</div>
				</div>
			</Modal>
			<Modal
				className={inBottomSheet && cls.modal}
				isOpen={sortIsOpen}
				setIsopen={setSortIsOpen}>
				<div className={cls.gameFilters}>
					<h3 className='section-title'>Сортировка</h3>
					<div className={cls.filters}>
						<FilterButton text={'По умолчанию'} isChecked={true} />
						<FilterButton text={'По названию'} />
						<FilterButton text={'По алфавиту'} />
						<FilterButton text={'По дате релиза'} />
						<FilterButton text={'По популярности'} />
						<FilterButton text={'Сначала дешевые'} />
						<FilterButton text={'Сначала дорогие'} />
					</div>
				</div>
			</Modal>
		</>
	);
};

export default GamesCont;
