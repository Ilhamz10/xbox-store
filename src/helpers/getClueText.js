export function getClueText(data) {
   let obj = {};

   if (data.in_game_pass)
      obj.game_pass = `Игра ${data.title} включена в список подписки Game Pass Ultimate! Приобретите подписку и играйте в ${data.title} и еще в 531 игру бесплатно!`;

   if (data.compatibility === 'xbox_series_x_s')
      obj.xs = `Значок X|S обозначает что игра ${data.title} работает только на
               приставке Xbox Series S и Xbox Series X и не работает на приставке
               Xbox one.!`;

   if (data.pre_order)
      obj.pre_order = `Игра ${data.title} еще не вышла, но вы уже можете ее приобрести! Дата релиза игры: ${new Date(
         data.release_date,
      ).toLocaleDateString('ru-Ru', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
      })}г`;

   return obj;
}