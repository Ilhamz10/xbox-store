import { motion } from 'framer-motion';
import { XboxIcon } from '../../assets';
import cls from './XboxLoader.module.css';

export const XboxLoader = ({ style }) => {
   return (
      <motion.div
         style={style}
         className={cls.loader}
         animate={{ opacity: [0.5, 1, 0.5] }}
         transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
      >
         <XboxIcon width={36} height={36} />
      </motion.div>
   );
};
