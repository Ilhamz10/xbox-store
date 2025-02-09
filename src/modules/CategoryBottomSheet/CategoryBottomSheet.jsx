import { useStore } from '../../store';
// import { useRef } from 'react';
import { CustomBottomSheet } from '../../UI/BottomSheet/BottomSheet';
import cls from './CategoryBottomSheet.module.css';
import GamesFilteredBycategory from '../GamesFilteredBycategory/GamesFilteredBycategory';

export const CategoryBottomSheet = ({ adjustPosition }) => {
	const {
		categoryBottomSheetIsOpen,
		setCategoryBottomSheetIsOpen,
		activeCategory,
		setActiveCategory,
		setActiveSeries,
		setVoiceActing,
		activeSeries,
		activeModalText,
		setActiveModalText
	} = useStore((state) => state);

	function handleCloseCategoryBottomSheet(isOpen) {
		setCategoryBottomSheetIsOpen(isOpen);
		setActiveCategory(null);
		setActiveSeries(null);
		setActiveModalText('');
		setVoiceActing('');
	}

	return (
		<CustomBottomSheet
			adjustPosition={adjustPosition}
			isOpen={categoryBottomSheetIsOpen}
			setIsopen={handleCloseCategoryBottomSheet}
			// bottomSheetHeader={
			// 	<div style={{ marginTop: 0 }} className={cls.sectionHeader}>
			// 		<h2 style={{ fontWeight: 500 }} className='section-title'>
			// 			{activeCategory.name} {activeSeries.name}
			// 		</h2>
			// 	</div>
			// }
		>
			<div style={{ marginTop: 0 }} className={cls.sectionHeader}>
				<h2
					style={{ fontWeight: 500 }}
					className='section-title'>
					{activeModalText !== '' && activeModalText}
					{activeCategory.name} {activeSeries.name}
				</h2>
			</div>
			<GamesFilteredBycategory inBottomSheet={true} />
		</CustomBottomSheet>
	);
};
