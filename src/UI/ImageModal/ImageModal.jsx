import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import cls from './style.module.css';


export const ImageModal = ({ bigImage, setBigImage }) => {
   const animationVariants = {
      initial: { opacity: 0 },
      in: {
         opacity: 1,
         transition: {
            opacity: { duration: 0.3 }
         }
      },
      out: {
         opacity: 0,
         transition: {
            opacity: { duration: 0.3 }
         }
      },
   };

   return createPortal(
      <AnimatePresence>
         {bigImage !== '' && (
            <>
               <motion.div
                  key="backdrop"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={animationVariants}
                  onClick={() => setBigImage('')}
                  className={cls.backdrop}
               />
               <motion.div
                  key="image"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={animationVariants}
                  className={cls.bigImage}>
                  <img src={bigImage} alt="" />
               </motion.div>
            </>
         )}
      </AnimatePresence>,
      document.getElementById('modal'),
   );
};
