import {
	AnimatePresence,
	motion,
	useAnimation,
	useMotionValue,
} from 'framer-motion';
import cls from './BottomSheet.module.css';
import { memo, useEffect, useRef, useState } from 'react';
import useScrollDirection from '../../hooks/useScrollDirection';
import { useStore } from '../../store';
import { IphoneShareIcon } from '../../assets';
import { handleTelegramShare } from '../../helpers/handleTelegramShare';
import { createPortal } from 'react-dom';

export const CustomBottomSheet = memo(function CustomBottomSheet({
	sheetBgColor,
	isOpen,
	setIsopen,
	children,
	adjustPosition,
	shareIcon,
	bottomSheetHeader,
	onClose = () => {},
}) {
	const { mainSubscription } = useStore(state => state);
	const y = useMotionValue(0);
	const [onTheTop, setOnTheTop] = useState(true);
	const modalRef = useRef(null);
	const controls = useAnimation();
	const backdropControls = useAnimation();
	const mainRef = useRef(null);
	const { direction, activeGame } = useStore((state) => state);
	const touchStartPoint = useRef(0);
	// const [lineIsActive, setLineIsActive] = useState(false);

	useScrollDirection(mainRef);

	function handleTouchMove(e) {
		const touchY = e.touches[0].clientY - touchStartPoint.current;
		if (onTheTop && direction === 'up') {
			if (y.current < 0) return;
			y.set(touchY);
			// setLineIsActive(true);
		}
		if (y.current > 0 && direction === 'down') {
			if (y.current < 0) return;
			y.set(touchY);
		}
	}

	async function handleTouchEnd() {
		const modalHeight = modalRef.current.offsetHeight - 30 - 48 - 72;

		if (y.current > modalHeight / 4) {
			await controls.start({ y: modalRef.current.offsetHeight });
			document.getElementById('root').style.overflow = 'auto';
			setIsopen(false);
			onClose();
		} else {
			controls.start({ y: 0 });
		}

		// setLineIsActive(false);
	}

	useEffect(() => {
		if (isOpen) {
			document.getElementById('root').style.overflow = 'hidden';
			controls.start({
				y: adjustPosition ? -15 : 0,
				width: adjustPosition ? '90%' : '100%',
				marginInline: 'auto',
			});
		} else {
			document.getElementById('root').style.overflow = 'auto';
		}
	}, [controls, isOpen, adjustPosition, backdropControls]);

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						ref={modalRef}
						initial={{ y: window.innerHeight }}
						animate={controls}
						exit={{ y: window.innerHeight }}
						transition={{
							duration: 0.4,
							ease: 'easeInOut',
						}}
						style={sheetBgColor ? { y, background: sheetBgColor } : { y }}
						className={`${cls.sheet} ${isOpen ? cls.open : ''}`}>
						<div className={cls.sheetBody}>
							<header
								onTouchStart={(e) => {
									touchStartPoint.current = e.touches[0].clientY;
								}}
								onTouchMove={handleTouchMove}
								onTouchEnd={handleTouchEnd}
								className={cls.sheetHeader}>
								<div className={`wrapper ${cls.sheetHeaderCont}`}>
									<button
										className={cls.closeBtn}
										onClick={() => {
											document.getElementById('root').style.overflow = 'auto';
											setIsopen(false);
											onClose();
										}}>
										Закрыть
									</button>
									{bottomSheetHeader && (
										<div className={cls.sheetHeaderContent}>
											{bottomSheetHeader}
										</div>
									)}
									{!bottomSheetHeader && <div className={`${cls.line}`} />}
									{shareIcon && (
										<button
											onClick={() =>
												handleTelegramShare(activeGame.title ? activeGame : mainSubscription)}
											className={cls.shareBtn}>
											<IphoneShareIcon width={25} height={25} />
										</button>
									)}
								</div>
							</header>
							<motion.main
								onTouchStart={(e) => {
									touchStartPoint.current = e.touches[0].clientY;
								}}
								onTouchMove={handleTouchMove}
								onTouchEnd={handleTouchEnd}
								style={{ overflowY: 'auto' }}
								ref={mainRef}
								className={cls.sheetMain}
								id='main-sheet'>
								<motion.div
									onViewportEnter={() => setOnTheTop(true)}
									onViewportLeave={() => setOnTheTop(false)}
									style={{ height: 0 }}
								/>
								{children}
							</motion.main>
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsopen(false)}
						className={cls.backdrop}
					/>
				</>
			)}
		</AnimatePresence>,
		document.getElementById('modal')
	);
});
