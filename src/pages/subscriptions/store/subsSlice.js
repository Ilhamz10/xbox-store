export const subsSlice = (set) => ({
	gamePassBottomSheetIsOpen: false,
	gamePassSubscription: {},
	activeSub: {},
	setActiveSub: obj => set(() => ({ activeSub: obj })),
	setGamePassBottomSheetIsOpen: (bool) => set(() => ({ gamePassBottomSheetIsOpen: bool })),
	setGamePassSubscription: obj => set(() => ({ gamePassSubscription: obj })),
});
