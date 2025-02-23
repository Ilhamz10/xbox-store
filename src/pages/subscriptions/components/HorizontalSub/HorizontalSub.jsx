import cls from './HorizontalSub.module.css';

export const HorizontalSub = ({ background, onClick, title }) => {
   return (
      <div
         style={{ background: `url(${background})` }}
         className={cls.container}
      >
         <h3>Подписка {title}</h3>
         <button onClick={onClick}>Подробнее</button>
      </div>
   );
};
