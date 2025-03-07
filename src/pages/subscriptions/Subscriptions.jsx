import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useStore } from '../../store';
import subsMainBg from '../../assets/imgs/gamepass-main-bg.jpg';
import ubisoftBg from '../../assets/imgs/ubisoft-bg.jpg';
import esoPlusBg from '../../assets/imgs/eso-plus-bg.webp';
import eaPlayBg from '../../assets/imgs/ea-play-bg.webp';
import fortniteBg from '../../assets/imgs/fortnite-bg.webp';
import GameCard from '../../components/GameCard/GameCard';
import { MainSubModal } from './components/MainSubModal/MainSubModal';
import { OtherSubModal } from './components/OtherSubModal/OtherSubModal';
import { getSubs } from './api/getSubs';
import { HorizontalSub } from './components/HorizontalSub/HorizontalSub';
import Button from '../../UI/Button/Button';
import cls from './style.module.css';
import { num_word } from '../../helpers';

const Subscriptions = () => {
   const content = useRef(null);
   const {
      setLoading,
      basketBottomSheet,
      setMainSubscription,
      setMainSubBottomSheetIsOpen,
      setOtherSubBottomSheetIsOpen,
      setActiveSub,
      setActiveGame,
      user,
   } = useStore(state => state);

   const { data, isSuccess, isLoading } = useQuery({
      queryKey: ['subscriptions'],
      queryFn: getSubs,
   });

   function handleOpenModal(data, isFeed) {
      setMainSubscription(data);
      if (isFeed) setOtherSubBottomSheetIsOpen(true);
      else setMainSubBottomSheetIsOpen(true);
   }

   useEffect(() => {
      if (isLoading) setLoading(true);
      else if (isSuccess) setLoading(false);
   }, [isSuccess, isLoading, setLoading]);

   useEffect(() => {
      setActiveGame({});

      return () => {
         setActiveSub({});
         setMainSubBottomSheetIsOpen(false);
      };
   }, []);

   if (isSuccess) {
      const ubisoftData = data.results.find(r => r.id === 10);
      const gamePassData = data.results.find(r => r.id === 4);
      const fortniteData = data.results.find(r => r.id === 8);
      const esoPlusData = data.results.find(r => r.id === 9);
      const eaPlayData = data.results.find(r => r.id === 7);

      const otherSubs = data.results.filter(r => ![4, 7, 8, 9, 10].includes(r.id));

      content.current = (
         <>
            <section
               style={{
                  background: `url(${subsMainBg}) center/cover no-repeat`,
               }}
               className={cls.subsMainBg}>
               <div className={cls.backDrop} />
               <div style={{ position: 'relative' }} className="wrapper">
                  <h3 className={`${cls.categoryTitle}`}>Подписки</h3>
                  <div className={cls.subInfo}>
                     {user.game_pass_subscribe.status ? (
                        <p>
                           Ваша подписка Game Pass Ultimate закончится{' '}
                           {finishDate.toLocaleDateString()}г через {remainDays}{' '}
                           {num_word(remainDays, ['день', 'дня', 'дней'])}!
                        </p>
                     ) : (
                        <>
                           <p>Ваша подписка не найдена!</p>
                           <div className={cls.subscribe}>
                              <Button>Добавить дату своей подписки</Button>
                              <Button onClick={() => handleOpenModal(gamePassData)}>
                                 Приобрести подписку Ultimate
                              </Button>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </section>
            <div className={`${cls.firstSub} wrapper`}>
               <GameCard
                  isDayGame
                  imgSrc={gamePassData.image}
                  gamePrice={`от ${gamePassData.price}`}
                  gameTitle={gamePassData.title}
                  onClick={() => handleOpenModal(gamePassData)}
               />
            </div>
            <HorizontalSub
               background={ubisoftBg}
               title={ubisoftData.title}
               onClick={() => handleOpenModal(ubisoftData)}
            />
            <div className={`${cls.inlineSubs} wrapper`}>
               <GameCard
                  isDayGame
                  imgSrc={fortniteBg}
                  gamePrice={fortniteData.price}
                  gameTitle={fortniteData.title}
                  subprice={fortniteData.subprice}
                  onClick={() => handleOpenModal(fortniteData)}
               />
               <GameCard
                  isDayGame
                  imgSrc={esoPlusBg}
                  gamePrice={esoPlusData.price}
                  gameTitle={esoPlusData.title}
                  subprice={esoPlusData.subprice}
                  onClick={() => handleOpenModal(esoPlusData)}
               />
            </div>
            <HorizontalSub
               background={eaPlayBg}
               title={eaPlayData.title}
               onClick={() => handleOpenModal(eaPlayData)}
            />
            <div className={`${cls.subs} wrapper`}>
               {otherSubs.map(sub => (
                  <GameCard
                     isDayGame
                     key={sub.id}
                     imgSrc={sub.image}
                     gamePrice={sub.price}
                     gameTitle={sub.title}
                     subprice={sub.subprice}
                     onClick={() => handleOpenModal(sub, true)}
                  />
               ))}
            </div>
         </>
      );
   }

   const finishDate = new Date(user.game_pass_subscribe.finish_date);
   const remainDays = new Date().getDate() - finishDate.getDate();

   return (
      <main style={{ paddingBottom: '90px' }}>
         <MainSubModal adjustPosition={basketBottomSheet} />
         <OtherSubModal adjustPosition={basketBottomSheet} />
         {content.current}
      </main>
   );
};

export default Subscriptions;
