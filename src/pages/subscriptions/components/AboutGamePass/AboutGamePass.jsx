import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';

import bg from '../../../../assets/imgs/duration-bg.jpg';
import { num_word } from '../../../../helpers';
import { getButtonInfoById } from '../../../../layout/root/api/getButtonInfoById';
import { useStore } from '../../../../store';
import { Info2Icon } from '../../../../assets';
import cls from './AboutGamePass.module.css';

export const AboutGamePass = ({ setBigImage }) => {
   const {
      setXsTitle,
      setIsGamePass,
      changeXsIsOpen,
      activeSub,
      setActiveSub,
      mainSubscription,
      setXsText,
   } = useStore(store => store);
   const [activeIndex, setActiveIndex] = useState(
      mainSubscription.types.length <= 1 ? 0 : null,
   );

   const { data } = useQuery({
      queryKey: ['home-button-info'],
      queryFn: () => getButtonInfoById(6),
   });

   function handleOpenClue(e) {
      e.stopPropagation();
      setXsTitle(data.description);
      setXsText(data.text);
      setIsGamePass(false);
      changeXsIsOpen(true);
   }

   function handleSetActive(index) {
      setActiveIndex(index == activeIndex ? null : index);
      if (activeIndex === null || activeIndex !== index) setActiveSub({});
   }

   function handleSetActiveSub(period) {
      setActiveSub(
         period.id === activeSub.id
            ? {}
            : {
                 id: period.id,
                 name: mainSubscription.types[activeIndex].name,
                 duration_months: period.duration_months,
                 price: period.period_price,
              },
      )
   }

   useEffect(() => {
      if (
         mainSubscription.types.length <= 1 &&
         mainSubscription.types[0].periods.length <= 1
      ) handleSetActiveSub(mainSubscription.types[0].periods[0])

      return () => {
         setActiveSub({});
      };
   }, []);

   return (
      <main className={cls.gameInfoMain}>
         <div className="wrapper">
            <div className={cls.header}>
               <img
                  src={mainSubscription.image}
                  alt="game-pass-image"
                  fetchpriority="high"
                  onClick={() => setBigImage(mainSubscription.image)}
               />

               <div className={cls.head}>
                  <div className={cls.titleHead}>
                     <h3>{mainSubscription.title}</h3>
                     <button onClick={handleOpenClue}>
                        <Info2Icon width={22} height={22} />
                     </button>
                  </div>
                  {mainSubscription.games_list_enabled && (
                     <p className={cls.count}>Сейчас в подписке 456 игр</p>
                  )}
               </div>
            </div>

            {mainSubscription.types.length > 1 && (
               <div className={cls.carousels}>
                  {mainSubscription.types.map((type, i) => (
                     <div
                        key={type.id}
                        onClick={() => handleSetActive(i)}
                        className={`${cls.card} ${
                           i == activeIndex && cls.active
                        }`}>
                        <h3>{type.name}</h3>
                     </div>
                  ))}
               </div>
            )}

            <AnimatePresence>
               {activeIndex !== null && mainSubscription.types.length > 0 && (
                  <motion.div
                     exit={{ height: 0 }}
                     initial={{ height: 0 }}
                     animate={{ height: 'auto' }}
                     className={cls.periods}>
                     {mainSubscription.types.length > 1 && (
                        <h4>{mainSubscription.types[activeIndex].name}:</h4>
                     )}
                     {mainSubscription.types[activeIndex].periods.length > 1 && (
                        <Swiper
                           nested
                           slidesPerView={'auto'}
                           style={{
                              marginTop:
                                 mainSubscription.types.length <= 1 ? 0 : 6.5,
                           }}>
                           {mainSubscription.types[activeIndex].periods.map(
                              (period, i) => (
                                 <SwiperSlide
                                    key={period.id}
                                    className={cls.slide}
                                    style={{ marginLeft: i !== 0 && 15 }}>
                                    <div
                                       className={`${cls.period} ${
                                          period.id === activeSub.id &&
                                          cls.active
                                       }`}
                                       onClick={() => handleSetActiveSub(period)}>
                                       <img src={bg} alt="card-bg" />
                                       <p>
                                          {period.duration_months}{' '}
                                          {num_word(period.duration_months, [
                                             'месяц',
                                             'месяца',
                                             'месяцев',
                                          ])}
                                       </p>
                                       <span>{+period.period_price} ₽</span>
                                    </div>
                                 </SwiperSlide>
                              ),
                           )}
                        </Swiper>
                     )}
                  </motion.div>
               )}
            </AnimatePresence>

            <p className={cls.desc}>{mainSubscription.description}</p>
         </div>
      </main>
   );
};
