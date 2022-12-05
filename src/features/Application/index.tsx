import { asyncActions, slice } from 'features/Application/reducer';
import * as appSelectors from 'features/Application/selectors';
import { InitialStateType as T1 } from 'features/Application/types';

const appReducer = slice.reducer;
const { actions } = slice;

const appActions = {
  ...actions,
  ...asyncActions,
};

export type RequestStatusType = T1;

export { appSelectors, appReducer, appActions };
