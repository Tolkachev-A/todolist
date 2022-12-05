import { AxiosError } from 'axios';

import { ResponseType } from 'api/types';
import { appActions } from 'features/CommonActions/App';

// BaseThunkAPI<S, E, D extends Dispatch = Dispatch, RejectedValue = undefined>
type ThunkAPIType = {
  dispatch: (action: any) => any;
  rejectWithValue: Function;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const handleAsyncServerAppError = <D>(
  data: ResponseType<D>,
  thunkAPI: ThunkAPIType,
  showError = true,
) => {
  if (showError) {
    thunkAPI.dispatch(
      appActions.setAppError({
        error: data.messages.length ? data.messages[0] : 'Some error occurred',
      }),
    );
  }
  thunkAPI.dispatch(appActions.setAppStatus({ status: 'failed' }));

  return thunkAPI.rejectWithValue({
    errors: data.messages,
    fieldsErrors: data.fieldsErrors,
  });
};

export const handleAsyncServerNetworkError = (
  error: AxiosError,
  thunkAPI: ThunkAPIType,
  showError = true,
): void => {
  if (showError) {
    thunkAPI.dispatch(
      appActions.setAppError({
        error: error.message ? error.message : 'Some error occurred',
      }),
    );
  }
  thunkAPI.dispatch(appActions.setAppStatus({ status: 'failed' }));

  return thunkAPI.rejectWithValue({ errors: [error.message], fieldsErrors: undefined });
};
