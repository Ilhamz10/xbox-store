import { memo, useEffect } from 'react';
import cls from './game-videos.module.css';

function sliceVideoSrc(url) {
	return url ? 'https://www.youtube.com/embed/' + url.split('.be/')[1] : '';
}

const GameVideos = memo(function GameVideos({ videos, trailer, title }) {
	useEffect(() => {
		window.scrollTo({
			top: 0,
		});
	}, []);

	return (
		<div className='wrapper'>
			<div
				style={{
					display: 'grid',
					gap: '12px',
					marginBottom: '16px',
					paddingTop: '20px',
				}}>
				<h3 className='section-title'>Официальный трейлер</h3>
				<iframe
					className={cls.video}
					src={sliceVideoSrc(trailer)}
					title='YouTube video player'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
					referrerPolicy='strict-origin-when-cross-origin'
					allowfullscreen></iframe>
			</div>
			<div className={cls.allVideos}>
				<h3 className='section-title'>Обзоры игры</h3>
				{videos.map((video) => (
					<iframe
						key={video.id}
						className={cls.video}
						src={sliceVideoSrc(video.url)}
						title='YouTube video player'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
						referrerPolicy='strict-origin-when-cross-origin'
						allowfullscreen></iframe>
				))}
				<a
					className={cls.moreVideosLink}
					href={`https://www.youtube.com/results?search_query=${title
						.split(' ')
						.join('+')}+обзор`}>
					Показать больше видео..
				</a>
			</div>
		</div>
	);
});

export default GameVideos;
