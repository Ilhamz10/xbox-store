import { create } from 'zustand';
import { counterSlice } from '../modules/AllGames/store';
import { basketSlice } from '../modules/BasketCard/store/basket-slice';
import { layoutSlice } from '../layout/store';
import { filterSlice } from '../filters/filters-slice';
import { userSlice } from './userSlice';
import { subsSlice } from '../pages/subscriptions/store/subsSlice';

export const useStore = create((...a) => ({
	...counterSlice(...a),
	...basketSlice(...a),
	...layoutSlice(...a),
	...filterSlice(...a),
	...userSlice(...a),
	...subsSlice(...a),
}));
