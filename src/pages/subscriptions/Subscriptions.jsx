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
import SectionWithSlide from '../../components/SectionWithSlide/SectionWithSlide';
import { MainSubModal } from './components/MainSubModal/MainSubModal';
import { getSubs } from './api/getSubs';
import { HorizontalSub } from './components/HorizontalSub/HorizontalSub';
import Button from '../../UI/Button/Button';
import { num_word } from '../../helpers';
import { NewAccModal } from './components/NewAccModal/NewAccModal';
import { addGameToBasket } from '../../layout/footer/api/addGameToBasket';
import { NewAccIcon, SubCalendarIcon, EmailIcon, PasswordIcon } from '../../assets';
import { saveClientData } from './api/saveClientData';
import { hashString } from '../../helpers/hashString';
import { emailRegex } from '../../consts/regex/email.regex';
import { passwordRegex } from '../../consts/regex/pass.regex'
import { useDeleteSub } from '../../hooks/useDeleteSub';
import cls from './style.module.css';
import { getRentSubs } from './api/getRentSubs'

const Subscriptions = () => {
   const queryClient = useQueryClient();
   const content = useRef(null);
   const [dateModalIsOpen, setDateModalIsOpen] = useState(false);
   const [selectedDate, setSelectedDate] = useState();
   const [login, setLogin] = useState('');
   const [password, setPassword] = useState('');
   const [loginError, setLoginError] = useState('');
   const [passwordError, setPasswordError] = useState('');
   const [isConfirmed, setIsConfirmed] = useState(false);
   const [isAfterQuestion, setIsAfterQuestion] = useState(false);
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
      basketGamesId,
      setBasketBottomSheet,
      activeSub,
      isOldAccOpen,
      setIsOldAccOpen,
      microsoftModalIsOpen,
      setMicrosoftModalIsOpen,
      isOldAcc,
   } = useStore(state => state);

   const { data, isSuccess, isLoading } = useQuery({
      queryKey: ['subscriptions'],
      queryFn: getSubs,
   });

   const { data: rentSubsData, isSuccess: rentSubsSuccess, isLoading: rentSubsLoading } = useQuery({
      queryKey: ['rent-subs'],
      queryFn: getRentSubs,
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

   const { mutate: mutateSaveDate } = useMutation({
      mutationFn: saveClientData,
      onError: () => toast.error('Что-то пошло не так!'),
      onSuccess: () => {
         queryClient.invalidateQueries('user-info');
         setDateModalIsOpen(false);
         setSelectedDate(null);
         toast.success('Дата сохранена!');
      },
   });

   const { mutate: mutateSaveMicrosoft } = useMutation({
      mutationFn: saveClientData,
      onError: () => toast.error('Что-то пошло не так!'),
      onSuccess: () => {
         setMicrosoftModalIsOpen(false);
         toast.success('Данные сохранены!');
         setBasketBottomSheet(true);
         queryClient.invalidateQueries('user-info');
      }
   });

   const { mutate: deleteSub } = useDeleteSub();

   const serviceInBasket = basketGamesId.includes(299);
   const userId = WebApp?.initDataUnsafe?.user?.id;
   const userToken = hashString(import.meta.env.VITE_AUTH_TOKEN + userId);

   const handleCreateNewAcc = () => {
      if (!serviceInBasket) {
         mutate({
            product_id: 299,
            basket_id: basketId,
            game: { id: 299 },
         });
      }

      setBasketBottomSheet(true);
      setIsNewAccOpen(false);
   };

   const handleSaveDate = async () => {
      if (!selectedDate) return;

      await mutateSaveDate({
         id: userId,
         token: await userToken,
         game_pass_subscribe: {
            status: true,
            start_date: new Date().toLocaleDateString(),
            finish_date: selectedDate.toLocaleDateString(),
         },
      });
   };

   const isValidSchema = () => {
      let isValid = true;
      
      if (!emailRegex.test(login)) {
         setLoginError('Введите правильный email адрес!');
         isValid = false;
      } else setLoginError('');

      if (!passwordRegex.test(password)) {
         setPasswordError('Пароли должны включать не менее 8 и не более 30 знаков, которые относятся по крайней мере к двум из следующих типов: буквы верхнего и нижнего регистров, цифры и символы.');
         isValid = false;
      } else setPasswordError('');

      return isValid;
   }

   const handleSaveMicrosoft = async e => {
      e.preventDefault();

      if (!isValidSchema()) return;

      if (!isConfirmed) {
         setIsConfirmed(true);
         return;
      }

      mutateSaveMicrosoft({
         id: userId,
         token: await userToken,
         microsoft_account: { login, password },
      });
   }

   const handleOpenModal = data => {
      setMainSubscription(data);
      setMainSubBottomSheetIsOpen(true);
   }

   const handleCloseNewAccModal = () => {
      setIsNewAccOpen(false);
      setMicrosoftModalIsOpen(true);
   }

   const handleCloseMicrosoftModal = () => {
      setMicrosoftModalIsOpen(false);
      deleteSub({
         period_id: activeSub.id,
         basket_id: basketId,
         game: activeSub,
      })
   }

   useEffect(() => {
      if (isLoading || rentSubsLoading) setLoading(true);
      else if (isSuccess && rentSubsSuccess) setLoading(false);
   }, [isSuccess, isLoading, rentSubsLoading, rentSubsSuccess, setLoading]);

   useEffect(() => {
      if (!microsoftModalIsOpen) {
         setLogin('');
         setPassword('');
         setLoginError('');
         setPasswordError('');
         setIsConfirmed(false);
      }
   }, [microsoftModalIsOpen]);

   useEffect(() => {
      setActiveGame({});

      return () => {
         setActiveSub({});
         setMainSubBottomSheetIsOpen(false);
      };
   }, []);

   if (isSuccess && rentSubsSuccess) {
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
      const finishDate = user?.game_pass_subscribe?.finish_date;
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
               setIsOpen={() => {
                  setIsNewAccOpen(false);
                  deleteSub({
                     period_id: activeSub.id,
                     basket_id: basketId,
                     game: activeSub,
                  });
               }}
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
                     <Button onClick={handleCloseNewAccModal}>
                        Создам сам
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
                        placeholderText="Укажите дату"
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

            <NewAccModal
               className={cls.accModal}
               isOpen={isOldAccOpen}
               setIsOpen={() => {
                  setIsOldAccOpen(false);
                  deleteSub({
                     period_id: activeSub.id,
                     basket_id: basketId,
                     game: activeSub,
                  })
               }}
            >
               <div className={`xs-info ${cls.accModalCont}`}>
                  <h3
                     style={{ textWrap: 'balance', fontSize: '1.2rem' }}
                     className="xs-title section-title"
                  >
                     На эту учетную запись вы хотите совершить покупку?
                  </h3>
                  <hr className={cls.hr} />
                  <NewAccIcon width={85} height={85} />

                  <div style={{ width: '100%' }}>
                     <h4>Учетная запись Microsoft:</h4>
                     <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <EmailIcon width={18} height={18} />
                        <p>Логин: {user?.microsoft_account?.login}</p>
                     </div>
                     <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <PasswordIcon width={18} height={18} />
                        <p>Пароль: **********</p>
                     </div>
                  </div>

                  <div className={cls.modalButtons}>
                     <Button
                        onClick={() => {
                           setIsOldAccOpen(false);
                           setBasketBottomSheet(true);
                        }}
                     >
                        Этот аккаунт
                     </Button>
                     <Button
                        onClick={() => {
                           setIsOldAccOpen(false);
                           setIsAfterQuestion(true);
                           setMicrosoftModalIsOpen(true);
                        }}
                     >
                        Указать другой
                     </Button>
                  </div>
               </div>
            </NewAccModal>

            <NewAccModal
               className={cls.accModal}
               isOpen={microsoftModalIsOpen}
               setIsOpen={() => {
                  setMicrosoftModalIsOpen(false);
                  deleteSub({
                     period_id: activeSub.id,
                     basket_id: basketId,
                     game: activeSub,
                  });
               }}
            >
               <div className={`xs-info ${cls.accModalCont}`}>
                  <h3
                     style={{ textWrap: 'balance', fontSize: '1.2rem' }}
                     className="xs-title section-title"
                  >
                     {isOldAcc && !isAfterQuestion ? 'Ваша учетная запись не найдена!' : 'Учетная запись Microsoft'}
                  </h3>
                  <hr className={cls.hr} />
                  <NewAccIcon width={82} height={82} />

                  <p style={{ textAlign: 'center', fontSize: '0.9rem' }} className={cls.warning}>
                     {isOldAcc ? '👨‍💻 Пожалуйста, укажите учетную запись, на которую будет приобретена подписка.' : '👨‍💻 Пожалуйста, укажите новую учетную запись, на которой никогда не было подписки. На этот аккаунт будет приобретена подписка!'}
                  </p>

                  <form
                     onSubmit={handleSaveMicrosoft}
                     className={cls.inputs}
                  >
                     <label>
                        <div className={cls.inputLabel}>
                           <EmailIcon width={18} height={18} />
                           <p>Логин:</p>
                        </div>
                        <input
                           type="text"
                           value={login}
                           className={cls.input}
                           placeholder='example@gmail.com'
                           onChange={e => setLogin(e.target.value)}
                        />
                        {loginError && <span className={cls.error}>{loginError}</span>}
                     </label>
                     <label>
                        <div className={cls.inputLabel}>
                           <PasswordIcon width={18} height={18} />
                           <p>Пароль:</p>
                        </div>
                        <input
                           type="text"
                           value={password}
                           className={cls.input}
                           placeholder='XboxRent_bot'
                           onChange={e => setPassword(e.target.value)}
                        />
                        {passwordError && <span className={cls.error}>{passwordError}</span>}
                     </label>

                     {isConfirmed && (
                        <p style={{ fontSize: '0.8rem', marginTop: -3 }} className={cls.warning}>
                           ⚠️ Пожалуйста, удостоверьтесь в правильности введенных вами данных и нажмите &quot;Сохранить&quot;
                        </p>
                     )}

                     <div style={{ marginTop: 0 }} className={cls.modalButtons}>
                        <Button type="submit">
                           {isConfirmed ? 'Сохранить' : 'Далее'}
                        </Button>
                        <Button
                           type="button"
                           onClick={handleCloseMicrosoftModal}
                        >
                           Отмена
                        </Button>
                     </div>
                  </form>

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

                     {user?.game_pass_subscribe?.status ? (
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
                              <Button onClick={() => handleOpenModal(gamePassData)}>
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
               className={cls.eaSub}
            />
            <div style={{ background: `url(${rentSubsData.results[0].image})` }} className={cls.rentSubs}>
               <div className={cls.bgBlur} />
               <div style={{ zIndex: 100, position: 'relative' }}>
                  <SectionWithSlide
                     sub="rent"
                     sectionTitle="Подписки аренды"
                     slides={rentSubsData.results.map(game => ({
                        id: game.id,
                        title: game.title,
                        description: game.description,
                        price: game.price,
                        subprice: game.subprice,
                        image: game.image,
                        wallpaper: game.wallpaper,
                        games_list_enabled: false,
                        types: [],
                     }))}
                  />
               </div>
            </div>
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
