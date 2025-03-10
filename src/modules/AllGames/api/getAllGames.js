export async function getAllGames(sortType, page, filterType, limit = 10) {
	let queries = '';

	if (sortType) {
		queries += `ordering=${sortType}&`;
	}

	if(filterType) {
		queries += `${filterType}&`
	}

	const response = await fetch(
		`${
			import.meta.env.VITE_API_URL
		}/catalog/?${queries}limit=${limit}&offset=${(page - 1) * 10}&type=rent`
	);
	const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}
