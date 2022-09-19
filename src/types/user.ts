export interface userState {
	users: IUser[];
	loading: boolean;
	error: null | string;
}

export enum UserActionTypes {
	FETCH_USERS = 'FETCH_USERS',
	FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS',
	FETCH_USERS_ERROR = 'FETCH_USERS_ERROR',
	SET_USERS = 'SET_USERS'
}

interface FetchUserAction {
	type: UserActionTypes.FETCH_USERS;
}

interface FetchUserSuccessAction {
	type: UserActionTypes.FETCH_USERS_SUCCESS;
	payload: any[];
}

interface FetchUserErrorAction {
	type: UserActionTypes.FETCH_USERS_ERROR;
	payload: string;
}

interface SetUsers {
	type: UserActionTypes.SET_USERS;
	payload: any[];
}

export type UserAction =
	| FetchUserAction
	| FetchUserSuccessAction
	| FetchUserErrorAction
	| SetUsers;

export interface IUser {
	id: number;
	name: string;
	times: string[];
	total: string;
}
