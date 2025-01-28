import { useEffect, useRef, useState } from 'react';
import gifLoading from '../../assets/gifs/video-ezgif.com-gif-maker.gif';
import { SearchInput } from '../../modules/HotNewGames/UI';
import SwitchBtn from '../../UI/SwitchBtn/SwitchBtn';
import { useStore } from '../../store';
import { searchGames } from '../../modules/HotNewGames/api/searchGames';
import { useMutation } from '@tanstack/react-query';
import cls from './style.module.css';

const WorkInProgress = ({ title }) => {
	const { setSearchBottomSheetIsOpen } = useStore((state) => state);
	const [searchIsActive, setSearchIsActive] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const searchInputRef = useRef(null);

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

	// function handleClose(isOpen) {
	// 	setSearchBottomSheetIsOpen(isOpen);
	// }

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
		<section style={{ padding: '20px 0 28px' }} className='wrapper'>
			<form className={cls.titleCont} onSubmit={handleSearch}>
				<h3
					className={`${cls.categoryTitle} ${
						!searchIsActive ? cls.active : ''
					}`}>
					{title}
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
			{title === 'Покупки игр' && (
				<div style={{ marginTop: '15px' }}>
					<SwitchBtn />
				</div>
			)}
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '45%',
					transform: 'translate(-50%,-50%)',
				}}>
				<img
					style={{ width: '50px', margin: '0 auto' }}
					src={gifLoading}
					alt=''
				/>
				<h3 style={{ paddingTop: '10px', fontWeight: '400' }}>
					В разработке..
				</h3>
			</div>
		</section>
	);
};

export default WorkInProgress;
