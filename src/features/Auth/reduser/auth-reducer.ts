import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { authApi } from 'api';
import { FieldErrorType, LoginParamsType } from 'api/types/types';
import { appActions } from 'features/CommonActions/App';
import {
  handleAsyncServerAppError,
  handleAsyncServerNetworkError,
} from 'utils/error-utils';

const { setAppStatus } = appActions;

export const login = createAsyncThunk<
  undefined,
  LoginParamsType,
  { rejectValue: { errors: Array<string>; fieldsErrors?: Array<FieldErrorType> } }
>('auth/login', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
  try {
    const res = await authApi.login(param);

    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));

      return;
    }

    return handleAsyncServerAppError(res.data, thunkAPI);
  } catch (error) {
    return handleAsyncServerNetworkError(error as AxiosError, thunkAPI);
  }
});
export const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
  try {
    const res = await authApi.logout();

    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));

      return;
    }

    return handleAsyncServerAppError(res.data, thunkAPI);
  } catch (error) {
    return handleAsyncServerNetworkError(error as AxiosError, thunkAPI);
  }
});

export const asyncActions = {
  login,
  logout,
};

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, state => {
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, state => {
        state.isLoggedIn = false;
      });
  },
});

export const authReducer = slice.reducer;
export const { setIsLoggedIn } = slice.actions;
