export const subsSlice = (set) => ({
	mainSubBottomSheetIsOpen: false,
	otherSubBottomSheetIsOpen: false,
	mainSubscription: {},
	activeSub: {},
	setActiveSub: obj => set(() => ({ activeSub: obj })),
	setMainSubBottomSheetIsOpen: bool => set(() => ({ mainSubBottomSheetIsOpen: bool })),
	setMainSubscription: obj => set(() => ({ mainSubscription: obj })),
	setOtherSubBottomSheetIsOpen: bool => set(() => ({ mainSubBottomSheetIsOpen: bool })),
});
