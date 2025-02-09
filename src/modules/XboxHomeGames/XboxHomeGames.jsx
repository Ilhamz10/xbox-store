import SectionWithSlide from '../../components/SectionWithSlide/SectionWithSlide';
import cls from './XboxHomeGames.module.css';
import { HomeGamesIcon } from '../../assets';
import { memo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHomeGames } from './api/getHomeGames';
import { useStore } from '../../store';
import { getButtonInfoById } from '../../layout/root/api/getButtonInfoById'

const RussianLangGames = memo(function RussianLangGames() {
	const content = useRef();
	const copyOfGames = useRef([]);
	const { setXsTitle, setXsText, changeXsIsOpen } = useStore((state) => state);

	const { data, isSuccess, isLoading, isError } = useQuery({
		queryKey: [`get-home-games`],
		queryFn: getHomeGames,
	});

	const { data: clueData, isSuccess: clueSuccess } = useQuery({
		queryKey: ['console-game-button'],
		queryFn: () => getButtonInfoById(4)
	})

	function handleOpenClue(e) {
      e.stopPropagation();
		if (clueSuccess) {
			setXsTitle(clueData.description);
			setXsText(clueData.text);
			changeXsIsOpen(true);
		}
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
				homeSalePrice
				sectionTitle={'Под домашнюю консоль'}
				slides={copyOfGames.current}
				SectionIcon={HomeGamesIcon}
				clueBtnIcon={clueData.title}
				clueOnClick={handleOpenClue}
			/>
		);
	}

	return (
		<section
			style={{
				// backgroundImage: `url(${copyOfGames.current[0]?.image})`,
				position: 'relative',
				zIndex: 2,
			}}
			className={cls.NewPredictionGames}>
			<img
				className={cls.backGroundImage}
				src={copyOfGames.current[0]?.image}
				alt=''
			/>
			<div className={cls.blurBgAbsolute} />
			<div className={cls.blurBg}>{content.current}</div>
		</section>
	);
});

export default RussianLangGames;
