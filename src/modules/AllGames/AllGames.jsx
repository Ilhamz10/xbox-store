import GameCard from '../../components/GameCard/GameCard';
import { games } from '../../consts/games';
import Button from '../../UI/Button/Button';
import { AnimatePresence, motion } from 'framer-motion';

import cls from './AllGames.module.css';
import FilterIcon from '../../assets/icons/filter-icon.svg?react';
import DropdownIcon from '../../assets/icons/dropdown-arrows-icon.svg?react';
import { useState } from 'react';
import { useStore } from '../../store';
// import { useQuery } from '@tanstack/react-query';
// import { getAllGames } from './api/getAllGames';
import { FilterButton, Modal } from '../../UI';
import { num_word } from '../../helpers';
import useScrollDirection from '../../hooks/useScrollDirection';

const MotionGameCard = motion(GameCard);
const MotionButton = motion(Button);

const AllGames = ({ sectionTitle, inBottomSheet, scrollContainerRef }) => {
	const variants = [
		{
			up: {
				bottom: inBottomSheet ? '110px' : '82px',
			},
			down: {
				bottom: '0px',
			},
		},
		{
			up: {
				bottom: inBottomSheet ? '165px' : '137px',
			},
			down: {
				bottom: '0px',
			},
		},
	];

	// const { data } = useQuery({
	// 	queryKey: ['all-games'],
	// 	queryFn: getAllGames,
	// });
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
		setIsEnd
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
		setActiveGame(game)
		setGameInfoBottomSheetIsOpen(true)
	}

	return (
		<>
			<section style={{ position: 'relative', zIndex: 1 }}>
				<div className='wrapper'>
					{sectionTitle && (
						<div
							style={inBottomSheet && { marginTop: 0 }}
							className={cls.sectionHeader}>
							<h2 className='section-title'>
								{sectionTitle}{' '}
								<span style={{ fontSize: '14px' }}>
									(285 {num_word(285, ['позиция', 'позиции', 'позиций'])})
								</span>
							</h2>
						</div>
					)}
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
						{games.map((game, i) => (
							<div className={cls.gameCarCont} key={game.id}>
								<MotionGameCard
									onClick={() => handleOpenGameInfoBottomSheet(game)}
									game={game}
									xs={game.xs}
									gameTitle={game.gameTitle}
									gamePrice={game.gamePrice}
									gameDiscountPrice={game.gameDiscountPrice}
									imgSrc={game.imgSrc}
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
						))}
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

export default AllGames;
