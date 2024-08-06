import cls from './basket-game-card.module.css';
import { DeleteIcon } from '../../../../assets';
import { useStore } from '../../../../store';

export const BasketGameCard = ({ game, className }) => {
	const {
		deleteGameFromBasket,
		games: basketGames,
		setBasketBottomSheet,
	} = useStore((state) => state);

	function handleDeleteGameFromBasket(game) {
		deleteGameFromBasket(game);

		if (basketGames.length === 1) {
			setBasketBottomSheet(false);
		}
	}

	return (
		<div className={`${cls.BasketGameCard} ${className}`}>
			<img className={cls.gameImg} src={game.imgSrc} alt='' />
			<div className={cls.gameInfo}>
				<div className={cls.gameText}>
					<h3 className={cls.gameTitle}>{game.gameTitle}</h3>
					<div className={cls.gamePriceCont}>
						{game.gameDiscountPrice && (
							<p className={cls.discount}>{game.gameDiscountPrice} ₽</p>
						)}
						<p className={cls.price}>{game.gamePrice} ₽</p>
					</div>
				</div>
				<button
					className={cls.deleteBtn}
					onClick={() => handleDeleteGameFromBasket(game)}>
					<DeleteIcon width={16} height={16} />
				</button>
			</div>
		</div>
	);
};
