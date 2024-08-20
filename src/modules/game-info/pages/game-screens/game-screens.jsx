import cls from './game-screens.module.css'

const GameScreens = ({ screens }) => {
	return (
		<div className='wrapper'>
			<div className={cls.allScreens}>
				{screens.map((screen) => (
					<img key={screen.id} src={screen.image} />
				))}
			</div>
		</div>
	);
};

export default GameScreens;
