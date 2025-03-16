export const saveDate = async ({ id, token, ...data }) => {
   const response = await fetch(`${import.meta.env.VITE_API_URL}/clients/${id}/`, {
      method: 'POST',
      body: JSON.stringify({ game_pass_subscribe: data }),
      headers: {
         'x-client-hash': token,
         'Content-Type': 'application/json',
      },
   });

   const result = await response.json();

	if (!response.ok) {
		throw new Error('Something went wrong!');
	}

	return result;
}