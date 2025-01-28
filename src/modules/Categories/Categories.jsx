import { memo, useEffect, useRef, useState } from 'react';
import CategoryCard from '../../UI/CategoryCard/CategoryCard';
import { motion } from 'framer-motion';

import cls from './Categories.module.css';
import DropdownArrow from '../../assets/icons/dropdown-arrows-icon.svg?react';
import CategoriesIcon from '../../layout/footer/assets/icons/catalog-icon.svg?react';
import { useStore } from '../../store';
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from './api/getAllCategories';

const CategoryFilter = memo(function CategoryFilter() {
	const {
		setCategoryBottomSheetIsOpen,
		setActiveCategory,
		categoriesHeight,
		setCategoriesHeight,
	} = useStore((state) => state);
	const [isOpen, setIsOpen] = useState(false);
	const [categoriesContVariants, setCategoriesContVariants] = useState();
	const categoryCardRef = useRef(null);
	const content = useRef(null);

	const { data, isLoading, isSuccess, isError } = useQuery({
		queryKey: ['all-categories'],
		queryFn: getAllCategories,
	});

	useEffect(() => {
		if (!categoriesHeight) {
			const height =
				categoryCardRef.current?.offsetHeight +
				categoryCardRef.current?.offsetHeight / 2;

			setCategoriesHeight(height);
		}
	}, [setCategoriesHeight, categoriesHeight]);

	useEffect(() => {
		const height =
			categoryCardRef.current?.offsetHeight +
			categoryCardRef.current?.offsetHeight / 2;

		setCategoriesContVariants({
			open: {
				height: 'auto',
			},
			close: {
				height: `${height}px`,
			},
		});
	}, [data]);

	function handleSelectCategory(id, name) {
		setActiveCategory(id, name);
		setCategoryBottomSheetIsOpen(true);
	}

	if (isSuccess) {
		content.current = data.results.map((category) => (
			<CategoryCard
				key={category.id}
				ref={categoryCardRef}
				imgSrc={category.image}
				category={category.name}
				count={category.product_count}
				onClick={() => handleSelectCategory(category.id, category.name)}
			/>
		));
	}

	if (isLoading) {
		content.current = <p>Loading...</p>;
	}

	if (isError) {
		content.current = <p>There is some error...</p>;
	}

	return (
		<section>
			<div className='wrapper section-header' style={{ marginBottom: '5px' }}>
				<h3 className='section-title'>
					<CategoriesIcon />
					Категории
				</h3>
			</div>
			<div className={`${cls.categoryFilter}`}>
				<motion.div
					animate={isOpen ? 'open' : 'close'}
					variants={categoriesContVariants}
					className={cls.categoryFilterCards}
					style={{
						height: categoriesHeight ? `${categoriesHeight}px` : '130px',
					}}>
					{content.current}
					<div className={cls.shadow} />
				</motion.div>
				<button
					className={`${cls.dropdownButton} ${isOpen ? cls.open : ''}`}
					onClick={() => setIsOpen((prev) => !prev)}>
					<DropdownArrow className='dropdown-icon' width={16} height={16} />
					Показать {isOpen ? 'меньше' : 'больше'}
				</button>
			</div>
		</section>
	);
});

export default CategoryFilter;
