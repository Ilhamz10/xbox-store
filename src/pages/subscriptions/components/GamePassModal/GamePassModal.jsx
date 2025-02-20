import { Icon } from '@iconify/react/dist/iconify.js';

import { useStore } from '../../../../store';
import { CustomBottomSheet } from '../../../../UI/BottomSheet/BottomSheet';
import { GamePassCarousel } from '../GamePassCarousel/GamePassCarousel';
import cls from './GamePassModal.module.css';

export const GamePassModal = ({ adjustPosition }) => {
   const {
      isAdmin,
      gamePassSubscription,
      gamePassBottomSheetIsOpen,
      setGamePassBottomSheetIsOpen,
      activeSub,
      setActiveSub
   } = useStore(state => state);

   return (
      <CustomBottomSheet
         shareIcon
         adjustPosition={adjustPosition}
         isOpen={gamePassBottomSheetIsOpen}
         setIsopen={setGamePassBottomSheetIsOpen}
         sheetBgColor="#232222">
         {isAdmin && (
            <a
               target="_blank"
               href={`https://api.xbox-rent.ru/admin/webapp/subscription/${gamePassSubscription.id}`}
               className={cls.editButton}>
               <Icon
                  style={{ display: 'block' }}
                  width={20}
                  height={20}
                  icon="cuida:edit-outline"
               />
            </a>
         )}

         <section
            style={{ position: 'relative', zIndex: 1, minHeight: '100%' }}>
            <div className={cls.gameInfoCont}>
               <div className={cls.gameInfoMainImgCont}>
                  <img
                     className={cls.gameInfoMainImg}
                     src={gamePassSubscription.wallpaper}
                     alt="wallpaper"
                     fetchpriority="high"
                  />
                  <img
                     style={{
                        filter: 'blur(4px)',
                        transform: 'rotate(180deg) scaleX(-1)',
                     }}
                     className={cls.gameInfoMainImg}
                     src={gamePassSubscription.wallpaper}
                     alt="wallpaper"
                  />
                  <div className={cls.gamePriceCont}>
                     {activeSub.price ? (
                        <p
                           style={{ color: '#efd000' }}
                           className={cls.price}
                        >
                           {activeSub.price} ₽
                        </p>
                     ) : gamePassSubscription.subprice !== '0.00' ? (
                        <>
                           <div className={cls.discount}>
                              {gamePassSubscription.price} ₽
                           </div>
                           <p className={cls.price}>
                              {gamePassSubscription.subprice} ₽
                           </p>
                        </>
                     ) : (
                        <p className={cls.price}>
                           {gamePassSubscription.price} ₽
                        </p>
                     )}
                  </div>
               </div>
               <div style={{ background: '#232222' }}>
                  <main className={cls.gameInfoMain}>
                     <div className="wrapper">
                        <div className={cls.header}>
                           <img
                              src={gamePassSubscription.image}
                              alt="game-pass-image"
                              fetchpriority="high"
                           />

                           <div>
                              <h2>{gamePassSubscription.title}</h2>
                              <p className={cls.count}>Сейчас в подписке 456 игр</p>
                           </div>
                        </div>

                        <div className={cls.carousels}>
                           {gamePassSubscription.types?.map(type => (
                              <GamePassCarousel
                                 key={type.id}
                                 subscription={type}
                                 setActiveSub={setActiveSub}
                                 activeSub={activeSub}
                              />
                           ))}
                        </div>

                        <div className={cls.desc}>
                           <h4>Описание:</h4>
                           <p>{gamePassSubscription.description}</p>
                        </div>
                     </div>
                  </main>
               </div>
            </div>
         </section>
      </CustomBottomSheet>
   );
};
