import { motion } from 'framer-motion';
import cls from './FooterBtns.module.css';
import { useStore } from '../../../../store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutBasket } from '../../api/checkoutBasket';
import WebApp from '@twa-dev/sdk';
import { addGameToBasket } from '../../api/addGameToBasket';
import { addSubToBasket } from '../../api/addSubToBasket';
import { toast } from 'react-toastify'

const footerBtnsVariants = {
	up: {
		transform: 'translateY(-110%)',
	},
	down: {
		transform: 'translateY(140%)',
	},
};

const UNIQ_TOAST_ID = "uniqToastId";

export const FooterBtns = () => {
	const queryClient = useQueryClient();
	const {
		basketBottomSheet,
		productAddToCardIsVisiible,
		basketId,
		activeGame,
		gameInfoBottomSheetIsOpen,
		basketGamesId,
		isFromHomeSale,
		mainSubBottomSheetIsOpen,
		activeSub,
		parentSubsIds,
		isNewAcc,
		setXsTitle,
		setXsText,
		setIsGamePass,
		changeXsIsOpen,
	} = useStore((state) => state);

	const { mutate } = useMutation({
		mutationFn: checkoutBasket,
		onSuccess: () => {
			WebApp.close();
		},
	});

	const { mutate: addGameToBasketMutate } = useMutation({
		mutationFn: addGameToBasket,
		onMutate: async ({ product_id, game }) => {
			await queryClient.cancelQueries({ queryKey: ['create-basket'] });

			const previousBasket = queryClient.getQueryData(['create-basket']);

			queryClient.setQueryData(['create-basket'], (old) => ({
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

	const { mutate: addSubToBasketMutate } = useMutation({
		mutationFn: addSubToBasket,
		onMutate: async ({ period_id }) => {
			await queryClient.cancelQueries({ queryKey: ['create-basket'] });
			const previousBasket = queryClient.getQueryData(['create-basket']);

			queryClient.setQueryData(['create-basket'], (old) => {
				const newBasket = {
					...old,
					current_item_ids: [...old.current_item_ids, period_id],
					items: [...old.items]
				};

				if (!parentSubsIds.includes(activeSub.parent_id)) 
					newBasket.items.push(activeSub);

				return newBasket;
			});

			return { previousBasket };
		},
		onError: (_, __, context) => {
			queryClient.setQueryData(['create-basket'], context.previousBasket);
		},
		onSettled: () => {
			queryClient.invalidateQueries(['create-basket']);
		},
	});

	const serviceInBasket = basketGamesId.includes(299);
	const gameInBasket = basketGamesId.includes(mainSubBottomSheetIsOpen ? activeSub.id : activeGame?.id);

	function handleAddGameToBasket() {
		if (isNewAcc && !gameInBasket && !serviceInBasket) {
			setXsTitle('Дополнительная услуга');
			setXsText('Создать новую учетную запись Xbox за вас?');
			setIsGamePass(false);
			changeXsIsOpen(true);
		}

		if (mainSubBottomSheetIsOpen && !gameInBasket) {
			WebApp.HapticFeedback.impactOccurred('light');

			if (toast.isActive(UNIQ_TOAST_ID))
				toast.update(UNIQ_TOAST_ID);
			else if (parentSubsIds.includes(activeSub.parent_id))
				toast.success('Подписка заменена!',  { autoClose: 2300, toastId: UNIQ_TOAST_ID });


			addSubToBasketMutate({
				basket_id: basketId,
				period_id: activeSub.id
			});
			return;
		}

		if (!gameInBasket) {
			WebApp.HapticFeedback.impactOccurred('light');
			addGameToBasketMutate({
				product_id: activeGame.id,
				basket_id: basketId,
				game: activeGame,
				is_home_sale: isFromHomeSale
			});
		}
	}

	function handleCheckout() {
		mutate({
			telegramId: WebApp?.initDataUnsafe?.user?.id,
			basket_id: basketId,
		});
	}

	return (
		<>
			<motion.div
				initial={{ transform: 'translateY(-110%)' }}
				animate={
					(productAddToCardIsVisiible &&
					!basketBottomSheet &&
					gameInfoBottomSheetIsOpen) ||
					(mainSubBottomSheetIsOpen
						&& activeSub.duration_months)
						? 'up'
						: 'down'
				}
				variants={footerBtnsVariants}
				className={cls.footerBtns}>
				<button onClick={handleAddGameToBasket} className={cls.addToCart}>
					{gameInBasket ? 'Добавлено' : 'Добавить в корзину'}
				</button>
				{/* <button className={cls.likeBtn}>
					<HeartIcon width={20} height={20} />
				</button> */}
			</motion.div>
			<motion.div
				initial={{ transform: 'translateY(-110%)' }}
				animate={basketBottomSheet ? 'up' : 'down'}
				transition={{ type: 'just' }}
				variants={footerBtnsVariants}
				className={cls.footerBtns}>
				<button className={cls.addToCart} onClick={handleCheckout}>
					Перейти к оформлению
				</button>
			</motion.div>
		</>
	);
};
