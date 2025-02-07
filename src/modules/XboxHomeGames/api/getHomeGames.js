export async function getHomeGames() {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/catalog/?is_home_sale=true&limit=12`
	);
	const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}
