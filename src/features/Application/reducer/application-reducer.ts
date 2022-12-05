import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authApi } from 'api';
import { InitialStateType } from 'features/Application/types';
import { authActions } from 'features/Auth';
import { appActions } from 'features/CommonActions/App';

const initializeApp = createAsyncThunk(
  'application/initializeApp',
  async (param, { dispatch }) => {
    const res = await authApi.me();

    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ value: true }));
    }
  },
);

export const asyncActions = {
  initializeApp,
};

export const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle',
    error: null,
    isInitialized: false,
  } as InitialStateType,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(initializeApp.fulfilled, state => {
        state.isInitialized = true;
      })
      .addCase(appActions.setAppStatus, (state, action) => {
        state.status = action.payload.status;
      })
      .addCase(appActions.setAppError, (state, action) => {
        state.error = action.payload.error;
      });
  },
});
