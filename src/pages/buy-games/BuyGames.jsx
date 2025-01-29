import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store';

import cls from './style.module.css';
import { useMutation } from '@tanstack/react-query';
import SwitchBtn from '../../UI/SwitchBtn/SwitchBtn';
import { searchGames } from '../../modules/HotNewGames/api/searchGames';
import { SearchInput } from '../../modules/HotNewGames/UI';
import SaleGamesPage from './pages/SaleGamesPage/SaleGamesPage';
import AllGamesPage from './pages/AllGamesPage/AllGamesPage';

const BuyGames = () => {
	const { setSearchBottomSheetIsOpen } = useStore((state) => state);
	const [searchIsActive, setSearchIsActive] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const searchInputRef = useRef(null);
	const [selectedTab, setSelectedTab] = useState('sale');

	const {
		mutate,
		// data: searchedGames
	} = useMutation({
		mutationFn: searchGames,
	});

	function handleSearch(e) {
		e.preventDefault();
		mutate({ search: searchValue });
		setSearchBottomSheetIsOpen(true);
		searchInputRef.current.blur();
		setSearchValue('');
		setSearchIsActive(false);
	}

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				searchInputRef.current &&
				!searchInputRef.current.contains(event.target)
			) {
				setSearchIsActive(false);
				setSearchValue('');
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<section style={{ padding: '20px 0 28px' }}>
			<div className='wrapper'>
				<form className={cls.titleCont} onSubmit={handleSearch}>
					<h3
						className={`${cls.categoryTitle} ${
							!searchIsActive ? cls.active : ''
						}`}>
						Покупки игр
					</h3>
					<SearchInput
						ref={searchInputRef}
						searchIsActive={searchIsActive}
						onFocus={(e) => {
							if (!searchIsActive) {
								e.currentTarget.blur();
							}
							setSearchIsActive(true);
						}}
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</form>
				<div style={{ marginTop: '15px' }}>
					<SwitchBtn
						selectedTab={selectedTab}
						setSelectedTab={setSelectedTab}
					/>
				</div>
			</div>
			{selectedTab === 'sale' ? <SaleGamesPage /> : <AllGamesPage />}
		</section>
	);
};

export default BuyGames;
