import { AnimatePresence, motion } from 'framer-motion';
import cls from './UpButtons.module.css';
import Button from '../../../../UI/Button/Button';
import { useStore } from '../../../../store';
import { BasketIcon, DropdownArrowIcon, ShowAllIcon } from '../../../../assets';
import { useEffect } from 'react';

const MotionButton = motion(Button);

export const UpButtons = () => {
	const {
		basketBottomSheet,
		setBasketBottomSheet,
		countButtonUpIsShown,
		setCountButtonUpIsShown,
		XsIsOpen,
		counter,
		isEnd,
		setDirection,
		gameInfoBottomSheetIsOpen,
		gamesCount,
		basketGamesCount,
		categoryGamesCount,
		activeSeries,
		categoryBottomSheetIsOpen,
		gamePassBottomSheetIsOpen,
		searchBottomSheetIsOpen
	} = useStore((state) => state);

	useEffect(() => {
		if (categoryBottomSheetIsOpen) {
			const node = document.getElementById('main-sheet');
			if (!node) return;

			const handleScroll = () => setCountButtonUpIsShown(node.scrollTop > 0);

			node.addEventListener('scroll', handleScroll);
			return () => { node.removeEventListener('scroll', handleScroll) }
		} 
	}, [categoryBottomSheetIsOpen]);

	const variants = [
		{
			up: {
				y: '0%',
				bottom:
					(countButtonUpIsShown && !activeSeries.id) || gameInfoBottomSheetIsOpen || gamePassBottomSheetIsOpen ? '135px' : '85px',
				opacity: XsIsOpen || basketBottomSheet ? '0' : '1',
			},
			down: {
				y: '100%',
				// bottom: '0',
			},
		},
		{
			up: {
				y: '0%',
				bottom: '80px',
				opacity: XsIsOpen ? '0' : '1',
			},
			down: {
				y: '100%',
				bottom: '0',
			},
		},
	];

	function handleScrollToTop() {
		setDirection('up');
		if (categoryGamesCount !== 0)
			document
				.getElementById('main-sheet')
				.scrollTo({ top: 0, behavior: 'smooth' })
		else if (window.location.href.replace(/^.*\//, '') === 'buy-games')
			document
				.getElementById('feed')
				.scrollIntoView({ behavior: 'smooth' })
		else
			document
				.getElementById('hot-new-games')
				.scrollIntoView({ behavior: 'smooth' });
	}

	return (
		<>
			<MotionButton
				variants={variants[0]}
				animate={basketGamesCount >= 1 ? 'up' : 'down'}
				transition={{
					duration: 0.3,
					ease: 'linear',
				}}
				onClick={() => setBasketBottomSheet(true)}
				className={cls.basketBtn}>
				<BasketIcon width={23} height={23} />
				<span className={cls.basketBtnSpan}>{basketGamesCount}</span>
			</MotionButton>
			<MotionButton
				onClick={handleScrollToTop}
				variants={variants[1]}
				animate={
					countButtonUpIsShown && !gameInfoBottomSheetIsOpen && !activeSeries.id && !searchBottomSheetIsOpen ? 'up' : 'down'
				}
				className={cls.buttonUp}>
				<AnimatePresence initial={false}>
					{!isEnd ? (
						<div>
							<motion.p
								className={cls.counter}
								animate={{ opacity: 1 }}
								initial={{ opacity: 0 }}
								exit={{ opacity: 0 }}
							>
								<ShowAllIcon />
								{counter}/{categoryGamesCount || gamesCount}
							</motion.p>
						</div>
					) : (
						<motion.p
							animate={{ opacity: 1 }}
							initial={{ opacity: 0 }}
							exit={{ opacity: 0 }}>
							<DropdownArrowIcon width={25} height={25} />
						</motion.p>
					)}
				</AnimatePresence>
			</MotionButton>
		</>
	);
};
