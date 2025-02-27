import { Icon } from '@iconify/react/dist/iconify.js';
import GamesCont from '../../../../components/GamesCont/GamesCont';
import { CustomBottomSheet } from '../../../../UI/BottomSheet/BottomSheet';
import cls from './SearchBottomSheet.module.css';
import { num_word } from '../../../../helpers'

const SearchBottomSheet = ({ adjustPosition, isOpen, setIsOpen, games }) => {
	return (
		<CustomBottomSheet
			adjustPosition={adjustPosition}
			isOpen={isOpen}
			setIsopen={setIsOpen}
			// bottomSheetHeader={
			// 	<div style={{ marginTop: 0 }} className={cls.sectionHeader}>
			// 		<h2 style={{ fontWeight: 500 }} className='section-title'>
			// 			Результат поиска
			// 		</h2>
			// 	</div>
			// }
			>
			{games ? (
				<>
					<div className={`${cls.head} wrapper`}>
						<h2 className={cls.search}>Поиск</h2>
						<p className={cls.count}>
							Найдено {games.length}{' '}
							{num_word(games.length, ['товар', 'товара', 'товаров'])}
						</p>
					</div>
					<GamesCont games={games} inBottomSheet={true} />
				</>
			) : (
				<Icon
					width={55}
					style={{ display: 'block', margin: 'auto' }}
					icon='eos-icons:three-dots-loading'
				/>
			)}
		</CustomBottomSheet>
	);
};

export default SearchBottomSheet;
