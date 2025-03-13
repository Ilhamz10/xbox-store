import { createPortal } from 'react-dom';
import cls from './modal.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../../store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addGameToBasket } from '../../layout/footer/api/addGameToBasket';
import Button from '../Button/Button';

export const Modal = ({
   children,
   isOpen,
   setIsopen,
   className,
   isGamePass,
   setIsGamePass,
}) => {
   const queryClient = useQueryClient();
   const { isNewAcc, basketId, basketGamesId } = useStore(state => state);

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

   const serviceInBasket = basketGamesId.includes(299);

   const handleClose = () => {
      setIsopen(false);
      setIsGamePass(false);
   };

   const handleCreateNewAcc = () => {
      if (!serviceInBasket) {
         mutate({
            product_id: 299,
            basket_id: basketId,
            game: { id: 299 },
         });
      }

      setIsopen(false);
   };

   const variants = [
      {
         initial: {
            translateY: '120%',
            translateX: '-50%',
         },
         exit: {
            translateY: '120%',
            translateX: '-50%',
         },
         animate: {
            translateY: '0%',
            translateX: '-50%',
         },
      },
      {
         initial: {
            opacity: 0,
         },
         exit: {
            opacity: 0,
         },
         animate: {
            opacity: 1,
         },
      },
   ];

   return createPortal(
      <>
         <AnimatePresence>
            {isOpen && (
               <>
                  <motion.div
                     initial={{ opacity: 0 }}
                     exit={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className={`${cls.backdrop}`}
                     onClick={handleClose}
                  />
                  <motion.div
                     variants={isNewAcc ? variants[1] : variants[0]}
                     transition={{ ease: 'linear', duration: 0.25 }}
                     initial={isNewAcc ? variants[1].initial : variants[0].initial}
                     exit={isNewAcc ? variants[1].exit : variants[0].exit}
                     animate={isNewAcc ? variants[1].animate : variants[0].animate}
                     className={`wrapper ${cls.modal} ${
                        isNewAcc && cls.newAccModal
                     } ${className}`}>
                     {!isNewAcc && children}
                     {isNewAcc ? (
                        <div className="xs-info">
                           {children}

                           <div className={cls.modalButtons}>
                              <Button onClick={handleCreateNewAcc}>Создать</Button>
                              <Button onClick={handleClose}>Я сам создам</Button>
                           </div>
                        </div>
                     ) : (
                        <>
                           {isGamePass && (
                              <Link
                                 to="/subscriptions"
                                 style={{
                                    display: 'inline-block',
                                    textAlign: 'center',
                                 }}
                                 className={cls.closeModalBtn}
                                 onClick={handleClose}>
                                 Купить подписку
                              </Link>
                           )}
                           <button
                              onClick={handleClose}
                              className={cls.closeModalBtn}>
                              Закрыть
                           </button>
                        </>
                     )}
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </>,
      document.getElementById('modal'),
   );
};
