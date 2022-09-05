import {authAPI, FieldErrorType, LoginDataType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError} from 'axios';
import {AppThunk} from '../../app/store';
import {clearData} from '../TodolistsList/tasks-reducer';
import {SetAppErrorActionType, setAppStatus, SetAppStatusActionType} from '../../app/app-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

//thunk
export const loginTC = createAsyncThunk<undefined, LoginDataType, { rejectValue: { errors: string[], fieldsError?: FieldErrorType[] } }>('auth/login', async (data, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsError: res.data.fieldsErrors})
        }
    } catch (e) {
        const errors = e as AxiosError
        handleServerNetworkError(e as Error | AxiosError, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [errors.message], fieldsError: undefined})
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'idle'}))
    }
})
export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(clearData())
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (e: unknown) {
        handleServerNetworkError(e as Error | AxiosError, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})

export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: (builder => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true
        }),
            builder.addCase(logoutTC.fulfilled, (state) => {
                state.isLoggedIn = false
            })
    })
})

export const authReducer = slice.reducer
export const {setIsLoggedIn} = slice.actions

// types
export type AuthActionsType =
    ReturnType<typeof slice.actions.setIsLoggedIn>
    | SetAppStatusActionType
    | SetAppErrorActionType
