import {authAPI} from '../api/todolists-api';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {setIsLoggedIn} from '../features/login/auth-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';


export const initializeAppTC = createAsyncThunk('app/initializedApp', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedIn({value: true}));
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
        }
    } catch (e: unknown) {
        handleServerNetworkError(e as Error | AxiosError, thunkAPI.dispatch)
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'idle'}))
    }
})

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})
export const appReducer = slice.reducer
export const {setAppError, setAppStatus} = slice.actions


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
//type
export type SetAppErrorActionType = ReturnType<typeof slice.actions.setAppError>
export type SetAppStatusActionType = ReturnType<typeof slice.actions.setAppStatus>

export type AppReducerActionsType =
    | SetAppErrorActionType
    | SetAppStatusActionType
    | ReturnType<typeof initializeAppTC.fulfilled>
