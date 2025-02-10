import { motion } from 'framer-motion';
import { Fragment, useEffect, useState } from 'react';
import { translatedDateObj } from '../../consts/translated-date-obj';
import { XboxLoading } from '../../assets';
import cls from './timer.module.css';

export const Timer = ({ date, style }) => {
   const targetDate = new Date(date);
   const [time, setTime] = useState({
      days: 0,
      hours: 0,
      mins: 0,
      seconds: 0,
   });

   function handleTimer() {
      const intervalId = setInterval(() => {
         const now = Date.now();
         const difference = targetDate - now;

         if (difference > 0) {
            setTime({
               days: Math.floor(difference / (1000 * 60 * 60 * 24)),
               hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
               mins: Math.floor((difference / 1000 / 60) % 60),
               seconds: Math.floor((difference / 1000) % 60),
            });
         } else targetDate.setDate(targetDate.getDate() + 7);
      }, 1000);

      return () => {
         clearInterval(intervalId);
      };
   }

   useEffect(() => { handleTimer() }, []);

   return (
      <div style={style}>
         {Object.values(time).reduce((acc, i) => acc + i, 0) === 0 ? (
            <div className={cls.loader}>
               <XboxLoading width={50} height={50} />
            </div>
         ) : (
            <motion.div
               className={cls.timer}
               animate={{ opacity: [0, 1] }}
               transition={{ duration: 0.7, ease: 'easeInOut' }}
            >
               {Object.entries(time).map(([key, val], i, arr) => {
                  const isNotLast = i + 1 !== arr.length;

                  return (
                     <Fragment key={i}>
                        <div className={cls.timerItem}>
                           <p>{val}</p>
                           <span>{translatedDateObj[key]}</span>
                        </div>
                        {isNotLast && <span className={cls.separator}>:</span>}
                     </Fragment>
                  );
               })}
            </motion.div>
         )}
      </div>
   );
};
