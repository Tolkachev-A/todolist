import {AppThunk} from './store';
import {authAPI} from '../api/todolists-api';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {setIsLoggedIn} from '../features/login/auth-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppIsInitialized(state, action: PayloadAction<{ value: boolean }>) {
            state.isInitialized = action.payload.value
        },
    }
})
export const appReducer = slice.reducer
export const {setAppError, setAppStatus, setAppIsInitialized} = slice.actions

// export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case 'APP/IS-INITIALIZED':
//             return {...state, isInitialized: action.value}
//         default:
//             return {...state}
//     }
// }

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    isInitialized: boolean
}
//action
// export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
// export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
// export const setAppIsInitializedAC = (value: boolean) => ({type: 'APP/IS-INITIALIZED', value} as const)
//thunk
export const initializeAppTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setAppIsInitialized({value: true}));
            dispatch(setIsLoggedIn({value: true}));
        } else {
            handleServerAppError(res.data, dispatch);
            dispatch(setAppIsInitialized({value: true}));
        }
    } catch (e: unknown) {
        handleServerNetworkError(e as Error | AxiosError, dispatch)
    } finally {
        dispatch(setAppStatus({status: 'idle'}))
    }

}
//type
export type SetAppErrorActionType = ReturnType<typeof slice.actions.setAppError>
export type SetAppStatusActionType = ReturnType<typeof slice.actions.setAppStatus>

export type AppReducerActionsType =
    | SetAppErrorActionType
    | SetAppStatusActionType
    | ReturnType<typeof slice.actions.setAppIsInitialized>
