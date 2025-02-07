export const getGamePassGames = async () => {
   const res = await fetch(
		`${import.meta.env.VITE_API_URL}/catalog?in_game_pass=true&limit=12`
   );

   const result = await res.json();

	if (!res.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}