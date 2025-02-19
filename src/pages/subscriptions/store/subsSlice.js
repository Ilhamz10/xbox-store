export const subsSlice = (set) => ({
	gamePassBottomSheetIsOpen: false,
	gamePassSubscription: {},
	setGamePassBottomSheetIsOpen: (bool) => set(() => ({ gamePassBottomSheetIsOpen: bool })),
	setGamePassSubscription: obj => set(() => ({ gamePassSubscription: obj })),
});
