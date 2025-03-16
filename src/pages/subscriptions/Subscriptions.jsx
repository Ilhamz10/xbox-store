import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import WebApp from '@twa-dev/sdk';
import { toast } from 'react-toastify';

import { useStore } from '../../store';
import subsMainBg from '../../assets/imgs/gamepass-main-bg.jpg';
import ubisoftBg from '../../assets/imgs/ubisoft-bg.jpg';
import esoPlusBg from '../../assets/imgs/eso-plus-bg.webp';
import eaPlayBg from '../../assets/imgs/ea-play-bg.webp';
import fortniteBg from '../../assets/imgs/fortnite-bg.webp';
import redXbox from '../../assets/imgs/red-xbox.webp';
import yellowXbox from '../../assets/imgs/yellow-xbox.webp';
import greenXbox from '../../assets/imgs/green-xbox.webp';
import GameCard from '../../components/GameCard/GameCard';
import { MainSubModal } from './components/MainSubModal/MainSubModal';
import { getSubs } from './api/getSubs';
import { HorizontalSub } from './components/HorizontalSub/HorizontalSub';
import Button from '../../UI/Button/Button';
import { num_word } from '../../helpers';
import { NewAccModal } from './components/NewAccModal/NewAccModal';
import { addGameToBasket } from '../../layout/footer/api/addGameToBasket';
import { NewAccIcon, SubCalendarIcon } from '../../assets';
import { saveDate } from './api/saveDate';
import cls from './style.module.css';
import { hashString } from '../../helpers/hashString';

const Subscriptions = () => {
   const queryClient = useQueryClient();
   const content = useRef(null);
   const [dateModalIsOpen, setDateModalIsOpen] = useState(false);
   const [selectedDate, setSelectedDate] = useState(new Date());
   const {
      setLoading,
      basketBottomSheet,
      setMainSubscription,
      setMainSubBottomSheetIsOpen,
      setActiveSub,
      setActiveGame,
      user,
      isNewAccOpen,
      setIsNewAccOpen,
      basketId,
      basketGamesId
   } = useStore(state => state);

   const { data, isSuccess, isLoading } = useQuery({
      queryKey: ['subscriptions'],
      queryFn: getSubs,
   });

   const { mutate } = useMutation({
      mutationFn: addGameToBasket,
      onMutate: async ({ product_id, game }) => {
         await queryClient.cancelQueries({ queryKey: ['create-basket'] });

         const previousBasket = queryClient.getQueryData(['create-basket']);

         queryClient.setQueryData(['create-basket'], old => ({
            ...old,
            items: [...old.items, game],
            current_item_ids: [...old.current_item_ids, product_id],
         }));

         return { previousBasket };
      },
      onError: (_, __, context) => {
         queryClient.setQueryData(['create-basket'], context.previousBasket);
      },
      onSettled: () => {
         queryClient.invalidateQueries('create-basket');
      },
   });

   const { mutate: mutateSaveDate, isSuccess: isSaveDateSuccess } = useMutation({
      mutationFn: saveDate,
      onSuccess: () => { queryClient.invalidateQueries('user-info') },
      onError: () => toast.error('Что-то пошло не так!', { autoClose: 2300 }),
   });

   const serviceInBasket = basketGamesId.includes(299);

   const handleCreateNewAcc = () => {
      if (!serviceInBasket) {
         mutate({
            product_id: 299,
            basket_id: basketId,
            game: { id: 299 },
         });
      }

      setIsNewAccOpen(false);
   };

   const handleSaveDate = async () => {
      const id = WebApp?.initDataUnsafe?.user?.id || 1147564292;
      const token = await hashString(import.meta.env.VITE_AUTH_TOKEN + id);

      await mutateSaveDate({
         id,
         token,
         status: true,
         start_date: new Date().toLocaleDateString(),
         finish_date: selectedDate.toLocaleDateString(),
      });

      if (isSaveDateSuccess) {
         toast.success('Дата сохранена!', { autoClose: 2300 });
         setDateModalIsOpen(false);
      }
   };

   const handleOpenModal = data => {
      setMainSubscription(data);
      setMainSubBottomSheetIsOpen(true);
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
      // SUBSCRIPTIONS DATA
      const ubisoftData = data.results.find(r => r.id === 10);
      const gamePassData = data.results.find(r => r.id === 4);
      const fortniteData = data.results.find(r => r.id === 8);
      const esoPlusData = data.results.find(r => r.id === 9);
      const eaPlayData = data.results.find(r => r.id === 7);
      const otherSubs = data.results.filter(
         r => ![4, 7, 8, 9, 10].includes(r.id),
      );

      // FINISH DATE CALCULATION
      const finishDate = user.game_pass_subscribe.finish_date;
      const [day, month, year] = finishDate
         ? finishDate.split('.').map(Number)
         : [];
      const dateObjFinishDate = new Date(year, month - 1, day);
      const diff = dateObjFinishDate - new Date();
      const remainDays = Number.isNaN(diff)
         ? 0
         : Math.ceil(diff / (1000 * 60 * 60 * 24));

      const getSettings = () => {
         if (remainDays <= 10) return { image: redXbox, color: '#d02900' };
         else if (remainDays < 30)
            return { image: yellowXbox, color: '#c3be00' };
         else return { image: greenXbox, color: '#018808' };
      };

      const { image, color } = getSettings();

      content.current = (
         <>
            <MainSubModal
               adjustPosition={basketBottomSheet}
               similarSubs={data.results}
            />
            <NewAccModal
               className={cls.accModal}
               isOpen={isNewAccOpen}
               setIsOpen={setIsNewAccOpen}
            >
               <div className={`xs-info ${cls.accModalCont}`}>
                  <h3 className="xs-title section-title">Дополнительная услуга</h3>
                  <hr className={cls.hr} />
                  <NewAccIcon width={85} height={85} />
                  <p style={{ textAlign: 'center', marginTop: 10 }}>
                     Создать новую учетную запись за вас?
                  </p>

                  <div className={cls.modalButtons}>
                     <Button onClick={handleCreateNewAcc}>Создать</Button>
                     <Button onClick={() => setIsNewAccOpen(false)}>
                        Сам создам
                     </Button>
                  </div>
               </div>
            </NewAccModal>
            <NewAccModal
               className={cls.accModal}
               isOpen={dateModalIsOpen}
               setIsOpen={() => {}}
            >
               <div className={`xs-info ${cls.accModalCont}`}>
                  <h3
                     style={{ textWrap: 'balance', fontSize: '1.2rem' }}
                     className="xs-title section-title"
                  >
                     Выберите дату окончания вашей подписки
                  </h3>
                  <hr className={cls.hr} />
                  <SubCalendarIcon width={50} height={50} />

                  <div className={cls.datePicker}>
                     <DatePicker
                        locale={ru}
                        dateFormat="dd.MM.yyyy"
                        selected={selectedDate}
                        onChange={setSelectedDate}
                        popperPlacement="top"
                        minDate={new Date().setDate(new Date().getDate() + 5)}
                        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 3))}
                     />
                     <p className={cls.warning}>
                        🔔 Добавив данные о вашей подписке вы заблаговременно до окончания 
                        ее получите уведомление что ваша подписка заканчивается!
                     </p>
                  </div>

                  <div className={cls.modalButtons}>
                     <Button onClick={handleSaveDate}>
                        Сохранить
                     </Button>
                     <Button onClick={() => setDateModalIsOpen(false)}>
                        Отмена
                     </Button>
                  </div>
               </div>
            </NewAccModal>

            <section
               style={{
                  background: `url(${subsMainBg}) center/cover no-repeat`,
               }}
               className={cls.subsMainBg}>
               <div className={cls.backDrop} />
               <div style={{ position: 'relative' }} className="wrapper">
                  <h3 className={`${cls.categoryTitle}`}>Подписки</h3>
                  <div style={{ marginTop: remainDays >= 30 ? 13 : 0}} className={cls.subInfo}>
                     <div className={cls.xboxLabel}>
                        <img src={image} alt="xbox" />
                        <div className={cls.remainDays}>
                           <p style={{ color }}>
                              {remainDays}
                              <br />
                              <span>
                                 {num_word(remainDays, ['День', 'Дня', 'Дней'])}
                              </span>
                           </p>
                        </div>
                     </div>

                     {user.game_pass_subscribe.status ? (
                        <div className={cls.subInfoItem}>
                           <h2 className={cls.gamePassTitle}>
                              Game Pass Ultimate
                           </h2>
                           <div className={cls.dayOfExpire}>
                              <p>Закончится {finishDate}</p>
                           </div>
                           {remainDays < 30 && (
                              <Button
                                 className={cls.extendBtn}
                                 onClick={() => handleOpenModal(gamePassData)}
                              >
                                 Продлить подписку
                              </Button>
                           )}
                        </div>
                     ) : (
                        <div className={cls.subNotFound}>
                           <h2 className={cls.gamePassTitle}>
                              Game Pass Ultimate
                           </h2>
                           <div className={cls.dayOfExpire}>
                              <p>Ваша подписка не найдена</p>
                           </div>
                           <div className={cls.subscribe}>
                              <Button
                                 onClick={() => handleOpenModal(gamePassData)}>
                                 Приобрести подписку Ultimate
                              </Button>
                              <Button onClick={() => setDateModalIsOpen(true)}>
                                 Добавить дату своей подписки
                              </Button>
                           </div>
                        </div>
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

   return <main style={{ paddingBottom: '90px' }}>{content.current}</main>;
};

export default Subscriptions;
