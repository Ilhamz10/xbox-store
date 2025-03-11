import { Icon } from '@iconify/react/dist/iconify.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRef, useState } from 'react';

import { useStore } from '../../../../store';
import { ImageModal } from '../../../../UI/ImageModal/ImageModal';
import { gamePassHeader } from '../../../../consts/game-pass-header';
import { CustomBottomSheet } from '../../../../UI/BottomSheet/BottomSheet';
import { AboutGamePass } from '../AboutGamePass/AboutGamePass';
import cls from './MainSubModal.module.css';
import { num_word } from '../../../../helpers'

export const MainSubModal = ({ adjustPosition, similarSubs }) => {
   const [bigImage, setBigImage] = useState('');
   const [page, setPage] = useState(0);
   const {
      isAdmin,
      mainSubBottomSheetIsOpen,
      setMainSubBottomSheetIsOpen,
      mainSubscription,
      activeSub,
   } = useStore(state => state);

   // REFS
   const activeBarRef = useRef(null);
   const swiperRef = useRef(null);

   function handleActiveBarWidth(index) {
      const node = document.querySelector(`#active-page-${index}`);
      if (!node || !activeBarRef.current) return;

      const widthOfCurrentNode = window.getComputedStyle(node).width;
      activeBarRef.current.style.width = widthOfCurrentNode;
   }

   function handleSwiper(sw) {
      swiperRef.current = sw;
      handleActiveBarWidth(sw.activeIndex);
      sw.on('setTranslate', () => handleDiscardScroll(sw));
   }

   function handleSlideChange(sw) {
      handleActiveBarWidth(sw.activeIndex);
      setPage(sw.activeIndex);
   }

   function handleDiscardScroll(sw) {
      const maxTranslate = sw.maxTranslate();

      if (sw.translate > 0) sw.setTranslate(0);
      else if (sw.translate < maxTranslate) sw.setTranslate(maxTranslate);
   }

   function handleProgress(sw) {
      if (!activeBarRef.current) return;

      const swiperWrapper = sw.wrapperEl;
      const slidesCount = sw.slides.length;
      const totalWidth = swiperWrapper.clientWidth;
      const slidesWidth = totalWidth / slidesCount;

      const left =
         (totalWidth - slidesWidth) * sw.progress +
         (slidesWidth - 110) * sw.progress;
      activeBarRef.current.style.left = `${
         sw.progress == 1 ? left - 6 : left || 9
      }px`;
   }

   return (
      <CustomBottomSheet
         shareIcon
         adjustPosition={adjustPosition}
         isOpen={mainSubBottomSheetIsOpen}
         setIsopen={setMainSubBottomSheetIsOpen}
         sheetBgColor="#232222">
         {isAdmin && (
            <a
               target="_blank"
               href={`https://api.xbox-rent.ru/admin/webapp/subscription`}
               className={cls.editButton}>
               <Icon
                  style={{ display: 'block' }}
                  width={20}
                  height={20}
                  icon="cuida:edit-outline"
               />
            </a>
         )}

         {bigImage && (
            <ImageModal bigImage={bigImage} setBigImage={setBigImage} />
         )}

         <section
            style={{ position: 'relative', zIndex: 1, minHeight: '100%' }}>
            <div className={cls.gameInfoCont}>
               <div className={cls.gameInfoMainImgCont}>
                  <img
                     className={cls.gameInfoMainImg}
                     src={mainSubscription.wallpaper}
                     alt="wallpaper"
                     fetchpriority="high"
                  />
                  <img
                     style={{
                        filter: 'blur(4px)',
                        transform: 'rotate(180deg) scaleX(-1)',
                     }}
                     className={cls.gameInfoMainImg}
                     src={mainSubscription.wallpaper}
                     alt="wallpaper"
                  />
                  <div className={cls.gamePriceCont}>
                     {activeSub.price ? (
                        <p style={{ color: '#efd000' }} className={cls.price}>
                           {activeSub.duration_months}{' '}
                           {num_word(activeSub.duration_months, ['месяц', 'месяца', 'месяцев'])} -{' '}
                           {activeSub.price} ₽
                        </p>
                     ) : mainSubscription.subprice !== '0.00' ? (
                        <>
                           <p className={cls.price}>
                              {mainSubscription.price} ₽
                           </p>
                           -
                           <p className={cls.price}>
                              {mainSubscription.subprice} ₽
                           </p>
                        </>
                     ) : (
                        <p className={cls.price}>{mainSubscription.price} ₽</p>
                     )}
                  </div>
               </div>
               <div style={{ background: '#232222' }}>
                  <header className={cls.gameInfoHeader}>
                     <div className="wrapper">
                        <div className={cls.gameInfoHeaderLinks}>
                           {mainSubscription.games_list_enabled ? (
                              gamePassHeader.map((str, i) => (
                                 <button
                                    key={i}
                                    id={`active-page-${i}`}
                                    className={`${cls.navBtn} ${
                                       page == i && cls.active
                                    }`}
                                    onClick={() =>
                                       swiperRef.current.slideTo(i)
                                    }>
                                    {str}
                                 </button>
                              ))
                           ) : (
                              <button
                                 id="active-page-0"
                                 className={`${cls.navBtn} ${cls.active}`}
                              >
                                 О подписке
                              </button>
                           )}
                           <span ref={activeBarRef} className={cls.activeBar} />
                        </div>
                     </div>
                  </header>
                  <div>
                     <Swiper
                        autoHeight
                        onSwiper={handleSwiper}
                        onProgress={handleProgress}
                        onSlideChange={handleSlideChange}
                        style={{ paddingBottom: 150 }}>
                        <SwiperSlide>
                           <AboutGamePass
                              setBigImage={setBigImage}
                              similarSubs={similarSubs}
                              sub={'main'}
                           />
                        </SwiperSlide>
                        {mainSubscription.games_list_enabled && (
                           <SwiperSlide>
                              <div
                                 style={{
                                    background: '#232222',
                                    transform: 'translateY(180px)',
                                    paddingTop: 20,
                                    paddingBottom: 90,
                                    height: 1000,
                                 }}
                              />
                           </SwiperSlide>
                        )}
                     </Swiper>
                  </div>
               </div>
            </div>
         </section>
      </CustomBottomSheet>
   );
};
