import { memo, useEffect, useMemo, useState } from 'react';
import { Timer } from '../../../../UI/Timer/Timer';
import { shuffleArray } from '../../../../helpers/shuffleArray';
import SaleCarousel from '../../../../UI/SaleCarousel/SaleCarousel';
import {
	StarIcon,
   DiscountIcon,
   RussianFlagIcon,
   FireIcon,
	CalendarIcon,
	DollarincircleIcon,
	PcSupportGamesIcon,
	Xbox360GamesIcon
} from '../../../../assets';
import { useStore } from '../../../../store';
import GameCard from '../../../../components/GameCard/GameCard';
import { Filters } from '../../../../UI/Filters/Filters';
import { tempProductsArr } from '../../../../consts/temp-products';
import { CategoryBottomSheet } from '../../../../modules/CategoryBottomSheet/CategoryBottomSheet';
import cls from './style.module.css';

const evenComponents = [
	<SaleCarousel key="UpToThousandGames" title="Игры до 1000р" icon={FireIcon} />,
	<SaleCarousel key="UpToFiveHundredGames" title="Игры до 500р" icon={FireIcon} />,
	<SaleCarousel key="UpToThousandFiveHundredGames" title="Хиты до 1500р" icon={DiscountIcon} />,
	<SaleCarousel key="Currency" title="Валюта" icon={DollarincircleIcon} />,
	<SaleCarousel key="PCSupportGames" title="Игры с поддержкой PC" icon={PcSupportGamesIcon} />,
];

const oddComponents = [
	<SaleCarousel key="LatestReleases" title="Последние релизы" icon={CalendarIcon} isOdd />,
	<SaleCarousel key="DiscountedGames" title="Скидки 70-95%" icon={DiscountIcon} isOdd />,
	<SaleCarousel key="RussianGames" title="Полностью на русском" icon={RussianFlagIcon} isOdd />,
	<SaleCarousel key="AdditionsForGames" title="Дополнения для игр" icon={StarIcon} isOdd />,
	<SaleCarousel key="Xbox360Games" title="Xbox 360 games" icon={Xbox360GamesIcon} isOdd />,
];

const SaleGamesPage = memo(function SaleGamesPage() {
	const [page, setPage] = useState(0);
	const [totalGames, setTotalGames] = useState(0);
   const {
		queriesCompleted,
		setLoading,
		gameInfoBottomSheetIsOpen,
		basketBottomSheet
	} = useStore(state => state);

	const combinedComponents = [];

	const shuffledOddComponents = useMemo(() => shuffleArray(oddComponents), []);
	const shuffledEvenComponents = useMemo(() => shuffleArray(evenComponents), []);

	const maxLength = Math.max(
		shuffledOddComponents.length,
		shuffledEvenComponents.length,
	);

	for (let i = 0; i < maxLength; i++) {
		if (i < shuffledOddComponents.length) {
			combinedComponents.push(shuffledOddComponents[i]);
		}
		if (i < shuffledEvenComponents.length) {
			combinedComponents.push(shuffledEvenComponents[i]);
		}
	}

   useEffect(() => {
      if (combinedComponents.length === queriesCompleted) setLoading(false);
   }, [queriesCompleted]);

   return (
      <>
			{/* MODAL FOR CAROUSELS */}
			<CategoryBottomSheet adjustPosition={gameInfoBottomSheetIsOpen || basketBottomSheet} />

         <div className="wrapper">
            <p className={cls.productCount}>На распродаже 857 товаров.</p>
         </div>
         <div style={{ marginTop: 18 }}>
            <div className="wrapper">
               <div className={cls.infoWindow}>
                  <p className={cls.infoTitle}>
                     Распродажа заканчивается через
                  </p>
                  <Timer
                     date={'2025-02-04T10:00:00Z'}
                     style={{ margin: '0 auto' }}
                  />
               </div>
            </div>
            <div style={{ marginTop: 20 }}>
					{combinedComponents}
				</div>

				{/* FEED OF PRODUCTS */}
				<div>
					<Filters
						content={{ current: null }}
						isFetching={false}
						inBottomSheet={false}
						page={page}
						setPage={setPage}
						totalGames={totalGames}
						filterBtnsStyle={{ marginBottom: 0 }}
						contStyle={{
							margin: 0,
							width: 'fit-content',
							overflowX: 'visible'
						}}
					/>

					<div className={cls.feed}>
						{tempProductsArr.map(game => (
							<GameCard
								key={game.id}
								release_date={game.release_date}
								game={game}
								gameTitle={game.title}
								gamePrice={game.price}
								imgSrc={game.image}
								className={cls.gameCard}
							/>
						))}
					</div>
				</div>
         </div>
      </>
   );
});

export default SaleGamesPage;
