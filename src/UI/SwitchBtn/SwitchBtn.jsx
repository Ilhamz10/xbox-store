import { DiscountIcon, XboxIcon } from '../../assets';
import cls from './style.module.css';
import { motion } from 'framer-motion';

const SwitchBtn = ({selectedTab, setSelectedTab}) => {
	function changeTab(tab) {
		setSelectedTab(tab);
	}

	return (
		<div className={cls.switchBtnsCont}>
			<div className={cls.switchBtnCont}>
				<button
					onClick={() => changeTab('sale')}
					className={`${cls.switchBtn}`}>
					<DiscountIcon width={18} height={18} />
					<span className={cls.saleSwitchBtn} data-count='10'>
						Распродажа
					</span>
				</button>
				{selectedTab === 'sale' && (
					<motion.div
						className={`${cls.tabSelector} ${cls.bgBlue}`}
						layoutId='tabselector'
					/>
				)}
			</div>
			<div className={cls.switchBtnCont}>
				<button onClick={() => changeTab('all')} className={cls.switchBtn}>
					<XboxIcon width={18} height={18} />
					<span>Все игры</span>
				</button>
				{selectedTab === 'all' && (
					<motion.div className={cls.tabSelector} layoutId='tabselector' />
				)}
			</div>
		</div>
	);
};

export default SwitchBtn;
