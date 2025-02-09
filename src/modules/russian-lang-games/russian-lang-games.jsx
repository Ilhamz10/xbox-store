import SectionWithSlide from '../../components/SectionWithSlide/SectionWithSlide';
import cls from './russian-lang-games.module.css';
import { RussianFlagIcon } from '../../assets';
import { memo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRussianGames } from './api/getRussianGames';
import { useStore } from '../../store';

const RussianLangGames = memo(function RussianLangGames() {
	const content = useRef();
	const copyOfGames = useRef([]);
	const {
		setVoiceActing,
		setCategoryBottomSheetIsOpen,
		setActiveModalText
	} = useStore((state) => state);

	const { data, isSuccess, isLoading, isError } = useQuery({
		queryKey: [`get-russian-games`],
		queryFn: () => getRussianGames(),
	});

	function handleOpen() {
		setVoiceActing('russian');
		setActiveModalText("Полностью на русском");
		setCategoryBottomSheetIsOpen(true);
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
				withAllBtn={true}
				allBtnOnClick={handleOpen}
				sectionTitle={'Полностью на русском'}
				slides={copyOfGames.current}
				SectionIcon={RussianFlagIcon}
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
