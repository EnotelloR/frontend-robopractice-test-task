import React from 'react';
import styles from './User.module.css';

interface UserProps {
	user: {
		name: string;
		times: string[];
		total: string;
	};
	sizes: number[];
}

const User: React.FC<UserProps> = ({ user, sizes }) => {
	return (
		<div className={styles.rowWrapper}>
			<div className={styles.rowHolder}>
				<div
					className={[styles.row__element, styles.row__element_sticky].join(
						' '
					)}
					style={{ minWidth: sizes[0] + 'px' }}
				>
					<p className={styles.row__element__text}>{user.name}</p>
				</div>
				{user.times.map((time, index) => (
					<div
						className={styles.row__element}
						style={{ minWidth: sizes[index + 1] + 'px' }}
					>
						<p className={styles.row__element__text}>{time}</p>
					</div>
				))}
				<div
					className={[
						styles.row__element,
						styles.row__element_stickyTotal
					].join(' ')}
					style={{ minWidth: sizes[sizes.length - 1] + 'px' }}
				>
					<p className={styles.row__element__text}>{user.total}</p>
				</div>
			</div>
		</div>
	);
};

export default User;
