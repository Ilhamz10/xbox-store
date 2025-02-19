export const filterSlice = (set) => ({
	dateFilter: { filter: 'month', text: 'За месяц' },
	voiceActing: '',
	title: '',
	setVoiceActing: (lang) => set(() => ({ voiceActing: lang })),
	setDateFilter: (date) =>
		set(() => ({ dateFilter: { filter: date.filter, text: date.text } })),
	setTitle: (title) => set(() => ({ title })),
});
