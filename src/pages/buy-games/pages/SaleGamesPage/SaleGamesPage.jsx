import { memo, useEffect, useMemo } from 'react';
import { Timer } from '../../../../UI/Timer/Timer';
import { shuffleArray } from '../../../../helpers/shuffleArray';
import SaleCarousel from '../../../../UI/SaleCarousel/SaleCarousel';
import {
	StarIcon,
   DiscountIcon,
   RussianFlagIcon,
   FireIcon,
	CalendarIcon,
	DollarincircleIcon
} from '../../../../assets';
import cls from './style.module.css';
import { useStore } from '../../../../store';

const evenComponents = [
	<SaleCarousel key="UpToThousandGames" title="Игры до 1000р" icon={FireIcon} />,
	<SaleCarousel key="UpToFiveHundredGames" title="Игры до 500р" icon={FireIcon} />,
	<SaleCarousel key="UpToThousandFiveHundredGames" title="Хиты до 1500р" icon={DiscountIcon} />,
	<SaleCarousel key="Currency" title="Валюта" icon={DollarincircleIcon} />,
];

const oddComponents = [
	<SaleCarousel key="LatestReleases" title="Последние релизы" icon={CalendarIcon} isOdd />,
	<SaleCarousel key="DiscountedGames" title="Скидки 70-95%" icon={DiscountIcon} isOdd />,
	<SaleCarousel key="RussianGames" title="Полностью на русском" icon={RussianFlagIcon} isOdd />,
	<SaleCarousel key="AdditionsForGames" title="Дополнения для игр" icon={StarIcon} isOdd />,
];

const SaleGamesPage = memo(function SaleGamesPage() {
   const { queriesCompleted, setLoading } = useStore(state => state);

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
         </div>
      </>
   );
});

export default SaleGamesPage;
