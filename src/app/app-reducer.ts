import {AppThunk} from './store';
import {authAPI} from '../api/todolists-api';
import {setIsLoggedInAC} from '../features/login/auth-reducer';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/IS-INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return {...state}
    }
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    isInitialized: boolean
}
//action
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppIsInitializedAC = (value: boolean) => ({type: 'APP/IS-INITIALIZED', value} as const)
//thunk
export const initializeAppTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setAppIsInitializedAC(true));
            dispatch(setIsLoggedInAC(true));
        } else {
            handleServerAppError(res.data, dispatch);
            dispatch(setAppIsInitializedAC(true));
        }
    } catch (e: unknown) {
        handleServerNetworkError(e as Error | AxiosError, dispatch)
    } finally {
        dispatch(setAppStatusAC('idle'))
    }

}
//type
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>

export type AppReducerActionsType =
    | SetAppErrorActionType
    | SetAppStatusActionType
    | ReturnType<typeof setAppIsInitializedAC>
