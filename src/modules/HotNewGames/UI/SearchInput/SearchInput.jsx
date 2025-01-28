import { motion } from 'framer-motion';
import SearchIcon from '../../../../assets/icons/search-icon.svg?react';

import cls from './SearchInput.module.css';
import { forwardRef } from 'react';

const searchInputVariants = {
	open: {
		width: '100%',
	},
	close: {
		width: 'min-content',
	},
};

export const SearchInput = forwardRef(function SearchInput(
	{ searchIsActive, ...props },
	ref
) {
	return (
		<motion.div
			initial={'close'}
			animate={searchIsActive ? 'open' : 'close'}
			variants={searchInputVariants}
			className={cls.inputCont}>
			<label htmlFor='search'>
				<SearchIcon width={18} height={18} />
			</label>
			<input
				ref={ref}
				id='search'
				placeholder='Какую игру будем искать?'
				type='text'
				{...props}
			/>
		</motion.div>
	);
});
