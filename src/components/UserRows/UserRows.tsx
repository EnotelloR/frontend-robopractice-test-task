import React, { useEffect, useMemo, useState } from 'react';
import { Resizable } from 're-resizable';
import User from '../User/User';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import styles from './UserRows.module.css';

const UserRows: React.FC = () => {
	const { users } = useTypedSelector((state) => state.user);
	const { fetchUsers, setUsers } = useActions();

	const [columns] = useState<any[]>(
		Array(31)
			.fill(1)
			.map((_, i) => i + 1)
	);
	//const [modifiedUsers, setModifiedUsers] = useState<any[]>([...users]);
	const [sortOrder, setSortOrder] = useState(false);
	const [sizes, setSizes] = useState<number[]>(Array(32).fill(150));
	const [searchUserName, setSearchUserName] = useState('');
	const [selectedPage, setSelectedPage] = useState(1);

	useEffect(() => {
		fetchUsers();
	}, []);

	// setUsers(() =>{
	//     return users.map(user => {
	//         let editedUser = {
	//             name: user.Name,
	//             times: [""],
	//             total: ''
	//         };
	//         let daysArray = []
	//         for (let i = 0; i < 31; i++) {
	//             daysArray[i] = "0";
	//         }
	//         let totalHours = 0;
	//         let totalMinutes = 0;
	//         user.Days.forEach((day: any) => {
	//             let time = new Date(Date.parse(day.Date + " " + day.End.replace(/-/g, ":")) - Date.parse(day.Date + " " + day.Start.replace(/-/g, ":")))
	//             daysArray[day.Date.getDate() - 1] = time.getUTCHours() + ":" + time.getUTCMinutes();
	//             totalHours += time.getUTCHours();
	//             totalMinutes += time.getUTCMinutes();
	//         })
	//         editedUser.times = daysArray;
	//         editedUser.total = (totalHours + Math.trunc(totalMinutes / 60)) + ":" + (totalMinutes - Math.trunc(totalMinutes / 60) * 60)
	//         return editedUser;
	//     });
	// })

	const filteredUsers = useMemo(() => {
		setSelectedPage(1);
		return users.filter((user) => {
			return searchUserName
				? user.name.toLowerCase().includes(searchUserName.toLowerCase())
				: true;
		});
	}, [users, searchUserName, sortOrder]);

	const pages = useMemo(() => {
		const arr = [];
		for (let i = 1; i <= Math.trunc(filteredUsers.length / 10) + 1; i++) {
			arr.push(i);
		}
		return arr;
	}, [filteredUsers]);

	const dividedUsers = useMemo(() => {
		return filteredUsers.filter(
			(user, index) =>
				(selectedPage - 1) * 10 <= index && index < selectedPage * 10
		);
	}, [filteredUsers, selectedPage, sortOrder]);

	const sortingByName = () => {
		setUsers(
			users.sort((a, b) => {
				if (a.name > b.name) {
					return sortOrder ? 1 : -1;
				} else if (a.name < b.name) {
					return sortOrder ? -1 : 1;
				} else {
					return 0;
				}
			})
		);
	};

	const sortingByDay = (column: number) => {
		setUsers(
			users.sort((a, b) => {
				if (a.times[column - 1] === '0' && b.times[column - 1] !== '0') {
					return sortOrder ? -1 : 1;
				} else if (a.times[column - 1] !== '0' && b.times[column - 1] === '0') {
					return sortOrder ? 1 : -1;
				} else if (a.times[column - 1] === '0' && b.times[column - 1] === '0') {
					return 0;
				} else {
					const splintedTotalA = a.times[column - 1].split(':');
					const splintedTotalB = b.times[column - 1].split(':');
					if (
						splintedTotalA[0] * 60 + Number(splintedTotalA[1]) >
						splintedTotalB[0] * 60 + Number(splintedTotalB[1])
					) {
						return sortOrder ? 1 : -1;
					} else if (
						splintedTotalA[0] * 60 + Number(splintedTotalA[1]) <
						splintedTotalB[0] * 60 + Number(splintedTotalB[1])
					) {
						return sortOrder ? -1 : 1;
					} else {
						return 0;
					}

					// if (
					// 	new Date(a.times[selectedDay - 1]).getUTCHours() * 60 +
					// 		new Date(a.times[selectedDay - 1]).getUTCMinutes() >
					// 	new Date(b.times[selectedDay - 1]).getUTCHours() * 60 +
					// 		new Date(b.times[selectedDay - 1]).getUTCMinutes()
					// ) {
					// 	return sortByDay ? 1 : -1;
					// } else if (
					// 	new Date(a.times[selectedDay - 1]).getUTCHours() * 60 +
					// 		new Date(a.times[selectedDay - 1]).getUTCMinutes() <
					// 	new Date(b.times[selectedDay - 1]).getUTCHours() * 60 +
					// 		new Date(b.times[selectedDay - 1]).getUTCMinutes()
					// ) {
					// 	return sortByDay ? -1 : 1;
					// } else {
					// 	return 0;
					// }
				}
			})
		);
	};

	const sortingByTotal = () => {
		setUsers(
			users.sort((a, b) => {
				const splintedTotalA = a.total.split(':');
				const splintedTotalB = b.total.split(':');
				if (
					splintedTotalA[0] * 60 + Number(splintedTotalA[1]) >
					splintedTotalB[0] * 60 + Number(splintedTotalB[1])
				) {
					return sortOrder ? 1 : -1;
				} else if (
					splintedTotalA[0] * 60 + Number(splintedTotalA[1]) <
					splintedTotalB[0] * 60 + Number(splintedTotalB[1])
				) {
					return sortOrder ? -1 : 1;
				} else {
					return 0;
				}
			})
		);
	};

	// const sortedAndFilteredUsers = useMemo(() => {
	//     return filteredUsers.sort((a, b) => {
	//         if (sortingType === "name") {
	//             if (a.name > b.name)
	//                 return 1
	//             else if (a.name < b.name)
	//                 return -1;
	//             else
	//                 return 0;
	//         } else if (totalSort) {
	//             let splintedTotalA = a.total.split(":");
	//             let splintedTotalB = b.total.split(":");
	//             if (splintedTotalA[0] > splintedTotalB[0])
	//                 return 1;
	//             else if (splintedTotalA[0] < splintedTotalB[0])
	//                 return -1;
	//             else {
	//                 if (splintedTotalA[1] > splintedTotalB[1])
	//                     return 1;
	//                 else if (splintedTotalA[1] < splintedTotalB[1])
	//                     return -1;
	//                 else
	//                     return 0;
	//             }
	//         } else if (daySort) {
	//             if (new Date(a.times[daySort]).getUTCHours() > new Date(b.times[daySort]).getUTCHours())
	//                 return 1;
	//             else if (new Date(a.times[daySort]).getUTCHours() < new Date(b.times[daySort]).getUTCHours())
	//                 return -1;
	//             else {
	//                 if (new Date(a.times[daySort]).getUTCMinutes() > new Date(b.times[daySort]).getUTCMinutes())
	//                     return 1;
	//                 else if (new Date(a.times[daySort]).getUTCMinutes() > new Date(b.times[daySort]).getUTCMinutes())
	//                     return -1;
	//                 else
	//                     return 0;
	//             }
	//         }
	//         return 0;
	//     });
	// }, [filteredUsers, sortingType]);

	return (
		<div className={styles.appWrapper}>
			<div className={styles.searchHolder}>
				<input
					className={styles.searchHolder__input}
					value={searchUserName}
					placeholder={'Insert a name for filtering'}
					onChange={(event) => setSearchUserName(event.target.value)}
				/>
			</div>
			<div className={styles.tableWrapper}>
				<div className={styles.headerWrapper}>
					<div className={styles.headerHolder}>
						<Resizable
							enable={{
								top: false,
								right: true,
								bottom: false,
								left: true,
								topRight: false,
								bottomRight: false,
								bottomLeft: false,
								topLeft: false
							}}
							className={[
								styles.header__element,
								styles.header__element_sticky
							].join(' ')}
							size={{ width: sizes[0], height: 50 }}
							onResizeStop={(e, direction, ref, d) => {
								setSizes((prevState) => {
									const temp = [...prevState];
									temp[0] += d.width;
									return temp;
								});
							}}
						>
							<p
								className={styles.header__element__text}
								onClick={() => {
									setSortOrder(!sortOrder);
									sortingByName();
								}}
							>
								User
							</p>
						</Resizable>
						{columns.map((column, index) => (
							<Resizable
								enable={{
									top: false,
									right: true,
									bottom: false,
									left: true,
									topRight: false,
									bottomRight: false,
									bottomLeft: false,
									topLeft: false
								}}
								className={styles.header__element}
								key={column}
								size={{ width: sizes[index + 1], height: 50 }}
								onResizeStop={(e, direction, ref, d) => {
									setSizes((prevState) => {
										const temp = [...prevState];
										temp[index + 1] += d.width;
										return temp;
									});
								}}
							>
								<p
									className={styles.header__element__text}
									onClick={() => {
										setSortOrder(!sortOrder);
										sortingByDay(column);
									}}
								>
									{column}
								</p>
							</Resizable>
						))}
						<Resizable
							enable={{
								top: false,
								right: true,
								bottom: false,
								left: true,
								topRight: false,
								bottomRight: false,
								bottomLeft: false,
								topLeft: false
							}}
							className={[
								styles.header__element,
								styles.header__element_stickyTotal
							].join(' ')}
							size={{ width: sizes[sizes.length - 1], height: 50 }}
							onResizeStop={(e, direction, ref, d) => {
								setSizes((prevState) => {
									const temp = [...prevState];
									temp[sizes.length - 1] += d.width;
									return temp;
								});
							}}
						>
							<p
								className={styles.header__element__text}
								onClick={() => {
									setSortOrder(!sortOrder);
									sortingByTotal();
								}}
							>
								Monthly total
							</p>
						</Resizable>
					</div>
				</div>
				{dividedUsers.map((user) => (
					<User user={user} sizes={sizes} />
				))}
			</div>
			<div className={styles.paginationHolder}>
				{pages.map((p) => (
					<button
						className={styles.paginationHolder__button}
						key={p}
						style={{ color: p === selectedPage ? 'red' : 'black' }}
						onClick={() => setSelectedPage(p)}
					>
						{p}
					</button>
				))}
			</div>
		</div>
	);
};

export default UserRows;
