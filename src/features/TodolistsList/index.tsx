import { TodolistsList } from './TodolistsList';

import {
  todolistsAsyncActions,
  todolistsSlice,
  tasksAsyncActions,
  tasksSlice,
} from 'features/TodolistsList/reducer';

const todolistsActions = {
  ...todolistsAsyncActions,
  ...todolistsSlice.actions,
};
const tasksActions = {
  ...tasksAsyncActions,
  ...tasksSlice.actions,
};

const todolistsReducer = todolistsSlice.reducer;
const tasksReducer = tasksSlice.reducer;

export { tasksActions, todolistsActions, TodolistsList, todolistsReducer, tasksReducer };
