export async function getRecommendedGame() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/on_sale_game?type=rent`);

    const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}