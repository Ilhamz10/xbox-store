export async function getPopularGames(dateFilter) {
	const response = await fetch(
		`${
			import.meta.env.VITE_API_URL
		}/catalog/top-popular?period=${dateFilter}&limit=10&type=rent`
	);
	const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}
