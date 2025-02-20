import { useStore } from '../../../../store'
import Button from '../../../../UI/Button/Button';
import cls from './GamePassCarousel.module.css';

export const GamePassCarousel = ({ subscription, activeSub, setActiveSub }) => {
   const { setXsTitle, setXsText, changeXsIsOpen } = useStore(state => state);

   function handleOpenClue(e) {
      e.stopPropagation();
		setXsTitle("Подсказка");
		setXsText(subscription.additional_info);
		changeXsIsOpen(true);
   }

   return (
      <div>
         <div className={cls.head}>
            <h3>{subscription.name}</h3>
            <Button onClick={handleOpenClue}>
               {subscription.description}
            </Button>
         </div>

         <div className={cls.periods}>
            {subscription.periods.map(period => (
               <div
                  key={period.id}
                  className={`${cls.period} ${
                     period.id === activeSub.id && cls.active
                  }`}
                  onClick={() =>
                     setActiveSub(
                        period.id === activeSub.id
                           ? {}
                           : {
                                id: period.id,
                                name: subscription.name,
                                duration_months: period.duration_months,
                                price: period.period_price,
                             },
                     )
                  }
               >
                  <p>{period.duration_months} мес</p>
                  <span>{+period.period_price} ₽</span>
               </div>
            ))}
         </div>
      </div>
   );
};
