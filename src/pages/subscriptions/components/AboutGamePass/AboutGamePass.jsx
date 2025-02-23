import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react'

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
   const [activeIndex, setActiveIndex] = useState(null);

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
                  <p className={cls.count}>Сейчас в подписке 456 игр</p>
               </div>
            </div>

            <div className={cls.carousels}>
               {mainSubscription.types.map((type, i) => (
                  <div
                     key={type.id}
                     onClick={() => setActiveIndex(i == activeIndex ? null : i)}
                     className={`${cls.card} ${
                        i == activeIndex && cls.active
                     }`}>
                     <h3>{type.name}</h3>
                  </div>
               ))}
            </div>

            <AnimatePresence>
               {activeIndex !== null && (
                  <motion.div
                     exit={{ height: 0 }}
                     initial={{ height: 0 }}
                     animate={{ height: 'auto' }}
                     className={cls.periods}>
                     <h4>Выберите срок подписки:</h4>
                     <Swiper
                        nested
                        slidesPerView={'auto'}
                     >
                        {mainSubscription.types[activeIndex].periods.map(
                           (period, i) => (
                              <SwiperSlide
                                 key={period.id}
                                 className={cls.slide}
                                 style={{ marginLeft: i !== 0 && 15 }}
                              >
                                 <div
                                    className={`${cls.period} ${
                                       period.id === activeSub.id && cls.active
                                    }`}
                                    onClick={() =>
                                       setActiveSub(
                                          period.id === activeSub.id
                                             ? {}
                                             : {
                                                id: period.id,
                                                name: mainSubscription.types[
                                                   activeIndex
                                                ].name,
                                                duration_months:
                                                   period.duration_months,
                                                price: period.period_price,
                                             },
                                       )
                                    }>
                                    <img src={bg} alt="card-bg" />
                                    <p>
                                       {period.duration_months}{' '}
                                       {num_word(period.duration_months, ['месяц', 'месяца', 'месяцев'])}
                                    </p>
                                    <span>{+period.period_price} ₽</span>
                                 </div>
                              </SwiperSlide>
                           ),
                        )}
                     </Swiper>
                  </motion.div>
               )}
            </AnimatePresence>

            <p className={cls.desc}>{mainSubscription.description}</p>
         </div>
      </main>
   );
};
