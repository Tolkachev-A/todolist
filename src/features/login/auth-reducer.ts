import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {authAPI, LoginDataType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError} from 'axios';
import {AppThunk} from '../../app/store';
import {clearData} from '../TodolistsList/tasks-reducer';

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginDataType): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e: unknown) {
        handleServerNetworkError(e as Error | AxiosError, dispatch)
    } finally {
        dispatch(setAppStatusAC('idle'))
    }

}
export const logoutTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(clearData())
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e: unknown) {
        handleServerNetworkError(e as Error | AxiosError, dispatch)
    }

}

// types
export type AuthActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType
