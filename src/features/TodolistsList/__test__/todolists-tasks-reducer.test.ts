import { TodolistType } from 'api/types/types';
import { todolistsActions } from 'features/TodolistsList/index';
import {
  slice as tasksSlice,
  TasksStateType,
} from 'features/TodolistsList/reducer/tasks-reducer';
import {
  TodolistDomainType,
  slice,
} from 'features/TodolistsList/reducer/todolists-reducer';

const todolistsReducer = slice.reducer;
const tasksReducer = tasksSlice.reducer;

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  const todolist: TodolistType = {
    title: 'new todolist',
    id: 'any id',
    addedDate: '',
    order: 0,
  };

  const action = todolistsActions.addTodolistTC.fulfilled(
    { todolist },
    'requestId',
    todolist.title,
  );

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
