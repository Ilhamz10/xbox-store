import { XboxLoading } from '../../assets';

const Loading = ({ loading }) => {
   return (
      loading && (
         <div className="loading">
            <XboxLoading />
         </div>
      )
   );
};

export default Loading;
