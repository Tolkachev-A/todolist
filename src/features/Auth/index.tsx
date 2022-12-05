import { Login } from './Login';

import { asyncActions, slice } from 'features/Auth/reduser';

const authActions = {
  ...asyncActions,
  ...slice.actions,
};

const authReducer = slice.reducer;

export { Login, authActions, authReducer };
