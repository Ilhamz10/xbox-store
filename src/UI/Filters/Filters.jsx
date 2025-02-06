import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
   AlphabetIcon,
   DiscountIcon,
   DollarincircleIcon,
   KeyboardIcon,
   RussianFlagIcon,
   StarIcon,
   TimeIcon,
   TwoArrowsIcon,
   XboxIcon,
   XSIcon,
} from '../../assets';
import { FilterButton } from '../FilterButton/FilterButton';
import { Modal } from '../Modal/modal';
import Button from '../Button/Button';
import { useStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';
import cls from './Filters.module.css';
import { Icon } from '@iconify/react/dist/iconify.js';

export const Filters = ({
   page,
   content,
   setPage,
   isFetching,
   totalGames,
   inBottomSheet,
   withFilters = true,
   filterBtnsStyle,
   contStyle,
}) => {
   const [filtersIsOpen, setFiltersIsOpen] = useState(false);
   const [sortIsOpen, setSortIsOpen] = useState(false);
   const allGamesContRef = useRef(null);

   const [sortType, setSortType] = useState({
      type: '',
      text: 'По умолчанию',
      icon: TwoArrowsIcon,
   });

   const [filterType, setFilterType] = useState({
      type: '',
      text: 'Все игры',
      icon: TwoArrowsIcon,
   });

   const { emptyCounter, setCountButtonUpIsShown, setIsEnd } = useStore(
      useShallow(state => state),
   );

   function handleSortGames(sort) {
      setPage(1);
      setSortType(sort);
      setSortIsOpen(false);
   }

   function handleFilterGames(filter) {
      setPage(1);
      setFilterType(filter);
      setFiltersIsOpen(false);
   }

   function enterAllGamesSection() {
      setCountButtonUpIsShown(true);
      setIsEnd(false);
   }

   function leaveAllGamesSection() {
      setCountButtonUpIsShown(false);
      emptyCounter();
   }

   function changePage() {
      if (!isFetching) {
         const maxPageCount = Math.ceil(totalGames / 10);

         if (page < maxPageCount) {
            setPage(prev => prev + 1);
         }
      }
   }

   return (
      <>
         <section style={{ position: 'relative', zIndex: 1, ...contStyle }}>
            <div className="wrapper">
               {/* {activeCategory.name && (
						<div
							style={inBottomSheet && { marginTop: 0 }}
							className={cls.sectionHeader}>
							<h2 className='section-title'>
								{activeCategory.name}{' '}
								<span style={{ fontSize: '14px' }}>
									({data?.count} {numWordWithMemo})
								</span>
							</h2>
						</div>
					)} */}
               {withFilters && (
                  <div
                     style={filterBtnsStyle}
                     className={cls.filterButtons}
                  >
                     <Button
                        onClick={() => setSortIsOpen(true)}
                        Icon={sortType.icon}
                        iconSize={16}>
                        {sortType.text}
                     </Button>
                     <Button
                        onClick={() => setFiltersIsOpen(true)}
                        Icon={filterType.icon}
                        iconSize={16}>
                        {filterType.text}
                     </Button>
                  </div>
               )}
               <motion.div
                  ref={allGamesContRef}
                  style={{
                     position: 'absolute',
                     left: '0',
                     top: '122px',
                     height: inBottomSheet
                        ? 'calc(100% - 70px)'
                        : 'calc(100% - 70px)',
                     width: '100%',
                  }}
                  onViewportEnter={enterAllGamesSection}
                  onViewportLeave={leaveAllGamesSection}
               />
               <div className={cls.allGamesCont}>{content.current}</div>
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
         <Modal
            className={inBottomSheet && cls.modal}
            isOpen={filtersIsOpen}
            setIsopen={setFiltersIsOpen}>
            <div className={cls.gameFilters}>
               <h3 className="section-title">Фильтры</h3>
               <div className={cls.filters}>
                  <FilterButton
                     onClick={() =>
                        handleFilterGames({
                           type: '',
                           text: 'Все игры',
                           icon: TwoArrowsIcon,
                        })
                     }
                     text={'Все игры'}
                     isChecked={filterType.type === ''}
                     Icon={TwoArrowsIcon}
                  />
                  <FilterButton
                     onClick={() =>
                        handleFilterGames({
                           type: 'voice_acting=russian',
                           text: 'Полностью Русские',
                           icon: RussianFlagIcon,
                        })
                     }
                     text={'Полностью Русские'}
                     isChecked={filterType.type === 'voice_acting=russian'}
                     Icon={RussianFlagIcon}
                  />
                  <FilterButton
                     onClick={() =>
                        handleFilterGames({
                           type: 'compatibility=xbox_series_x_s',
                           text: 'Версия для Series X/S',
                           icon: XSIcon,
                        })
                     }
                     text={'Версия для Series X/S'}
                     isChecked={
                        filterType.type === 'compatibility=xbox_series_x_s'
                     }
                     Icon={XSIcon}
                  />
                  <FilterButton
                     onClick={() =>
                        handleFilterGames({
                           type: 'compatibility=xbox_one',
                           text: 'Версия для Xbox One',
                           icon: XboxIcon,
                        })
                     }
                     text={'Версия для Xbox One'}
                     isChecked={filterType.type === 'compatibility=xbox_one'}
                     Icon={XboxIcon}
                  />
               </div>
            </div>
         </Modal>
         <Modal
            className={inBottomSheet && cls.modal}
            isOpen={sortIsOpen}
            setIsopen={setSortIsOpen}>
            <div className={cls.gameFilters}>
               <h3 className="section-title">Сортировка</h3>
               <div className={cls.filters}>
                  <FilterButton
                     onClick={() =>
                        handleSortGames({
                           type: '',
                           text: 'По умолчанию',
                           icon: TwoArrowsIcon,
                        })
                     }
                     text={'По умолчанию'}
                     isChecked={sortType.type === ''}
                     Icon={TwoArrowsIcon}
                  />
                  <FilterButton
                     onClick={() =>
                        handleSortGames({
                           type: 'title',
                           text: 'A..z по убыванию',
                           icon: AlphabetIcon,
                        })
                     }
                     text={'A..z по убыванию'}
                     isChecked={sortType.type === 'title'}
                     Icon={AlphabetIcon}
                  />
                  <FilterButton
                     onClick={() =>
                        handleSortGames({
                           type: '-title',
                           text: 'Z..a по возрастанию',
                           icon: KeyboardIcon,
                        })
                     }
                     text={'Z..a по возрастанию'}
                     isChecked={sortType.type === '-title'}
                     Icon={KeyboardIcon}
                  />
                  <FilterButton
                     onClick={() =>
                        handleSortGames({
                           type: '-release_date',
                           text: 'Новые игры',
                           icon: StarIcon,
                        })
                     }
                     text={'Новые игры'}
                     isChecked={sortType.type === '-release_date'}
                     Icon={StarIcon}
                  />
                  <FilterButton
                     onClick={() =>
                        handleSortGames({
                           type: 'release_date',
                           text: 'Старые игры',
                           icon: TimeIcon,
                        })
                     }
                     text={'Старые игры'}
                     isChecked={sortType.type === 'release_date'}
                     Icon={TimeIcon}
                  />
                  <FilterButton
                     onClick={() =>
                        handleSortGames({
                           type: 'price',
                           text: 'Сначала дешевые',
                           icon: DiscountIcon,
                        })
                     }
                     text={'Сначала дешевые'}
                     isChecked={sortType.type === 'price'}
                     Icon={DiscountIcon}
                  />
                  <FilterButton
                     onClick={() =>
                        handleSortGames({
                           type: '-price',
                           text: 'Сначала дорогие',
                           icon: DollarincircleIcon,
                        })
                     }
                     text={'Сначала дорогие'}
                     isChecked={sortType.type === '-price'}
                     Icon={DollarincircleIcon}
                  />
               </div>
            </div>
         </Modal>
      </>
   );
};
