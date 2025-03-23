export const getSaleGames = async (page) => {
   const res = await fetch(import.meta.env.VITE_API_SALE_URL + `/games/sales?limit=15&offset=${page}`);

   if (!res.ok) throw new Error("Something went wrong");

   const data = await res.json();

   return data;
}