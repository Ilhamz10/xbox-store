import { memo, useEffect, useRef, useState } from 'react';
import SectionWithSlide from '../../../../../../components/SectionWithSlide/SectionWithSlide';
import { NewPredictionGamesIcon } from '../../../../../../assets';
import cls from './style.module.css';
import { getRussianGames } from '../../../../../../modules/russian-lang-games/api/getRussianGames';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../../../../../store';

const LatestReleases = memo(function LatestReleases() {
	const content = useRef();
	const copyOfGames = useRef([]);
	const [sliderGames, setSliderGames] = useState([]);
	const { setVoiceActing, setCategoryBottomSheetIsOpen, setLoading } = useStore(
		(state) => state
	);

	const { data, isSuccess, isLoading, isError } = useQuery({
		queryKey: [`get-russian-games`],
		queryFn: () => getRussianGames(),
	});

	function handleOpen() {
		setVoiceActing('russian');
		setCategoryBottomSheetIsOpen(true);
	}

	useEffect(() => {
		if (isLoading) setLoading(true);
		if (isSuccess) {
			copyOfGames.current = [...data.results];
			let currentIndex = copyOfGames.current.length;

			// While there remain elements to shuffle...
			while (currentIndex != 0) {
				// Pick a remaining element...
				let randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

				// And swap it with the current element.
				[copyOfGames.current[currentIndex], copyOfGames.current[randomIndex]] =
					[copyOfGames.current[randomIndex], copyOfGames.current[currentIndex]];
			}

			setSliderGames(copyOfGames.current);
			setLoading(false)
		}
	}, [data, isSuccess]);

	if (isLoading) {
		content.current = <p>Loading...</p>;
	}

	if (isError) {
		content.current = <p>Error</p>;
	}

	if (isSuccess) {
		content.current = (
			<SectionWithSlide
				withAllBtn={true}
				allBtnOnClick={handleOpen}
				SectionIcon={NewPredictionGamesIcon}
				sectionTitle={'Последние релизы'}
				slides={sliderGames}
				// SectionIcon={RussianFlagIcon}
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
			{sliderGames && (
				<img
					className={cls.backGroundImage}
					src={sliderGames[0]?.image}
					alt=''
				/>
			)}
			<div className={cls.blurBgAbsolute} />
			<div className={cls.blurBg}>{content.current}</div>
		</section>
	);
});

export default LatestReleases;
