import {authAPI, LoginDataType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError} from 'axios';
import {AppThunk} from '../../app/store';
import {clearData} from '../TodolistsList/tasks-reducer';
import {SetAppErrorActionType, setAppStatus, SetAppStatusActionType} from '../../app/app-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false
}

export const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})
export const authReducer = slice.reducer
export const {setIsLoggedIn} = slice.actions

// thunks
export const loginTC = (data: LoginDataType): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn({value: true}))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e: unknown) {
        handleServerNetworkError(e as Error | AxiosError, dispatch)
    } finally {
        dispatch(setAppStatus({status: 'idle'}))
    }

}
export const logoutTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(clearData())
            dispatch(setIsLoggedIn({value: true}))
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e: unknown) {
        handleServerNetworkError(e as Error | AxiosError, dispatch)
    }

}

// types
export type AuthActionsType =
    ReturnType<typeof slice.actions.setIsLoggedIn>
    | SetAppStatusActionType
    | SetAppErrorActionType
