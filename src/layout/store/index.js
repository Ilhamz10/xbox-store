export const layoutSlice = set => ({
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
   queriesCompleted: 0,
   isGamePass: false,
   activeModalText: '',
   isFromHomeSale: false,
   XsTitle: 'Подсказка',
   setActiveModalText: str => set(() => ({ activeModalText: str })),
   setCategoriesHeight: height => set(() => ({ categoriesHeight: height })),
   setLoading: value => value ? set(() => ({ loading: true })) : setTimeout(() => set(() => ({ loading: false })), 300),
   setIsFromHomeSale: val => set(() => ({ isFromHomeSale: val })),
   setXsText: text => set(() => ({ XsText: text })),
   setXsTitle: title => set(() => ({ XsTitle: title })),
   setIsGamePass: val => set(() => ({ isGamePass: val })),
   changeXsIsOpen: bool => set(() => ({ XsIsOpen: bool })),
   closeXsIsOpen: () => set(() => ({ XsIsOpen: false })),
   setQueriesCompleted: count => set(st => ({ queriesCompleted: (count || st.queriesCompleted + 1) })),
   setCategoryBottomSheetIsOpen: bool =>
      set(() => ({ categoryBottomSheetIsOpen: bool })),
   setGameInfoBottomSheetIsOpen: bool =>
      set(() => ({ gameInfoBottomSheetIsOpen: bool })),
   setSearchBottomSheetIsOpen: bool =>
      set(() => ({ searchBottomSheetIsOpen: bool })),
   setBasketBottomSheet: bool => set(() => ({ basketBottomSheet: bool })),
   setXsGameName: name => set(() => ({ XsGameName: name })),
   setProductAddToCardIsVisiible: bool =>
      set(() => ({ productAddToCardIsVisiible: bool })),
   setCountButtonUpIsShown: bool => set(() => ({ countButtonUpIsShown: bool })),
});
