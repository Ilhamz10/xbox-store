export async function getRentSubs() {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/catalog?type=subscribe`);
   
	if (!response.ok) {
      throw new Error('Something went wrong!');
	}

   const result = await response.json();

	return result;
}
