import { TaskPriorities, TaskStatusesType } from 'api/types/types';
import {
  slice,
  TasksStateType,
  asyncActions,
} from 'features/TodolistsList/reducer/tasks-reducer';
import { asyncActions as todolistsAsyncActions } from 'features/TodolistsList/reducer/todolists-reducer';

const { reducer: tasksReducer } = slice;
const { addTodolistTC, fetchTodolistsTC, removeTodolistTC } = todolistsAsyncActions;
const { removeTask, addTask, updateTask, fetchTasks } = asyncActions;

let startState: TasksStateType = {};

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: '1',
        title: 'CSS',
        status: TaskStatusesType.New,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: '2',
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
      {
        id: '3',
        title: 'React',
        status: TaskStatusesType.New,
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
        id: '1',
        title: 'bread',
        status: TaskStatusesType.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: '2',
        title: 'milk',
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
        id: '3',
        title: 'tea',
        status: TaskStatusesType.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
  };
});

test('correct task should be deleted from correct array', () => {
  const param = { taskId: '2', todolistId: 'todolistId2' };
  const action = removeTask.fulfilled(param, 'requestId', param);

  const endState = tasksReducer(startState, action);

  expect(endState.todolistId1.length).toBe(3);
  expect(endState.todolistId2.length).toBe(2);
  expect(endState.todolistId2.every(t => t.id != '2')).toBeTruthy();
});
test('correct task should be added to correct array', () => {
  // const action = addTaskAC("juce", "todolistId2");
  const task = {
    todoListId: 'todolistId2',
    title: 'juce',
    status: TaskStatusesType.New,
    addedDate: '',
    deadline: '',
    description: '',
    order: 0,
    priority: 0,
    startDate: '',
    id: 'id exists',
  };
  const action = addTask.fulfilled(task, 'requestId', {
    title: task.title,
    todolistId: task.todoListId,
  });

  const endState = tasksReducer(startState, action);

  expect(endState.todolistId1.length).toBe(3);
  expect(endState.todolistId2.length).toBe(4);
  expect(endState.todolistId2[0].id).toBeDefined();
  expect(endState.todolistId2[0].title).toBe('juce');
  expect(endState.todolistId2[0].status).toBe(TaskStatusesType.New);
});
test('status of specified task should be changed', () => {
  const updateModel = {
    taskId: '2',
    model: { status: TaskStatusesType.New },
    todolistId: 'todolistId2',
  };
  const action = updateTask.fulfilled(updateModel, 'requestId', updateModel);

  const endState = tasksReducer(startState, action);

  expect(endState.todolistId1[1].status).toBe(TaskStatusesType.Completed);
  expect(endState.todolistId2[1].status).toBe(TaskStatusesType.New);
});
test('title of specified task should be changed', () => {
  const updateModel = {
    taskId: '2',
    model: { title: 'yogurt' },
    todolistId: 'todolistId2',
  };
  const action = updateTask.fulfilled(updateModel, 'requestId', updateModel);

  const endState = tasksReducer(startState, action);

  expect(endState.todolistId1[1].title).toBe('JS');
  expect(endState.todolistId2[1].title).toBe('yogurt');
  expect(endState.todolistId2[0].title).toBe('bread');
});
test('new array should be added when new todolist is added', () => {
  const payload = {
    todolist: {
      id: 'blabla',
      title: 'new todolist',
      order: 0,
      addedDate: '',
    },
  };
  const action = addTodolistTC.fulfilled(payload, 'requestId', payload.todolist.title);

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2');

  if (!newKey) {
    throw Error('new key should be added');
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});
test('propertry with todolistId should be deleted', () => {
  const action = removeTodolistTC.fulfilled(
    { id: 'todolistId2' },
    'requestId',
    'todolistId2',
  );

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState.todolistId2).not.toBeDefined();
});

test('empty arrays should be added when we set todolists', () => {
  const payload = {
    todolists: [
      { id: '1', title: 'title 1', order: 0, addedDate: '' },
      { id: '2', title: 'title 2', order: 0, addedDate: '' },
    ],
  };
  const action = fetchTodolistsTC.fulfilled(payload, 'requestId', undefined);

  const endState = tasksReducer({}, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState['1']).toBeDefined();
  expect(endState['2']).toBeDefined();
});
test('tasks should be added for todolist', () => {
  // const action = setTasksAC({tasks: startState['todolistId1'], todolistId: 'todolistId1'})
  const action = fetchTasks.fulfilled(
    {
      tasks: startState.todolistId1,
      todolistId: 'todolistId1',
    },
    'requestId',
    'todolistId1',
  );

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action,
  );

  expect(endState.todolistId1.length).toBe(3);
  expect(endState.todolistId2.length).toBe(0);
});
