import { useStore } from '../../../../store';
import { CustomBottomSheet } from '../../../../UI/BottomSheet/BottomSheet';
import cls from './GamePassModal.module.css';

export const GamePassModal = ({ adjustPosition }) => {
   const {
      gamePassSubscription,
      gamePassBottomSheetIsOpen,
      setGamePassBottomSheetIsOpen,
   } = useStore(state => state);

   return (
      <CustomBottomSheet
         adjustPosition={adjustPosition}
         isOpen={gamePassBottomSheetIsOpen}
         setIsopen={setGamePassBottomSheetIsOpen}
         sheetBgColor="#232222"
      >
         <div className={cls.container}>
            <div className={cls.priceCont}>
               <img
                  src={gamePassSubscription.wallpaper}
                  alt="game-pass-sub-img"
                  className={cls.background}
               />

               <div className={cls.prices}>
                  {gamePassSubscription.subprice !== '0.00' ? (
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
                        {gamePassSubscription.subprice.price} ₽
                     </p>
                  )}
               </div>
            </div>

            <div className={cls.content}>
               <section className="wrapper">
                  <h1>{gamePassSubscription.title}</h1>
                  <p>{gamePassSubscription.description}</p>
               </section>
            </div>
         </div>
      </CustomBottomSheet>
   );
};
