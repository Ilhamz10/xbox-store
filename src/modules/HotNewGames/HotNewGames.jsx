// import SearchInput from './UI/SearchInput/SearchInput';
import Button from '../../UI/Button/Button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation } from 'swiper/modules';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

import cls from './HotNewGames.module.css';
import FireIcon from '../../assets/icons/fire-icon.svg?react';
import DropdownIcon from '../../assets/icons/dropdown-arrows-icon.svg?react';
import SliderNextIcon from '../../assets/icons/slider-next-icon.svg?react';
import SliderPrevIcon from '../../assets/icons/slider-prev-icon.svg?react';
import { num_word } from '../../helpers';
import { Modal, FilterButton } from '../../UI';
import { useStore } from '../../store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getPopularGames } from './api/getPopularGames';
import { getAllGames } from './api/getAllGames';
import { SearchInput } from './UI';
import { searchGames } from './api/searchGames';
import SearchBottomSheet from './components/SearchBottomSheet/SearchBottomSheet';
import { MenuIcon, StarIcon, TimeIcon, WatchIcon, XboxLoading } from '../../assets';
import { getButtonInfoById } from '../../layout/root/api/getButtonInfoById'

const HotNewGames = memo(function HotNewGames() {
	const swiperRef = useRef(null);
	const searchInputRef = useRef(null);
	const content = useRef(null);
	const {
		changeXsIsOpen,
		setXsText,
		setXsTitle,
		setDateFilter,
		dateFilter,
		setActiveGame,
		setGameInfoBottomSheetIsOpen,
		basketBottomSheet,
		gameInfoBottomSheetIsOpen,
		searchBottomSheetIsOpen,
		setSearchBottomSheetIsOpen,
		setLoading,
		setIsFromHomeSale
	} = useStore((state) => state);

	const [searchIsActive, setSearchIsActive] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const { data, isLoading, isSuccess, isError } = useQuery({
		queryKey: [
			'popular-games',
			`popular-games-filtered-by-${dateFilter.filter}`,
		],
		queryFn: () => getPopularGames(dateFilter.filter),
	});

	const {
		data: allGames,
		isSuccess: allGamesIsSuccess,
		isError: allGamesIsError,
	} = useQuery({
		queryKey: ['all-games-for-count'],
		queryFn: getAllGames,
	});

	const {
			data: rentButtonInfo,
			isError: rentButtonInfoIsError,
			isSuccess: rentButtonInfoIsSuccess,
		} = useQuery({
			queryKey: ['rent-button-info'],
			queryFn: () => getButtonInfoById(1),
		});

	const { mutate, data: searchedGames } = useMutation({
		mutationFn: searchGames,
	});

	function handleOpenGameInfoBottomSheet(game) {
		setActiveGame(game);
		setGameInfoBottomSheetIsOpen(true);
		setIsFromHomeSale(false);
	}

	function handleSearch(e) {
		e.preventDefault();
		mutate({ search: searchValue });
		setSearchBottomSheetIsOpen(true);
		searchInputRef.current.blur();
		setSearchValue('');
		setSearchIsActive(false);
	}

	function handleClose(isOpen) {
		setSearchBottomSheetIsOpen(isOpen);
	}

	if (isLoading) {
		content.current = (
			<div className={cls.loading}>
				<XboxLoading />
			</div>
		);
	}

	useEffect(() => {
		if (isSuccess) setLoading(false);
	}, [setLoading, isSuccess]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				searchInputRef.current &&
				!searchInputRef.current.contains(event.target)
			) {
				setSearchIsActive(false);
				setSearchValue('');
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const [filtersByDateIsOpen, setFiltersByDateIsOpen] = useState(false);

	function handleOpenInfo() {
		if (rentButtonInfoIsSuccess) {
			setXsTitle(rentButtonInfo.description);
			setXsText(rentButtonInfo.text);
		}
		changeXsIsOpen(true);
	}

	const handlePrev = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slidePrev();
		}
	};

	const handleNext = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slideNext();
		}
	};

	const numWord = useMemo(() => {
		if (allGamesIsSuccess) {
			return num_word(allGames.count, ['позиция', 'позиции', 'позиций']);
		}
	}, [allGames?.count, allGamesIsSuccess]);

	if (isError) {
		content.current = <p>There is an error</p>;
	}

	if (isSuccess) {
		content.current = (
			<Swiper
				ref={swiperRef}
				effect={'coverflow'}
				slidesPerView={1.4}
				centeredSlides={true}
				autoplay={{
					delay: 2000,
				}}
				loop={true}
				modules={[EffectCoverflow, Navigation, Autoplay]}>
				{data.map((game) => (
					<SwiperSlide
						onClick={() => handleOpenGameInfoBottomSheet(game)}
						key={game.id}>
						<img className={cls.sliderImg} src={game.image} alt='' />
					</SwiperSlide>
				))}
			</Swiper>
		);
	}

	if (allGamesIsError) {
		return <p>Произошла ошибка</p>;
	}

	return (
		<>
			<section
				id='hot-new-games'
				style={{
					backgroundImage: data
						? `url(${data[0].image})`
						: `url(
					'https://project-green.ru/pgstore/webapp/fastapi/app/games/9PLTKZZK35RF/images/tile.webp'
				)`,
				}}
				className={cls.hotNewGamesSection}>
				<div className={cls.blurBg}>
					<div className='wrapper'>
						<form className={cls.titleCont} onSubmit={handleSearch}>
							<h3
								className={`${cls.categoryTitle} ${
									!searchIsActive ? cls.active : ''
								}`}>
								Аренда игр{' '}
								<span>
									({allGames?.count || 0} {numWord})
								</span>
							</h3>
							<SearchInput
								ref={searchInputRef}
								searchIsActive={searchIsActive}
								onFocus={(e) => {
									if (!searchIsActive) {
										e.currentTarget.blur();
									}
									setSearchIsActive(true);
								}}
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
							/>
						</form>
						<div className='section-header'>
							<h3 style={{ marginBottom: 0 }} className='section-title'>
								<FireIcon width={20} height={20} />
								Популярные игры
							</h3>
							<Button
								onClick={() => setFiltersByDateIsOpen(true)}
								className={cls.filterBtn}
								Icon={DropdownIcon}
								iconSize={16}>
								{dateFilter.text}
							</Button>
						</div>
					</div>
					<div className={cls.swiperCont}>
						{content.current}
						<div className={cls.customSliderNav}>
							<button className={cls.prevBtn} onClick={handlePrev}>
								<SliderPrevIcon width={36} height={36} fill={'#e5e7eba6'} />
							</button>
							<button className={cls.nextBtn} onClick={handleNext}>
								<SliderNextIcon width={36} height={36} fill={'#e5e7eba6'} />
							</button>
						</div>
					</div>
					<div className={cls.aboutRentWrapper}>
						{rentButtonInfoIsSuccess && (
							<Button onClick={handleOpenInfo} className={cls.aboutRentBtn}>
								{rentButtonInfo.title}
							</Button>
						)}
						{rentButtonInfoIsError && <p>Произошла ошибка</p>}
					</div>
				</div>
			</section>
			<Modal isOpen={filtersByDateIsOpen} setIsopen={setFiltersByDateIsOpen}>
				<div className={cls.filterByDate}>
					<h3 className='section-title'>Сортировка</h3>
					<div className={cls.filters}>
						<FilterButton
							text={'За неделю'}
							onClick={() => {
								setDateFilter({ filter: 'week', text: 'За неделю' });
								setFiltersByDateIsOpen(false);
							}}
							isChecked={dateFilter.filter === 'week'}
							Icon={MenuIcon}
						/>
						<FilterButton
							text={'За месяц'}
							onClick={() => {
								setDateFilter({ filter: 'month', text: 'За месяц' });
								setFiltersByDateIsOpen(false);
							}}
							isChecked={dateFilter.filter === 'month'}
							Icon={TimeIcon}
						/>
						<FilterButton
							text={'За пол года'}
							onClick={() => {
								setDateFilter({ filter: 'half-year', text: 'За пол года' });
								setFiltersByDateIsOpen(false);
							}}
							isChecked={dateFilter.filter === 'half-year'}
							Icon={WatchIcon}
						/>
						<FilterButton
							text={'За все время'}
							onClick={() => {
								setDateFilter({ filter: 'all-time', text: 'За все время' });
								setFiltersByDateIsOpen(false);
							}}
							isChecked={dateFilter.filter === 'all-time'}
							Icon={StarIcon}
						/>
					</div>
				</div>
			</Modal>
			<SearchBottomSheet
				adjustPosition={gameInfoBottomSheetIsOpen || basketBottomSheet}
				games={searchedGames?.results}
				isOpen={searchBottomSheetIsOpen}
				setIsOpen={handleClose}
			/>
		</>
	);
});

export default HotNewGames;
