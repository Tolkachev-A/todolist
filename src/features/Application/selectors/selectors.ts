import { TasksStateType } from 'features/TodolistsList/reducer/tasks-reducer';
import { TodolistDomainType } from 'features/TodolistsList/reducer/todolists-reducer';
import { AppRootStateType } from 'utils/types';

export const selectStatus = (state: AppRootStateType): string => state.app.status;

export const selectIsInitialized = (state: AppRootStateType): boolean =>
  state.app.isInitialized;

export const selectIsLoggedIn = (state: AppRootStateType): boolean =>
  state.auth.isLoggedIn;

export const selectTodolists = (state: AppRootStateType): TodolistDomainType[] =>
  state.todolists;

export const selectTasks = (state: AppRootStateType): TasksStateType => state.tasks;
