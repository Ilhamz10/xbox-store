import { RightArrowIcon } from '../../../../assets';
import cls from './account-button.module.css';

export const AccountButton = ({
	component = 'button',
	Icon,
	text,
	iconContBg,
	className,
	subText,
	fullIcon,
	onClick = () => {},
	isLast,
}) => {
	if (component === 'button') {
		return (
			<button onClick={onClick} className={`${cls.button} ${className}`}>
				{!fullIcon ? (
					<div style={{ background: iconContBg }} className={cls.iconCont}>
						<Icon width={18} height={18} />
					</div>
				) : (
					<Icon width={36} height={36} />
				)}
				<div
					style={{ borderBottomWidth: isLast ? '0px' : '1px' }}
					className={cls.buttonContent}>
					<p className={cls.btnText}>{text}</p>
					<div className={cls.buttonSubTextCont}>
						{(subText || subText === 0) && <p>{subText}</p>}
						<RightArrowIcon
							className={cls.arrow}
							width={14}
							height={14}
							fill={'rgb(107 114 128)'}
						/>
					</div>
				</div>
			</button>
		);
	}
};
