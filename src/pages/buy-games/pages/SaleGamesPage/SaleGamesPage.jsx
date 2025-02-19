import { motion } from 'framer-motion';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Timer } from '../../../../UI/Timer/Timer';
import { shuffleArray } from '../../../../helpers/shuffleArray';
import SaleCarousel from '../../../../UI/SaleCarousel/SaleCarousel';
import {
   StarIcon,
   DiscountIcon,
   RussianFlagIcon,
   FireIcon,
   CalendarIcon,
   DollarincircleIcon,
   PcSupportGamesIcon,
   Xbox360GamesIcon,
} from '../../../../assets';
import { useStore } from '../../../../store';
import GameCard from '../../../../components/GameCard/GameCard';
import { Filters } from '../../../../UI/Filters/Filters';
import { CategoryBottomSheet } from '../../../../modules/CategoryBottomSheet/CategoryBottomSheet';
import { GameInfo } from '../../../../modules/game-info/game-info';
import { getSaleGames } from './api/getSaleGames';
import cls from './style.module.css';
import { Icon } from '@iconify/react/dist/iconify.js';

const evenComponents = [
   <SaleCarousel
      key="UpToThousandGames"
      title="Игры до 1000р"
      icon={FireIcon}
   />,
   <SaleCarousel
      key="UpToFiveHundredGames"
      title="Игры до 500р"
      icon={FireIcon}
   />,
   <SaleCarousel
      key="UpToThousandFiveHundredGames"
      title="Хиты до 1500р"
      icon={DiscountIcon}
   />,
   <SaleCarousel key="Currency" title="Валюта" icon={DollarincircleIcon} />,
   <SaleCarousel
      key="PCSupportGames"
      title="Игры с поддержкой PC"
      icon={PcSupportGamesIcon}
   />,
];

const oddComponents = [
   <SaleCarousel
      key="LatestReleases"
      title="Последние релизы"
      icon={CalendarIcon}
      isOdd
   />,
   <SaleCarousel
      key="DiscountedGames"
      title="Скидки 70-95%"
      icon={DiscountIcon}
      isOdd
   />,
   <SaleCarousel
      key="RussianGames"
      title="Полностью на русском"
      icon={RussianFlagIcon}
      isOdd
   />,
   <SaleCarousel
      key="AdditionsForGames"
      title="Дополнения для игр"
      icon={StarIcon}
      isOdd
   />,
   <SaleCarousel
      key="Xbox360Games"
      title="Xbox 360 games"
      icon={Xbox360GamesIcon}
      isOdd
   />,
];

const SaleGamesPage = memo(function SaleGamesPage() {
   const [page, setPage] = useState(0);
   const [totalGames, setTotalGames] = useState(0);
   const {
      queriesCompleted,
      setLoading,
      gameInfoBottomSheetIsOpen,
      basketBottomSheet,
      setActiveGame,
      setGameInfoBottomSheetIsOpen,
      setIsFromHomeSale,
      setIsEnd,
      gamesCount,
      setGamesCount,
      setCounter,
      emptyCounter,
      setCountButtonUpIsShown,
      setIsAnotherServer
   } = useStore(state => state);

   const { data, isSuccess, isFetching } = useQuery({
      queryKey: [`sale-games-${page}`],
      queryFn: () => getSaleGames(page),
   });

   // REFS
   const content = useRef(null);
   const allGamesContRef = useRef(null);
   const gameCardRef = useRef(null);
   const allGames = useRef([]);

   // CAROUSELS
   const shuffledOddComponents = useMemo(() => shuffleArray(oddComponents), []);
   const shuffledEvenComponents = useMemo(
      () => shuffleArray(evenComponents),
      [],
   );
   const combinedComponents = [];

   const maxLength = Math.max(
      shuffledOddComponents.length,
      shuffledEvenComponents.length,
   );

   for (let i = 0; i < maxLength; i++) {
      if (i < shuffledOddComponents.length) {
         combinedComponents.push(shuffledOddComponents[i]);
      }
      if (i < shuffledEvenComponents.length) {
         combinedComponents.push(shuffledEvenComponents[i]);
      }
   }

   function handleOpenGameInfoBottomSheet(game) {
      setActiveGame(game);
      setIsAnotherServer(true);
      setGameInfoBottomSheetIsOpen(true);
      setIsFromHomeSale(false);
   }

   function enterAllGamesSection() {
      setCountButtonUpIsShown(true);
      setIsEnd(false);
   }

   function leaveAllGamesSection() {
      setCountButtonUpIsShown(false);
      emptyCounter();
   }

   function handleScroll() {
      const allGamesContTop =
         allGamesContRef.current?.getBoundingClientRect().top;
      const cardHeight =
         gameCardRef.current?.getBoundingClientRect().height + 16;

      const counterValue = (
         (allGamesContTop - window.innerHeight) /
         (cardHeight / 2)
      ).toFixed(0);

      if (counterValue < 0) {
         setCounter(counterValue * -1);
      }
   }

   function changePage() {
      if (!isFetching) {
         const maxPageCount = Math.ceil(totalGames / 10);

         if (page < maxPageCount) {
            setPage(prev => prev + 1);
         }
      }
   }

   useEffect(() => {
      if (gamesCount !== data?.count && data?.count) {
         setGamesCount(data?.count);
      }
   }, [data?.count, gamesCount, setGamesCount]);

   useEffect(() => {
      if (combinedComponents.length === queriesCompleted) setLoading(false);
   }, [queriesCompleted]);

   useEffect(() => {
      if (isSuccess) setTotalGames(data.count);
   }, [isSuccess, data?.count]);

   useEffect(() => {
      document.getElementById('root').addEventListener('scroll', handleScroll);

      return () => {
         document
            .getElementById('root')
            .removeEventListener('scroll', handleScroll);
      };
   }, []);

   useEffect(() => {
      if (data) allGames.current = [...allGames.current, ...data.results];
   }, [data]);

   useEffect(() => {
      return () => {
         setActiveGame(null);
         setIsAnotherServer(false);
         setGameInfoBottomSheetIsOpen(false);
      };
   }, []);

   if (isSuccess) {
      content.current = allGames.current.map(game => {
         let obj = {};

         if (Array.isArray(game.price)) {
            obj = game.price[0];
         }

         return (
            <GameCard
               key={game.id}
               ref={gameCardRef}
               release_date={game.release_date}
               game={game}
               onClick={() => handleOpenGameInfoBottomSheet(game)}
               gameTitle={game.game_name}
               gamePrice={Object.keys(obj).length === 0 ? undefined : Math.min(...Object.entries(obj).map(([k, v]) => typeof v !== 'string' && v !== null && v).filter(n => typeof n === 'number'))}
               subprice={obj.discount_percentage}
               imgSrc={game.image_url}
               className={cls.gameCard}
            />
         );
      });
   }

   return (
      <>
         {/* MODAL FOR CAROUSELS */}
         <CategoryBottomSheet
            adjustPosition={gameInfoBottomSheetIsOpen || basketBottomSheet}
         />

         {/* MODAL FOR PRODUCTS */}
         <GameInfo
            adjustPosition={basketBottomSheet}
            onClose={() => setIsAnotherServer(false)}
         />

         <div className="wrapper">
            <p className={cls.productCount}>На распродаже 857 товаров.</p>
         </div>

         <div style={{ marginTop: 18 }}>
            <div className="wrapper">
               <div className={cls.infoWindow}>
                  <p className={cls.infoTitle}>
                     Распродажа заканчивается через
                  </p>
                  <Timer
                     date={'2025-02-04T10:00:00Z'}
                     style={{ margin: '0 auto' }}
                  />
               </div>
            </div>
            <div style={{ marginTop: 20 }}>{combinedComponents}</div>

         </div>
         {/* FEED OF PRODUCTS */}
         <section
            id="feed"
            style={{ position: 'relative', zIndex: 1 }}
         >
            <div className="wrapper">
               <Filters
                  content={{ current: null }}
                  isFetching={false}
                  inBottomSheet={false}
                  page={page}
                  setPage={setPage}
                  totalGames={totalGames}
                  filterBtnsStyle={{ marginBottom: 0 }}
                  contStyle={{
                     margin: 0,
                     width: 'fit-content',
                     overflowX: 'visible',
                  }}
               />

               <div className={cls.categories}>
                  dfgdfg
               </div>

               <motion.div
                  ref={allGamesContRef}
                  style={{
                     position: 'absolute',
                     left: '0',
                     top: '122px',
                     height: 'calc(100% - 70px)',
                     width: '100%',
                  }}
                  onViewportEnter={enterAllGamesSection}
                  onViewportLeave={leaveAllGamesSection}
               />
               <div className={cls.feed}>{content.current}</div>
               {isFetching && (
                  <Icon
                     style={{ margin: '0 auto', display: 'block' }}
                     width={55}
                     icon="eos-icons:three-dots-loading"
                  />
               )}
               <motion.div
                  style={{
                     position: 'absolute',
                     bottom: '-100px',
                     width: '100%',
                     height: '100vh',
                     background: 'transparent',
                     pointerEvents: 'none',
                  }}
                  onViewportEnter={changePage}
               />
            </div>

            <motion.div
               onViewportEnter={() => setIsEnd(true)}
               onViewportLeave={() => setIsEnd(false)}
               style={{ height: '0px' }}
            />
         </section>
      </>
   );
});

export default SaleGamesPage;
