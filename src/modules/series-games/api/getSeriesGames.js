export async function getSeriesGames() {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/game_series/?limit=20&type=rent`
	);
	const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}