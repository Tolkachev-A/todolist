import { useMemo } from 'react';

import { useDispatch } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';

import { AppDispatchType } from './types';

export const useAppDispatch = (): any => useDispatch<AppDispatchType>();

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T): any {
  const dispatch = useAppDispatch();

  const boundActions = useMemo(() => {
    return bindActionCreators(actions, dispatch);
  }, []);

  return boundActions;
}
