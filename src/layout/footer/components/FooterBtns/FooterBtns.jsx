import { motion } from 'framer-motion';
import cls from './FooterBtns.module.css';
import { useStore } from '../../../../store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutBasket } from '../../api/checkoutBasket';
import WebApp from '@twa-dev/sdk';
import { addGameToBasket } from '../../api/addGameToBasket';

const footerBtnsVariants = {
	up: {
		transform: 'translateY(-110%)',
	},
	down: {
		transform: 'translateY(140%)',
	},
};

export const FooterBtns = () => {
	const queryClient = useQueryClient();
	const {
		basketBottomSheet,
		productAddToCardIsVisiible,
		basketId,
		activeGame,
		gameInfoBottomSheetIsOpen,
		basketGamesId,
		isFromHomeSale
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

	const gameInBasket = basketGamesId.includes(activeGame?.id);

	function handleAddGameToBasket() {
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
					productAddToCardIsVisiible &&
					!basketBottomSheet &&
					gameInfoBottomSheetIsOpen
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
