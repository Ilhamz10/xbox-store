import GameCard from '../../components/GameCard/GameCard';
import Button from '../../UI/Button/Button';
import { motion } from 'framer-motion';

import cls from './GamesFilteredBycategory.module.css';
import FilterIcon from '../../assets/icons/filter-icon.svg?react';
import DropdownIcon from '../../assets/icons/dropdown-arrows-icon.svg?react';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store';
import { useQuery } from '@tanstack/react-query';
import { getFilteredGames } from './api/getAllGames';
import { FilterButton, Modal } from '../../UI';
import useScrollDirection from '../../hooks/useScrollDirection';
import Loading from '../../UI/Loading/Loading';
import { Icon } from '@iconify/react/dist/iconify.js';

const MotionGameCard = motion(GameCard);

const GamesFilteredBycategory = ({ inBottomSheet, scrollContainerRef }) => {
	const [filtersIsOpen, setFiltersIsOpen] = useState(false);
	const [sortIsOpen, setSortIsOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [totalGames, setTotalGames] = useState(0);
	const content = useRef(null);
	const allGamesContRef = useRef(null);
	const gameCardRef = useRef(null);
	const isFirstLoading = useRef(true);

	const {
		emptyCounter,
		setGameInfoBottomSheetIsOpen,
		setIsFromHomeSale,
		setActiveGame,
		setIsEnd,
		categoryBottomSheetObj,
		activeSeries,
		voiceActing,
		isGamePass,
		setIsGamePass,
		setCountButtonUpIsShown,
		setCategoryGamesCount,
		setCounter,
	} = useStore((state) => state);

	const { data, isLoading, isSuccess, isError, isFetching } = useQuery({
		queryKey: [
			`categories-${categoryBottomSheetObj.id}-${page}`,
			`series-${activeSeries.id}`,
			`voice_acting_${voiceActing}`,
		],
		queryFn: () =>
			getFilteredGames(categoryBottomSheetObj.id, activeSeries.id, voiceActing, isGamePass, page),
	});

	useScrollDirection(inBottomSheet ? scrollContainerRef : undefined);

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

	function changePage() {
		if (!isFetching) {
			const maxPageCount = Math.ceil(totalGames / 20);

			if (page < maxPageCount) {
				isFirstLoading.current = false;
				setPage((prev) => prev + 1);
			}
		}
	}

	const allGames = useRef([]);

	function handleScroll() {
		const allGamesContTop =
			allGamesContRef.current?.getBoundingClientRect().top;
		const cardHeight = gameCardRef.current?.getBoundingClientRect().height + 16;

		const counterValue = (
			(allGamesContTop - window.innerHeight) /
			(cardHeight / 2)
		).toFixed(0);

		if (counterValue < 0) {
			setCounter(counterValue * -1);
		}
	}

	useEffect(() => {
		const node = document.getElementById('main-sheet');
		node.addEventListener('scroll', handleScroll);

		return () => { node.removeEventListener('scroll', handleScroll) };
	}, []);

	useEffect(() => {
		if (data) {
			allGames.current = [...allGames.current, ...data.results];
		}
	}, [data]);

	useEffect(() => {
		return () => {
			allGames.current = [];
			setIsGamePass(false);
			setCategoryGamesCount(0);
		};
	}, []);

	useEffect(() => {
		if (isSuccess) {
			setCategoryGamesCount(data.count);
			setTotalGames(data.count);
		}
	}, [data?.count, isSuccess]);

	if (isSuccess) {
		content.current = allGames.current.map((game) => (
			<div className={cls.gameCarCont} key={game.id}>
				<MotionGameCard
					ref={gameCardRef}
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
			</div>
		));
	}

	if (isError) {
		content.current = <p>There is some error...</p>;
	}

	return (
		<>
			<section style={{ position: 'relative', zIndex: 1, minHeight: '100%' }}>
				<Loading loading={isLoading && isFirstLoading.current} />
				<div
					className='wrapper'
					style={{ opacity: isLoading && isFirstLoading.current ? 0 : 1 }}
				>
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
						ref={allGamesContRef}
						style={{
							position: 'absolute',
							left: '0',
							top: '122px',
							height: inBottomSheet ? 'calc(100% - 70px)' : 'calc(100% - 70px)',
							width: '100%',
						}}
						onViewportEnter={enterAllGamesSection}
						onViewportLeave={leaveAllGamesSection}
					/>
					<div className={cls.allGamesCont}>{content.current}</div>
					{isFetching && (
						<Icon
							style={{ margin: '0 auto', display: 'block' }}
							width={55}
							icon='eos-icons:three-dots-loading'
						/>
					)}
					<motion.div
						style={{
							position: 'absolute',
							bottom: '-100px',
							width: '100%',
							height: '100vh',
							background: 'transparent',
							pointerEvents: 'none',
						}}
						onViewportEnter={changePage}
					/>
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

export default GamesFilteredBycategory;
