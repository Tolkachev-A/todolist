import React, { memo, ReactElement, useCallback, useEffect } from 'react';

import { Button, IconButton, Paper, PropTypes } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import { tasksActions, todolistsActions } from '../index';

import { Task } from './Task';

import { TaskStatusesType, TaskType } from 'api/types';
import {
  AddItemForm,
  AddItemFormSubmitHelperType,
} from 'components/AddItemForm/AddItemForm';
import { EditableSpan } from 'components/EditableSpan';
import {
  FilterValuesType,
  TodolistDomainType,
} from 'features/TodolistsList/reducer/todolists-reducer';
import { useActions, useAppDispatch } from 'utils/redux-utils';

type PropsType = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

// eslint-disable-next-line func-names
export const Todolist = memo(function ({
  demo = false,
  ...props
}: PropsType): ReactElement {
  const dispatch = useAppDispatch();

  const { fetchTasks } = useActions(tasksActions);
  const { changeTodolistFilter, removeTodolistTC, changeTodolistTitleTC } =
    useActions(todolistsActions);

  useEffect(() => {
    if (demo) {
      return;
    }
    fetchTasks(props.todolist.id);
  }, []);

  const addTaskCallback = useCallback(
    async (title: string, helper: AddItemFormSubmitHelperType) => {
      const thunk = tasksActions.addTask({ title, todolistId: props.todolist.id });
      const resultAction = await dispatch(thunk);

      if (tasksActions.addTask.rejected.match(resultAction)) {
        if (resultAction.payload?.errors?.length) {
          const errorMessage = resultAction.payload?.errors[0];

          helper.setError(errorMessage);

          return;
        }

        helper.setError('Some error occured');

        return;
      }

      helper.setTitle('');
    },
    [props.todolist.id],
  );

  const removeTodolist = (): void => {
    removeTodolistTC(props.todolist.id);
  };
  const changeTodolistTitle = useCallback(
    (title: string) => {
      changeTodolistTitleTC({ id: props.todolist.id, title });
    },
    [props.todolist.id],
  );

  const onFilterButtonClickHandler = useCallback(
    (filter: FilterValuesType) =>
      changeTodolistFilter({
        filter,
        id: props.todolist.id,
      }),
    [props.todolist.id],
  );

  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === 'active') {
    tasksForTodolist = props.tasks.filter(t => t.status === TaskStatusesType.New);
  }
  if (props.todolist.filter === 'completed') {
    tasksForTodolist = props.tasks.filter(t => t.status === TaskStatusesType.Completed);
  }

  const renderFilterButton = (
    buttonFilter: FilterValuesType,
    color: PropTypes.Color,
    text: string,
  ): ReactElement => {
    return (
      <Button
        variant={props.todolist.filter === buttonFilter ? 'outlined' : 'text'}
        onClick={() => onFilterButtonClickHandler(buttonFilter)}
        color={color}
      >
        {text}
      </Button>
    );
  };
  // @ts-ignore
  const disabledIconButton = props.todolist.entityStatus === 'loading';

  return (
    <Paper style={{ padding: '10px', position: 'relative' }}>
      <IconButton
        size="small"
        onClick={removeTodolist}
        disabled={disabledIconButton}
        style={{ position: 'absolute', right: '5px', top: '5px' }}
      >
        <Delete fontSize="small" />
      </IconButton>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitle} />
      </h3>
      <AddItemForm addItem={addTaskCallback} disabled={disabledIconButton} />
      <div>
        {tasksForTodolist.map(t => (
          <Task key={t.id} task={t} todolistId={props.todolist.id} />
        ))}
        {!tasksForTodolist.length && (
          <div style={{ padding: '10px', color: 'grey' }}>No task</div>
        )}
      </div>
      <div style={{ paddingTop: '10px' }}>
        {renderFilterButton('all', 'default', 'All')}
        {renderFilterButton('active', 'primary', 'Active')}
        {renderFilterButton('completed', 'secondary', 'Completed')}
      </div>
    </Paper>
  );
});
