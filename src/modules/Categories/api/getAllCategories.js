export async function getAllCategories() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/`);

    const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}