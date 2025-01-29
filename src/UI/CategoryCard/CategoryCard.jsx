/* eslint-disable react-refresh/only-export-components */
import cls from './CategoryCard.module.css';
import { forwardRef, memo } from 'react';
import { num_word } from '../../helpers';

const CategoryCard = ({ imgSrc, category, count = 0, ...props }, ref) => {
	return (
		<button ref={ref} className={cls.categoryCard} {...props}>
			<img src={imgSrc} alt={category} />
			<div className={cls.text}>
				<div className={cls.count}>
					<p>
						{count} {num_word(count, ['товар', 'товара', 'товаров'])}
					</p>
				</div>
				<p>{category}</p>
			</div>
		</button>
	);
};

export default memo(forwardRef(CategoryCard));
