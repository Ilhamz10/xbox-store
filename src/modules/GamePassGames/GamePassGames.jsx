import SectionWithSlide from '../../components/SectionWithSlide/SectionWithSlide';
import { GamePassIcon } from '../../assets';
import { memo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGamePassGames } from './api/getGamePassGames';
import { useStore } from '../../store';

const GamePassGames = memo(function GamePassGames() {
	const content = useRef();
	const { setCategoryBottomSheetIsOpen, setIsGamePass } = useStore((state) => state);
	const copyOfGames = useRef([]);

	const { data, isSuccess, isLoading, isError } = useQuery({
		queryKey: [`get-gamepass-games`],
		queryFn: getGamePassGames,
	});

	function handleOpen() {
		setCategoryBottomSheetIsOpen(true);
		setIsGamePass(true);
	}

	if (isLoading) {
		content.current = <p>Loading...</p>;
	}

	if (isError) {
		content.current = <p>Error</p>;
	}

	useEffect(() => {
		if (isSuccess) {
			copyOfGames.current = [...data.results];
			const randomIndex = Math.floor(
				Math.random() * copyOfGames.current.length
			);

			[copyOfGames.current[0], copyOfGames.current[randomIndex]] = [
				copyOfGames.current[randomIndex],
				copyOfGames.current[0],
			];
		}
	}, [data, isSuccess]);

	if (isSuccess) {
		content.current = (
			<SectionWithSlide
				iconSize={30}
				withAllBtn={true}
				allBtnOnClick={handleOpen}
				sectionTitle={'Игры из Game Pass'}
				slides={copyOfGames.current}
				SectionIcon={GamePassIcon}
			/>
		);
	}

	return (
		<section>
			<div style={{ padding: '1.75rem 0' }}>
				{content.current}
			</div>
		</section>
	);
});

export default GamePassGames;
