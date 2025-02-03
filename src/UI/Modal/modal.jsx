import { createPortal } from 'react-dom';
import cls from './modal.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom'

export const Modal = ({ children, isOpen, setIsopen, className, isGamePass, setIsGamePass }) => {
	const handleClose = () => {
		setIsopen(false);
		setIsGamePass(false);
	}

	return createPortal(
		<>
			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{
								opacity: 0,
							}}
							exit={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							className={`${cls.backdrop}`}
							onClick={handleClose}></motion.div>
						<motion.div
							initial={{
								translateY: '120%',
								translateX: '-50%',
							}}
							exit={{
								translateY: '120%',
								translateX: '-50%',
							}}
							animate={{
								translateY: '0%',
								translateX: '-50%',
							}}
							transition={{ bounce: 0, duration: 0.2 }}
							className={`wrapper ${cls.modal} ${className}`}>
							{children}
							{isGamePass && (
								<Link
									to="/subscriptions"
									style={{ display: 'inline-block', textAlign: 'center' }}
									className={cls.closeModalBtn}
									onClick={handleClose}
								>
									Купить подписку
								</Link>
							)}
							<button
								onClick={handleClose}
								className={cls.closeModalBtn}>
								Закрыть
							</button>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>,
		document.getElementById('modal')
	);
};
