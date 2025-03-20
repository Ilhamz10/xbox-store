import WebApp from '@twa-dev/sdk';

import Button from '../../UI/Button/Button'
import s from './ClosedPlaceholder.module.css';

export const ClosedPlaceholder = () => {
   return (
      <div className="loading">
         <div>
            <h3 className={s.title}>Для дальнейшей работы перейдите в Telegram бота</h3>
            <Button className={s.button} onClick={() => WebApp.openTelegramLink('https://t.me/XboxRent_Bot')}>
               Перейти в Telegram бота
            </Button>
         </div>
      </div>
   )
}