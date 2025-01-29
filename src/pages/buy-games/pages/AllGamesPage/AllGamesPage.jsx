import gifLoading from '../../../../assets/gifs/video-ezgif.com-gif-maker.gif';

const AllGamesPage = () => {
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: '45%',
				transform: 'translate(-50%,-50%)',
			}}>
			<img
				style={{ width: '50px', margin: '0 auto' }}
				src={gifLoading}
				alt=''
			/>
			<h3 style={{ paddingTop: '10px', fontWeight: '400' }}>В разработке..</h3>
		</div>
	);
};

export default AllGamesPage;
