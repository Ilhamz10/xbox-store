import { useStore } from '../../store';
// import { useRef } from 'react';
import { CustomBottomSheet } from '../../UI/BottomSheet/BottomSheet';
import cls from './CategoryBottomSheet.module.css';
import GamesFilteredBycategory from '../GamesFilteredBycategory/GamesFilteredBycategory';

export const CategoryBottomSheet = ({ adjustPosition }) => {
	const {
		categoryBottomSheetIsOpen,
		setCategoryBottomSheetIsOpen,
		setVoiceActing,
		categoryBottomSheetObj,
		setCategoryBottomSheetObj,
		setActiveSeries,
		activeSeries
	} = useStore((state) => state);

	function handleCloseCategoryBottomSheet(isOpen) {
		setCategoryBottomSheetIsOpen(isOpen);
		setActiveSeries({});
		setCategoryBottomSheetObj({});
		setVoiceActing('');
	}

	return (
		<CustomBottomSheet
			adjustPosition={adjustPosition}
			isOpen={categoryBottomSheetIsOpen}
			setIsopen={handleCloseCategoryBottomSheet}
		>
			<div style={{ marginTop: 0 }} className={cls.sectionHeader}>
				<h2
					style={{ fontWeight: 500 }}
					className='section-title'>
					{categoryBottomSheetObj.icon}
					{categoryBottomSheetObj.name || activeSeries.name}
				</h2>
			</div>
			<GamesFilteredBycategory inBottomSheet={true} />
		</CustomBottomSheet>
	);
};
