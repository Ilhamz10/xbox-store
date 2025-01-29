import { memo, useEffect, useRef, useState } from 'react';
import { useStore } from '../../store';
import { CustomBottomSheet } from '../../UI/BottomSheet/BottomSheet';
import cls from './game-info.module.css';
import { useQuery } from '@tanstack/react-query';
import { getGameDetail } from './api/getGameDetail';
import GameAbout from './pages/game-about/game-about';
import GameScreens from './pages/game-screens/game-screens';
import GameVideos from './pages/game-videos/game-videos';
import { GamePassIcon, RussianFlagIcon, XSIcon } from '../../assets';
import { gameInfoHeader } from '../../consts/game-info-header';
import Loading from '../../UI/Loading/Loading';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { gameInfoHeader } from '../../consts/game-info-header';

export const GameInfo = memo(function GameInfo({ adjustPosition }) {
	const {
		gameInfoBottomSheetIsOpen,
		setGameInfoBottomSheetIsOpen,
		setProductAddToCardIsVisiible,
		activeGame,
		setXsText,
		changeXsIsOpen,
		isAdmin,
		setXsTitle,
	} = useStore((state) => state);

	// that state refers to current swiper index that shows number of page (countdown starts from 0)
	const [page, setPage] = useState(0);
	const [bigImage, setBigImage] = useState('');

	const content = useRef(null);
	const swiperRef = useRef(null);
	const activeBarRef = useRef(null);

	function handleOpenXsInfo(e, name) {
		e.stopPropagation();
		setXsTitle('Подсказка');
		setXsText(
			`Значок X|S обозначает что игра ${name} работает только на
						приставке Xbox Series S и Xbox Series X и не работает на приставке
						Xbox one.!`
		);
		changeXsIsOpen(true);
	}

	function handleOpenPreOrder(e, name) {
		e.stopPropagation();
		setXsTitle('Подсказка');
		setXsText(
			`Игра ${name} еще не вышла, но вы уже можете ее приобрести! Дата релиза игры: ${new Date(
				data.release_date
			).toLocaleDateString('ru-Ru', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			})}г`
		);
		changeXsIsOpen(true);
	}

	function handleActiveBarWidth(index) {
		const node = document.querySelector(`#active-page-${index}`);
		if (!node || !activeBarRef.current) return;

		const widthOfCurrentNode = window.getComputedStyle(node).width;
		activeBarRef.current.style.width = widthOfCurrentNode;
	}

	function handleSwiper(sw) {
		swiperRef.current = sw;
		handleActiveBarWidth(sw.activeIndex);
		sw.on("setTranslate", () => handleDiscardScroll(sw));
	}

	function handleSlideChange(sw) {
		handleActiveBarWidth(sw.activeIndex);
		setPage(sw.activeIndex);
	}

	function handleDiscardScroll(sw) {
		const maxTranslate = sw.maxTranslate();

		if (sw.translate > 0) sw.setTranslate(0);
		else if (sw.translate < maxTranslate) sw.setTranslate(maxTranslate);
	}

	function handleProgress(sw) {
		if (!activeBarRef.current) return;

		const swiperWrapper = sw.wrapperEl;
		const slidesCount = sw.slides.length;
		const totalWidth = swiperWrapper.clientWidth;
		const slidesWidth = totalWidth / slidesCount;

		const left = (totalWidth - slidesWidth) * sw.progress + (slidesWidth - 76) * sw.progress;
		activeBarRef.current.style.left = `${sw.progress == 1 ? left - 7 : left || 9}px`;
	}

	const { data, isLoading, isError, isSuccess } = useQuery({
		queryKey: [`game-detail-${activeGame?.id}`],
		queryFn: () => getGameDetail(activeGame?.id),
		enabled: activeGame?.id !== undefined,
	});

	if (isError) {
		content.current = <h1>There is some error</h1>;
	}

	if (isSuccess) {
		content.current = (
			<>
				{bigImage && (
					<>
						<div onClick={() => setBigImage('')} className={cls.backdrop} />
						<div className={cls.bigImage}>
							<img src={bigImage} alt='' />
						</div>
					</>
				)}
				<div className={cls.gameInfoCont}>
					<div className={cls.gameInfoMainImgCont}>
						<img className={cls.gameInfoMainImg} src={data.wallpaper} alt='' />
						<img
							style={{
								filter: 'blur(4px)',
								transform: 'rotate(180deg) scaleX(-1)',
							}}
							className={cls.gameInfoMainImg}
							src={data.wallpaper}
							alt=''
						/>
						<div className={cls.gamePriceCont}>
							{data.subprice !== '0.00' ? (
								<>
									<div className={cls.discount}>{data.price} ₽</div>
									<p className={cls.price}>
										{data.original_price !== '0.00'
											? data.original_price
											: data.subprice}{' '}
										₽
									</p>
								</>
							) : (
								<p className={cls.price}>{data.price} ₽</p>
							)}
						</div>
						{data.compatibility === 'xbox_series_x_s' && (
							<button
								style={!data.in_game_pass ? { left: '20px' } : {}}
								className={cls.XSBtn}
								onClick={(e) => handleOpenXsInfo(e, data.title)}>
								<XSIcon width={45} height={35} />
							</button>
						)}
						{data.voice_acting === 'russian' && (
							<RussianFlagIcon
								width={35}
								style={{
									position: 'absolute',
									top: '18px',
									left: '18px',
									borderRadius: '3px',
								}}
							/>
						)}
						{data.pre_order && (
							<p
								onClick={(e) => handleOpenPreOrder(e, data.title)}
								className={cls.banner}>
								Предзаказ
							</p>
						)}
						{data.in_game_pass && (
							<GamePassIcon
								style={{
									position: 'absolute',
									bottom: '80px',
									left: '18px',
									borderRadius: '3px',
								}}
								width={45}
								height={45}
							/>
						)}
					</div>
					<div style={{ background: '#232222' }}>
					<header className={cls.gameInfoHeader}>
							<div className='wrapper'>
								<div className={cls.gameInfoHeaderLinks}>
									{gameInfoHeader.map((str, i) => {
										if (i > 0 && data.screenshots.length == 0) return;

										return (
											<button
												key={i}
												id={`active-page-${i}`}
												className={`${cls.navBtn} ${page == i && cls.active}`}
												onClick={() => swiperRef.current.slideTo(i)}
											>
												{str}
											</button>
										);
									})}
									<span
										ref={activeBarRef}
										className={cls.activeBar}
									/>
								</div>
							</div>
						</header>
						<main className={cls.gameInfoMain}>
						<Swiper
								autoHeight
								onSwiper={handleSwiper}
								onProgress={handleProgress}
								onSlideChange={handleSlideChange}
							>
								<SwiperSlide key={0}>
									<GameAbout setBigImage={setBigImage} data={data} />
								</SwiperSlide>
								{data.screenshots.length !== 0 && (
									<>
										<SwiperSlide key={1}>
											<GameScreens screens={data.screenshots} />
										</SwiperSlide>
										<SwiperSlide key={2}>
											<GameVideos
												videos={data.videos}
												trailer={data.trailer}
												title={data.title}
											/>
										</SwiperSlide>
									</>
								)}
							</Swiper>
						</main>
					</div>
				</div>
			</>
		);
	}

	useEffect(() => {
		setProductAddToCardIsVisiible(gameInfoBottomSheetIsOpen);
	}, [gameInfoBottomSheetIsOpen, setProductAddToCardIsVisiible]);

	return (
		<CustomBottomSheet
			shareIcon
			onClose={() => setPage('detail')}
			sheetBgColor='#232222'
			adjustPosition={adjustPosition}
			isOpen={gameInfoBottomSheetIsOpen}
			setIsopen={setGameInfoBottomSheetIsOpen}>
			{isAdmin && (
				<a
					target='_blank'
					href={`https://api.xbox-rent.ru/admin/webapp/product/${activeGame?.id}`}
					className={cls.editButton}>
					<Icon
						style={{ display: 'block' }}
						width={20}
						height={20}
						icon='cuida:edit-outline'
					/>
				</a>
			)}
			<section style={{ position: 'relative', zIndex: 1, minHeight: '100%' }}>
				<Loading loading={isLoading} />
				<AnimatePresence>
					{!isLoading && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}>
							{content.current}
						</motion.div>
					)}
				</AnimatePresence>
			</section>
		</CustomBottomSheet>
	);
});
