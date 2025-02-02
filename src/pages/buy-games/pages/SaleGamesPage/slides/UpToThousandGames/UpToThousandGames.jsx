import { useEffect, useRef, useState } from 'react';
import cls from './style.module.css';
import { useStore } from '../../../../../../store';
import { useQuery } from '@tanstack/react-query';
import { getRussianGames } from '../../../../../../modules/russian-lang-games/api/getRussianGames';
import SectionWithSlide from '../../../../../../components/SectionWithSlide/SectionWithSlide';
import { FireIcon } from '../../../../../../assets'

const UpToThousandGames = () => {
	const content = useRef();
	const copyOfGames = useRef([]);
	const [sliderGames, setSliderGames] = useState([]);
	const { setVoiceActing, setCategoryBottomSheetIsOpen } = useStore(
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
				SectionIcon={FireIcon}
				allBtnOnClick={handleOpen}
				sectionTitle={'Игры до 1000р'}
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
			<div className={cls.blurBg}>{content.current}</div>
		</section>
	);
};

export default UpToThousandGames;
