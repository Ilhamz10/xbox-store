import { memo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query'
import SectionWithSlide from '../../components/SectionWithSlide/SectionWithSlide';
import { useStore } from '../../store';
import { getRussianGames } from '../../modules/russian-lang-games/api/getRussianGames';
import cls from './SaleCarousel.module.css';

const SaleCarousel = memo(function SaleCarousel({ isOdd = false, icon, title }) {
   const content = useRef();
   const copyOfGames = useRef([]);
   const { setVoiceActing, setCategoryBottomSheetIsOpen, setQueriesCompleted } = useStore(
      state => state,
   );

   function handleOpen() {
      setVoiceActing("russian");
      setCategoryBottomSheetIsOpen(true);
   }

   const { data, isSuccess, isLoading, isError } = useQuery({
      queryKey: [`get-russian-games`],
      queryFn: () => getRussianGames(),
   });

   if (isLoading) {
      content.current = <p>Loading...</p>;
   }

   if (isError) {
      content.current = <p>Error</p>;
   }

   useEffect(() => {
      if (isSuccess) {
         setQueriesCompleted();
         copyOfGames.current = [...data.results];
         const randomIndex = Math.floor(
            Math.random() * copyOfGames.current.length,
         );

         [copyOfGames.current[0], copyOfGames.current[randomIndex]] = [
            copyOfGames.current[randomIndex],
            copyOfGames.current[0],
         ];
      }
   }, [data, isSuccess]);

   if (isSuccess) {
      content.current = (
         <SectionWithSlide
            withAllBtn
            allBtnOnClick={handleOpen}
            sectionTitle={title}
            slides={copyOfGames.current}
            SectionIcon={icon}
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
         {isOdd && (
            <img
               className={cls.backGroundImage}
               src={copyOfGames.current[0]?.image}
               alt=""
            />
         )}
         <div className={cls.blurBgAbsolute} />
         <div className={cls.blurBg}>{content.current}</div>
      </section>
   );
});

export default SaleCarousel;
