export const userSlice = (set) => ({
	user: {},
	isAdmin: false,
	setUser: obj => set(() => ({ user: obj })),
	setIsAdmin: isAdmin => set(() => ({ isAdmin })),
});
