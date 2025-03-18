import cls from './select-console.module.css';
import { ConsoleModal } from '../../../../UI/ConsoleModal/ConsoleModal';
import { XboxOne, XboxSeries } from '../../../../assets';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { hashString } from '../../../../helpers/hashString';
import WebApp from '@twa-dev/sdk';
// import { Icon } from '@iconify/react/dist/iconify.js';
import { changeConsole } from './api/changeConsole';
import consoleMusic from '../../../../assets/sounds/console-music.mp3';

const SelectConsole = ({ openConsoleModal, setOpenConsoleModal }) => {
	const [consoleType, setConsoleType] = useState('');
	const [endAnimation, setEndAnimation] = useState(false);
	const [startAnimation, setStartAnimation] = useState(false);

	let audio = new Audio(consoleMusic);

	const { mutate } = useMutation({
		mutationFn: changeConsole,
		onSuccess: () => {
			setEndAnimation(true);
			setStartAnimation(false);
		},
	});

	function handleSelectCnosole(consoleType) {
		setConsoleType(consoleType);
		audio.play();
		hashString(import.meta.env.VITE_AUTH_TOKEN + WebApp?.initDataUnsafe?.user?.id).then((hash) => {
			mutate({
				token: hash,
				id: WebApp?.initDataUnsafe?.user?.id,
				consoleType: consoleType,
			});
		});
	}

	return (
		<ConsoleModal
			isOpen={openConsoleModal}
			setIsopen={setOpenConsoleModal}
			endAnimation={endAnimation}
			setEndAnimation={setEndAnimation}
			startAnimation={startAnimation}
			setStartAnimation={setStartAnimation}>
			<div className={cls.selectConsole}>
				<h2 className='section-title'>Выберите вашу консоль</h2>
				<div className={cls.consoleCards}>
					<div
						onClick={() => handleSelectCnosole('xbox_series_x_s')}
						className={`${cls.consoleCard} ${
							consoleType === 'xbox_series_x_s' ? cls.active : ''
						}`}>
						<XboxSeries width={48} height={64} />
						<span>Xbox Series</span>
					</div>
					<div
						onClick={() => handleSelectCnosole('xbox_one')}
						className={`${cls.consoleCard} ${
							consoleType === 'xbox_one' ? cls.active : ''
						}`}>
						<XboxOne width={64} height={64} />
						<span>Xbox One</span>
					</div>
				</div>
				{/* <button onClick={handleSelectCnosole} className={cls.saveBtn}>
					{isPending ? <Icon icon='eos-icons:loading' /> : 'Сохранить'}
				</button> */}
			</div>
		</ConsoleModal>
	);
};

export default SelectConsole;
