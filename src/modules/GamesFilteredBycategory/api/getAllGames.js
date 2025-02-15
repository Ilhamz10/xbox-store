export async function getFilteredGames(categoryId, serieId, voiceActing, gamepass, page) {
	let queries = '';

	queries += categoryId
		? `categories=${categoryId}`
		: serieId
		? `series=${serieId}`
		: voiceActing !== ''
		? `voice_acting=${voiceActing}`
		: gamepass
		? `in_game_pass=${gamepass}`
		: '';

	const response = await fetch(
		`${
			import.meta.env.VITE_API_URL
		}/catalog/?${queries}&limit=20&offset=${
			(page - 1) * 20
		}`
	);
	const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}
