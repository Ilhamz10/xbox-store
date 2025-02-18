import cls from './basket-game-card.module.css';
import { BasketIcon, DeleteIcon } from '../../../../assets';
import { useStore } from '../../../../store';
import WebApp from '@twa-dev/sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addGameToBasket } from '../../../../layout/footer/api/addGameToBasket';
import { removeGameFromBasket } from '../../../../layout/footer/api/removeGameFromBasket';
import { removeSubFromBasket } from '../../../../layout/footer/api/removeSubFromBasket';
import { Icon } from '@iconify/react/dist/iconify.js';

const gameType = {
	subs: 'Подписки',
	rent: 'Аренда',
	home: 'Домашка'
}

export const BasketGameCard = ({
	game,
	className,
	recommendation,
	inBasket,
	onClick,
}) => {
	const queryClient = useQueryClient();
	const { basketGamesCount, setBasketBottomSheet, basketId } = useStore(
		(state) => state
	);
	const { mutate: addGameToBasketMutate } = useMutation({
		mutationFn: addGameToBasket,
		onMutate: async ({ product_id, game }) => {
			await queryClient.cancelQueries({ queryKey: ['create-basket'] });

			const previousBasket = queryClient.getQueryData(['create-basket']);

			queryClient.setQueryData(['create-basket'], (old) => ({
				...old,
				amount: old.amount + +game.price,
				items: [...old.items, { ...game, subprice: undefined }],
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
	const { mutate: removeGameFromBasketMutate } = useMutation({
		mutationFn: removeGameFromBasket,
		onMutate: async ({ product_id, game }) => {
			await queryClient.cancelQueries({ queryKey: ['create-basket'] });

			const previousBasket = queryClient.getQueryData(['create-basket']);

			queryClient.setQueryData(['create-basket'], (old) => ({
				...old,
				amount: old.amount - +game.price,
				items: [...old.items].filter((oldGame) => oldGame.id !== product_id),
				current_item_ids: old.current_item_ids.filter(
					(itemId) => itemId !== product_id
				),
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

	const { mutate: removeSubFromBasketMutate } = useMutation({
		mutationFn: removeSubFromBasket,
		onSuccess: () => {
			queryClient.invalidateQueries('create-basket');
		},
	});

	function handleDeleteGameFromBasket(game) {
		if (game.type === 'sub') {
			removeSubFromBasketMutate({
				period_id: game.id,
				basket_id: basketId,
			});
		} else {
			removeGameFromBasketMutate({
				product_id: game.id,
				basket_id: basketId,
				game,
			});
		}

		if (basketGamesCount === 1) {
			setBasketBottomSheet(false);
		}
	}

	function handleAddGameToBasket() {
		WebApp.HapticFeedback.impactOccurred('light');
		addGameToBasketMutate({
			product_id: game.id,
			basket_id: basketId,
			game,
		});
	}

	return (
		<div onClick={onClick} className={`${cls.BasketGameCard} ${className}`}>
			<img className={cls.gameImg} src={game.image} alt='' />
			<div className={cls.gameInfo}>
				<div className={cls.gameText}>
					<h3 className={cls.gameTitle}>
						{game.title}{' '}
						<span className={cls.label}>
							{game.is_home_sale ? gameType['home'] : gameType[game.type]}
						</span>
					</h3>

					<div className={cls.gamePriceCont}>
						{game.subprice && game.subprice !== '0.00' ? (
							<>
								<p className={cls.discount}>{game.price} ₽</p>
								<p className={cls.price}>
									{game.original_price ? game.original_price : game.subprice} ₽
								</p>
							</>
						) : (
							<p className={cls.price}>{game.price} ₽</p>
						)}
					</div>
				</div>
				{!recommendation ? (
					<button
						className={cls.deleteBtn}
						onClick={() => handleDeleteGameFromBasket(game)}>
						<DeleteIcon width={16} height={16} />
					</button>
				) : inBasket ? (
					<button className={`${cls.deleteBtn} ${cls.basketBtn}`}>
						<Icon icon='mdi:success-bold' width='24' height='24' />
					</button>
				) : (
					<button
						className={`${cls.deleteBtn} ${cls.basketBtn}`}
						onClick={() => handleAddGameToBasket(game)}>
						<BasketIcon width={24} height={24} />
					</button>
				)}
			</div>
		</div>
	);
};
