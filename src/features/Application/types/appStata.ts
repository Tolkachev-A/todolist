import { Nullable } from 'api/types';
import { RequestStatusType } from 'features/Application/types';

export type AppStateType = {
  status: RequestStatusType;
  error: Nullable<string>;
  isInitialized: boolean;
};
