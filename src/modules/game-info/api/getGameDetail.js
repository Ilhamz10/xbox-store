export async function getGameDetail(id, isSaleUrl) {
	const url = isSaleUrl ? `${import.meta.env.VITE_API_SALE_URL}/game_id/${id}` : `${import.meta.env.VITE_API_URL}/products/${id}`;

   const response = await fetch(url)

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	const result = await response.json();

	return result;
}