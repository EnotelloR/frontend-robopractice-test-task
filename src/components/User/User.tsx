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
	// const [totalHours, setTotalHours] = useState<number>(0);
	// const [totalMinutes, setTotalMinutes] = useState<number>(0);
	// const [daysArray, setDaysArray] = useState<string[]>([]);
	// for (let i = 0; i < 31; i++) {
	//     setDaysArray((prevState) => [...prevState, "0"]);
	// }
	// user.Days.forEach((day: any) => {
	//     let time = new Date(Date.parse(day.Date + " " + day.End.replace(/-/g, ":")) - Date.parse(day.Date + " " + day.Start.replace(/-/g, ":")))
	//     setDaysArray((prevState) => {
	//         let tempArr = [...prevState]
	//         tempArr[day.Date.getDate()-1] = time.getUTCHours()+":"+time.getUTCMinutes();
	//         return tempArr
	//     });
	//     //daysArray[day.Date.getDate()-1] = time.getUTCHours()+":"+time.getUTCMinutes();
	//     setTotalHours(prevState => prevState + time.getUTCHours())
	//     setTotalMinutes(prevState => prevState + time.getUTCMinutes())
	// })
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
