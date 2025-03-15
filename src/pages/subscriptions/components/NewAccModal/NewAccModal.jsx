import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

import cls from './NewAccModal.module.css';

export const NewAccModal = ({ children, isOpen, setIsOpen, className }) => {
   return createPortal(
      <>
         <AnimatePresence>
            {isOpen && (
               <>
                  <motion.div
                     initial={{ opacity: 0 }}
                     exit={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className={`${cls.backdrop}`}
                     onClick={() => setIsOpen(false)}
                  />
                  <motion.div
                     transition={{ ease: 'linear', duration: 0.25 }}
                     initial={{ opacity: 0 }}
                     exit={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className={`wrapper ${cls.modal} ${className}`}>
                     {children}
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </>,
      document.getElementById('modal'),
   );
};
