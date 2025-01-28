import { memo } from 'react';
import DiscountedGames from './slides/DiscountedGames/DiscountedGames';
import LatestReleases from './slides/LatestReleases/LatestReleases';
import UpToThousandGames from './slides/UpToThousandGames/UpToThousandGames';
import cls from './style.module.css';

const SaleGamesPage = memo(function SaleGamesPage() {
	const oddComponents = [
		<LatestReleases key='LatestReleases' />,
		<DiscountedGames key='DiscountedGames' />,
	];

	const evenComponents = [<UpToThousandGames key='UpToThousandGames' />];

	const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

	const shuffledOddComponents = shuffleArray(oddComponents);
	const shuffledEvenComponents = shuffleArray(evenComponents);

	const combinedComponents = [];
	const maxLength = Math.max(
		shuffledOddComponents.length,
		shuffledEvenComponents.length
	);

	for (let i = 0; i < maxLength; i++) {
		if (i < shuffledOddComponents.length) {
			combinedComponents.push(shuffledOddComponents[i]);
		}
		if (i < shuffledEvenComponents.length) {
			combinedComponents.push(shuffledEvenComponents[i]);
		}
	}

	return (
		<div style={{ marginTop: '32px' }}>
			<div className='wrapper'>
				<div className={cls.infoWindow}>
					<p>Распродажа продлиться до 18.01.2025 13:00 мск</p>
					<p>На распродаже 857 товаров.</p>
				</div>
			</div>
			<div style={{ marginTop: '32px' }}>{combinedComponents}</div>
		</div>
	);
});

export default SaleGamesPage;
