import { AnimatePresence, motion } from 'framer-motion';
import cls from './UpButtons.module.css';
import Button from '../../../../UI/Button/Button';
import { useStore } from '../../../../store';
import { BasketIcon, DropdownArrowIcon, ShowAllIcon } from '../../../../assets';

const MotionButton = motion(Button);

export const UpButtons = () => {
	const {
		basketBottomSheet,
		setBasketBottomSheet,
		countButtonUpIsShown,
		XsIsOpen,
		counter,
		isEnd,
		setDirection,
		gameInfoBottomSheetIsOpen,
		gamesCount,
		basketGamesCount,
	} = useStore((state) => state);

	const variants = [
		{
			up: {
				y: '0%',
				bottom:
					countButtonUpIsShown || gameInfoBottomSheetIsOpen ? '135px' : '85px',
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
					countButtonUpIsShown && !gameInfoBottomSheetIsOpen ? 'up' : 'down'
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
								{counter}/{gamesCount}
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
