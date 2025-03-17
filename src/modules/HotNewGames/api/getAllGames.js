export async function getAllGames() {
	const response = await fetch(
		`${
			import.meta.env.VITE_API_URL
		}/catalog?type=rent`
	);
	const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}
