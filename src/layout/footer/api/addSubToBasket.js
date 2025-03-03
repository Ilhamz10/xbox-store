export async function addSubToBasket({ period_id, basket_id }) {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/basket/add_sub/`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				basket_id,
            period_id,
			}),
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}