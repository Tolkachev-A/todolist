import { createAction } from '@reduxjs/toolkit';

import { Nullable } from 'api/types';
import { RequestStatusType } from 'features/Application/types';

const setAppStatus = createAction<{ status: RequestStatusType }>(
  'appActions/setAppStatus',
);
const setAppError = createAction<{ error: Nullable<string> }>('appActions/setAppError');

export const appActions = {
  setAppStatus,
  setAppError,
};
