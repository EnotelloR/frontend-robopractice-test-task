import { Dispatch } from 'redux';
import axios from 'axios';
import { UserAction, UserActionTypes } from '../../types/user';

export const fetchUsers = () => {
	return async (dispatch: Dispatch<UserAction>) => {
		try {
			dispatch({ type: UserActionTypes.FETCH_USERS });
			const response = await axios.get('http://localhost:8080/api/users');
			const users = response.data.map((user: any) => {
				const editedUser = {
					id: user.id,
					name: user.Fullname,
					times: Array(31).fill('0'),
					total: ''
				};

				//const daysArray = Array(31).fill('0');
				let totalHours = 0;
				let totalMinutes = 0;
				user.Days.forEach((day: any) => {
					const time = new Date(
						Date.parse(day.Date + ' ' + day.End.replace(/-/g, ':')) -
							Date.parse(day.Date + ' ' + day.Start.replace(/-/g, ':'))
					);
					editedUser.times[new Date(day.Date).getDate() - 1] =
						time.getUTCHours() +
						':' +
						// (time.getUTCMinutes() < 10 ? '0' : '') +
						time.getUTCMinutes();
					totalHours += time.getUTCHours();
					totalMinutes += time.getUTCMinutes();
				});
				editedUser.total =
					totalHours +
					Math.trunc(totalMinutes / 60) +
					':' +
					(totalMinutes - Math.trunc(totalMinutes / 60) * 60);
				return editedUser;
			});
			dispatch({ type: UserActionTypes.FETCH_USERS_SUCCESS, payload: users });
		} catch (e) {
			dispatch({
				type: UserActionTypes.FETCH_USERS_ERROR,
				payload: 'Произошла ошибка при загрузке пользователей'
			});
		}
	};
};

export const setUsers = (users: any[]): UserAction => {
	return { type: UserActionTypes.SET_USERS, payload: users };
};
