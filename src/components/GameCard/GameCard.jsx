/* eslint-disable react-refresh/only-export-components */
import { forwardRef, memo } from 'react';

import cls from './GameCard.module.css';
import { GamePassIcon, XSIcon } from '../../assets';
import russianFlagImg from '../../assets/icons/russian-flag-icon.svg';
import { useStore } from '../../store';
import { CLUE_TITLE } from '../../consts/clue-info';
import { getClueText } from '../../helpers/getClueText';

const GameCard = (
   {
      release_date,
      imgSrc,
      gameTitle,
      gamePrice,
      subprice,
      preOrder = false,
      xs = false,
      lang,
      seriesCard,
      size = 'md',
      in_game_pass,
      isDayGame,
      ...props
   },
   ref,
) => {
   const { changeXsIsOpen, setXsText, setXsTitle, setIsGamePass } = useStore(
      state => state,
   );

   const gameObj = {
      title: gameTitle,
      release_date,
      in_game_pass,
      compatibility: xs && 'xbox_series_x_s',
      pre_order: preOrder,
   };

   function handleOpenClue(e, title, text) {
      e.stopPropagation();
      setXsTitle(title);
      setXsText(text);

      if (in_game_pass) setIsGamePass(true);

      changeXsIsOpen(true);
   }

   return (
      <>
         <div
            className={`${cls.gameCard} ${cls[size]} ${
               seriesCard ? cls.seriesCard : ''
            } ${isDayGame ? cls.dayGame : ''}`}
            ref={ref}
            {...props}>
            <div className={cls.imgWrapper}>
               <img src={imgSrc} alt="" loading="lazy" />
               {preOrder && (
                  <p
                     onClick={e =>
                        handleOpenClue(
                           e,
                           CLUE_TITLE,
                           getClueText(gameObj).pre_order,
                        )
                     }
                     className={cls.banner}>
                     Предзаказ
                  </p>
               )}

               <div className={cls.XSCont}>
                  {in_game_pass && (
                     <button
								className={cls.rusBtn}
								onClick={e =>
									handleOpenClue(
										e,
										'Game Pass Ultimate',
										getClueText(gameObj).game_pass,
									)
								}
							>
                        {/* <img src={russianFlagImg} alt='' /> */}
                        <GamePassIcon width={35} height={25} />
                     </button>
                  )}
                  {xs && (
                     <button
                        className={cls.xsBtn}
                        onClick={e =>
                           handleOpenClue(
                              e,
                              CLUE_TITLE,
                              getClueText(gameObj).xs,
                           )
                        }>
                        <XSIcon width={45} height={35} />
                     </button>
                  )}
               </div>
               <div className={cls.flagCont}>
                  {lang === 'russian' && (
                     <button className={cls.rusBtn}>
                        <img src={russianFlagImg} alt="" />
                     </button>
                  )}
               </div>
            </div>
            {!seriesCard && (
               <div className={cls.gameInfo}>
                  <h2
                     className={`${cls.gameTitle} ${
                        seriesCard ? cls.seriesCardTitle : ''
                     }`}>
                     {gameTitle}
                  </h2>
                  <div className={cls.gamePriceCont}>
                     {subprice && subprice !== '0.00' ? (
                        <>
                           <div className={cls.discount}>{gamePrice} ₽</div>
                           <p className={cls.price}>{subprice} ₽</p>
                        </>
                     ) : (
                        gamePrice && <p className={cls.price}>{gamePrice} ₽</p>
                     )}
                  </div>
               </div>
            )}
         </div>
      </>
   );
};

export default memo(forwardRef(GameCard));
