import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeSubFromBasket } from '../layout/footer/api/removeSubFromBasket'

export const useDeleteSub = () => {
   const queryClient = useQueryClient();

   return useMutation({
		mutationFn: removeSubFromBasket,
		onMutate: async ({ period_id, game }) => {
			await queryClient.cancelQueries({ queryKey: ['create-basket'] });
			const previousBasket = queryClient.getQueryData(['create-basket']);

			queryClient.setQueryData(['create-basket'], (old) => ({
				...old,
				amount: old.amount - +game.price,
				subs: old.subs.filter((oldGame) => oldGame.id !== period_id),
				current_item_ids: old.current_item_ids.filter(
					(itemId) => itemId !== period_id
				),
			}));

			return { previousBasket };
		},
		onError: (_, __, context) => {
			queryClient.setQueryData(['create-basket'], context.previousBasket);
		},
		onSettled: () => {
			queryClient.invalidateQueries(['create-basket']);
		},
	});
}