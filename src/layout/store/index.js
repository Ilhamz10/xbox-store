export const layoutSlice = (set) => ({
	categoriesHeight: undefined,
	loading: true,
	XsIsOpen: false,
	categoryBottomSheetIsOpen: false,
	gameInfoBottomSheetIsOpen: false,
	searchBottomSheetIsOpen: false,
	basketBottomSheet: false,
	XsGameName: '',
	productAddToCardIsVisiible: false,
	countButtonUpIsShown: false,
	XsText: '',
	isGamePass: false,
	XsTitle: 'Подсказка',
	setCategoriesHeight: (height) => set(() => ({ categoriesHeight: height })),
	setLoading: (value) => set(() => ({ loading: value })),
	setXsText: (text) => set(() => ({ XsText: text })),
	setXsTitle: (title) => set(() => ({ XsTitle: title })),
	setIsGamePass: (val) => set(() => ({ isGamePass: val })),
	changeXsIsOpen: (bool) => set(() => ({ XsIsOpen: bool })),
	closeXsIsOpen: () => set(() => ({ XsIsOpen: false })),
	setCategoryBottomSheetIsOpen: (bool) =>
		set(() => ({ categoryBottomSheetIsOpen: bool })),
	setGameInfoBottomSheetIsOpen: (bool) =>
		set(() => ({ gameInfoBottomSheetIsOpen: bool })),
	setSearchBottomSheetIsOpen: (bool) =>
		set(() => ({ searchBottomSheetIsOpen: bool })),
	setBasketBottomSheet: (bool) => set(() => ({ basketBottomSheet: bool })),
	setXsGameName: (name) => set(() => ({ XsGameName: name })),
	setProductAddToCardIsVisiible: (bool) =>
		set(() => ({ productAddToCardIsVisiible: bool })),
	setCountButtonUpIsShown: (bool) =>
		set(() => ({ countButtonUpIsShown: bool })),
});
