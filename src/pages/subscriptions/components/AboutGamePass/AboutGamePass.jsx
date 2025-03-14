import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';

import bg from '../../../../assets/imgs/duration-bg.jpg';
import SectionWithSlide from '../../../../components/SectionWithSlide/SectionWithSlide';
import { num_word } from '../../../../helpers';
import { useStore } from '../../../../store';
import { Info2Icon } from '../../../../assets';
import cls from './AboutGamePass.module.css';

export const AboutGamePass = ({ setBigImage, similarSubs, sub }) => {
   const {
      setXsTitle,
      setIsGamePass,
      changeXsIsOpen,
      activeSub,
      setActiveSub,
      mainSubscription,
      setXsText,
      setIsNewAcc,
   } = useStore(store => store);
   const [activeIndex, setActiveIndex] = useState(mainSubscription.types.length <= 1 ? 0 : null);

   function handleOpenClue(e, title, text) {
      e.stopPropagation();
      setXsTitle(title);
      setXsText(text);
      setIsGamePass(false);
      changeXsIsOpen(true);
   }

   function handleSetActive(index) {
      setIsNewAcc(mainSubscription.types[index].name === 'На новый аккаунт');
      setActiveIndex(index == activeIndex ? null : index);

      if (activeIndex === null) setActiveSub({});
      if (activeIndex !== index && activeIndex !== null) {
         setActiveIndex(null);
         setActiveSub({});
         setTimeout(() => setActiveIndex(index), 300);
      }
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
                 parent_id: mainSubscription.id,
              },
      );
   }

   useEffect(() => {
      if (
         mainSubscription.types.length <= 1 &&
         mainSubscription.types[0].periods.length <= 1
      )
         handleSetActiveSub(mainSubscription.types[0].periods[0]);

      return () => {
         setActiveSub({});
         setIsNewAcc(false);
      };
   }, []);

   return (
      <main className={cls.gameInfoMain}>
         <div className="wrapper">
            <div className={cls.header}>
               <img
                  src={mainSubscription.image}
                  alt="game-pass-image"
                  fetchPriority="high"
                  onClick={() => setBigImage(mainSubscription.image)}
               />

               <div className={cls.head}>
                  <div className={cls.titleHead}>
                     <h3>{mainSubscription.title}</h3>
                  </div>
                  {mainSubscription.games_list_enabled && (
                     <p className={cls.count}>Сейчас в подписке 456 игр</p>
                  )}
               </div>
            </div>

            {mainSubscription.types.length > 1 && (
               <div className={cls.carousels}>
                  {mainSubscription.types.map((type, i) => {
                     if (type.name === '-') return;

                     return (
                        <div
                           key={type.id}
                           onClick={() => handleSetActive(i)}
                           className={`${cls.card} ${
                              i == activeIndex && cls.active
                           }`}>
                           <h3>{type.name}</h3>
                        </div>
                     );
                  })}
               </div>
            )}

            <AnimatePresence>
               {activeIndex !== null &&
                  mainSubscription.types.length > 0 &&
                  mainSubscription.types[activeIndex].periods.length > 1 && (
                     <motion.div
                        exit={{ height: 0 }}
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        className={cls.periods}>
                        {mainSubscription.types.length > 1 && (
                           <div className={cls.periodsHead}>
                              <h4>
                                 {mainSubscription.types[activeIndex].name}
                              </h4>
                              {mainSubscription.types[activeIndex]
                                 .description !== '' && (
                                 <button
                                    onClick={e =>
                                       handleOpenClue(
                                          e,
                                          'Подсказка',
                                          mainSubscription.types[activeIndex]
                                             .description,
                                       )
                                    }>
                                    <Info2Icon width={22} height={22} />
                                 </button>
                              )}
                           </div>
                        )}
                        <Swiper
                           nested
                           slidesPerView={'auto'}
                           style={{
                              marginTop: mainSubscription.types.length <= 1 ? 0 : 6.5,
                           }}
                        >
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
                                       onClick={() =>
                                          handleSetActiveSub(period)
                                       }>
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

                        {mainSubscription.types[activeIndex].additional_info !== '' && (
                           <p className={cls.additionalInfo}>
                              {
                                 mainSubscription.types[activeIndex]
                                    .additional_info
                              }
                           </p>
                        )}
                     </motion.div>
                  )}
            </AnimatePresence>

            <p className={cls.desc}>{mainSubscription.description}</p>
         </div>

         <div style={{ marginTop: 15 }}>
            <SectionWithSlide
               sectionTitle={'Похожие подписки'}
               slides={similarSubs.filter(
                  sub => sub.id !== mainSubscription.id,
               )}
               sub={sub}
            />
         </div>
      </main>
   );
};
