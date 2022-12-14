import React from 'react';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { v1 } from 'uuid';

import { appReducer } from '../../features/Application';
import { authReducer } from '../../features/Auth';
import { tasksReducer, todolistsReducer } from '../../features/TodolistsList';
import { AppRootStateType, RootReducerType } from '../../utils/types';

import { TaskPriorities, TaskStatusesType } from 'api/types/types';

const rootReducer: RootReducerType = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});

const initialGlobalState: AppRootStateType = {
  todolists: [
    {
      id: 'todolistId1',
      title: 'What to learn What to learn What to learn What to learn',
      filter: 'all',
      entityStatus: 'idle',
      addedDate: '',
      order: 0,
    },
    {
      id: 'todolistId2',
      title: 'What to buy',
      filter: 'all',
      entityStatus: 'loading',
      addedDate: '',
      order: 0,
    },
  ],
  tasks: {
    todolistId1: [
      {
        id: v1(),
        title: 'HTML&CSS',
        status: TaskStatusesType.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: v1(),
        title: 'JS',
        status: TaskStatusesType.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
    todolistId2: [
      {
        id: v1(),
        title: 'Milk',
        status: TaskStatusesType.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: v1(),
        title: 'React Book',
        status: TaskStatusesType.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
  },
  app: {
    error: null,
    status: 'succeeded',
    isInitialized: true,
  },
  auth: {
    isLoggedIn: true,
  },
};

export const storyBookStore = configureStore({
  reducer: rootReducer,
  preloadedState: initialGlobalState,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware),
});

export const ReduxStoreProviderDecorator = (storyFn: any) => (
  <Provider store={storyBookStore}>{storyFn()}</Provider>
);

export const BrowserRouterDecorator = (storyFn: any) => (
  <HashRouter>{storyFn()}</HashRouter>
);
