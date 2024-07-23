import cls from './GameCard.module.css';

const GameCard = ({ imgSrc, gameTitle, gamePrice, gameDiscountPrice, preOrder=false }) => {
	return (
		<div className={cls.gameCard}>
			<div className={cls.imgWrapper}>
				<img src={imgSrc} alt='' loading='lazy' />
				{preOrder && <p className={cls.banner}>Предзаказ</p>}
			</div>
			<div className={cls.gameInfo}>
				<h2 className={cls.gameTitle}>{gameTitle}</h2>
				<div className={cls.gamePriceCont}>
					{gameDiscountPrice && (
						<div className={cls.discount}>{gameDiscountPrice} ₽</div>
					)}
					<p className={cls.price}>{gamePrice} ₽</p>
				</div>
			</div>
		</div>
	);
};

export default GameCard;
