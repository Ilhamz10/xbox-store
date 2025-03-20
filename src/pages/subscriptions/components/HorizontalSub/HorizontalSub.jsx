import cls from './HorizontalSub.module.css';

export const HorizontalSub = ({ background, onClick, title, className }) => {
   return (
      <div
         style={{ background: `url(${background})` }}
         className={`${cls.container} ${className ?? ''}`}
      >
         <h3>Подписка {title}</h3>
         <button onClick={onClick}>Подробнее</button>
      </div>
   );
};
