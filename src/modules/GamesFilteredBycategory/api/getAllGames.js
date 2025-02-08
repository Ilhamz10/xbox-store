export async function getFilteredGames(categoryId, serieId, voiceActing, gamepass, page) {
	let queries = '';

	queries += categoryId
		? `categories=${categoryId}`
		: serieId
		? `series=${serieId}`
		: gamepass
		? `gamepass=true`
		: '';

	const response = await fetch(
		`${
			import.meta.env.VITE_API_URL
		}/catalog/?${queries}&voice_acting=${voiceActing}&limit=20&offset=${
			(page - 1) * 20
		}`
	);
	const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}
