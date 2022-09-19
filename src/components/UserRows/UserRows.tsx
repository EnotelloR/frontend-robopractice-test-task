import React, { useEffect, useMemo, useState } from 'react';
import { Resizable } from 're-resizable';
import User from '../User/User';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { IUser } from '../../types/user';
import styles from './UserRows.module.css';

const UserRows: React.FC = () => {
	const { users } = useTypedSelector((state) => state.user);
	const { fetchUsers, setUsers } = useActions();

	const [columns] = useState<any[]>(
		Array(31)
			.fill(1)
			.map((_, i) => i + 1)
	);
	const [sortOrder, setSortOrder] = useState<boolean>(false);
	const [sizes, setSizes] = useState<number[]>(Array(32).fill(150));
	const [searchUserName, setSearchUserName] = useState<string>('');
	const [selectedPage, setSelectedPage] = useState<number>(1);

	useEffect(() => {
		fetchUsers();
	}, []);

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

	const timeComparer = (
		splintedTotalA: string[],
		splintedTotalB: string[]
	): number => {
		if (
			Number(splintedTotalA[0]) * 60 + Number(splintedTotalA[1]) >
			Number(splintedTotalB[0]) * 60 + Number(splintedTotalB[1])
		) {
			return sortOrder ? 1 : -1;
		} else if (
			Number(splintedTotalA[0]) * 60 + Number(splintedTotalA[1]) <
			Number(splintedTotalB[0]) * 60 + Number(splintedTotalB[1])
		) {
			return sortOrder ? -1 : 1;
		} else {
			return 0;
		}
	};

	const sortingByDay = (day: number) => {
		setUsers(
			users.sort((a, b) => {
				if (a.times[day - 1] === '0' && b.times[day - 1] !== '0') {
					return sortOrder ? -1 : 1;
				} else if (a.times[day - 1] !== '0' && b.times[day - 1] === '0') {
					return sortOrder ? 1 : -1;
				} else if (a.times[day - 1] === '0' && b.times[day - 1] === '0') {
					return 0;
				} else {
					const splintedTotalA = a.times[day - 1].split(':');
					const splintedTotalB = b.times[day - 1].split(':');
					return timeComparer(splintedTotalA, splintedTotalB);
				}
			})
		);
	};

	const sortingByTotal = () => {
		setUsers(
			users.sort((a, b) => {
				const splintedTotalA = a.total.split(':');
				const splintedTotalB = b.total.split(':');
				return timeComparer(splintedTotalA, splintedTotalB);
			})
		);
	};

	return (
		<div className={styles.appWrapper}>
			<div className={styles.searchHolder}>
				<input
					className={styles.searchHolder__input}
					value={searchUserName}
					placeholder={'Print a name for filtering'}
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
							<div
								className={styles.header__element__text}
								title={'Нажмите для сортировки'}
								onClick={() => {
									setSortOrder(!sortOrder);
									sortingByName();
								}}
							>
								User
							</div>
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
								<div
									className={styles.header__element__text}
									title={'Нажмите для сортировки'}
									onClick={() => {
										setSortOrder(!sortOrder);
										sortingByDay(column);
									}}
								>
									{column}
								</div>
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
							<div
								className={styles.header__element__text}
								title={'Нажмите для сортировки'}
								onClick={() => {
									setSortOrder(!sortOrder);
									sortingByTotal();
								}}
							>
								Monthly total
							</div>
						</Resizable>
					</div>
				</div>
				{dividedUsers.map((user: IUser) => (
					<User key={user.id} user={user} sizes={sizes} />
				))}
			</div>
			<div className={styles.paginationHolder}>
				{pages.map((p) => (
					<button
						className={[
							styles.paginationHolder__button,
							p === selectedPage ? styles.paginationHolder__button_selected : ''
						].join(' ')}
						key={p}
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
