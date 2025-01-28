export async function getGamesSeries(serieId) {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/catalog/?series=${serieId}&limit=30`
	);
	const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}
