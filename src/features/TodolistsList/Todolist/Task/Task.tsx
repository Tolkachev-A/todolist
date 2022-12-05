import React, { ChangeEvent, useCallback } from 'react';

import { Checkbox, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import { TaskStatusesType, TaskType } from 'api/types/types';
import { EditableSpan } from 'components/EditableSpan';
import { tasksActions } from 'features/TodolistsList/index';
import { useActions } from 'utils/redux-utils';

type TaskPropsType = {
  task: TaskType;
  todolistId: string;
};

export const Task = React.memo((props: TaskPropsType) => {
  const { updateTask, removeTask } = useActions(tasksActions);

  const onClickHandler = useCallback(
    () => removeTask({ taskId: props.task.id, todolistId: props.todolistId }),
    [props.task.id, props.todolistId],
  );

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateTask({
        taskId: props.task.id,
        model: {
          status: e.currentTarget.checked
            ? TaskStatusesType.Completed
            : TaskStatusesType.New,
        },
        todolistId: props.todolistId,
      });
    },
    [props.task.id, props.todolistId],
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      updateTask({
        taskId: props.task.id,
        model: { title: newValue },
        todolistId: props.todolistId,
      });
    },
    [props.task.id, props.todolistId],
  );

  return (
    <div
      key={props.task.id}
      className={props.task.status === TaskStatusesType.Completed ? 'is-done' : ''}
      style={{ position: 'relative' }}
    >
      <Checkbox
        checked={props.task.status === TaskStatusesType.Completed}
        color="primary"
        onChange={onChangeHandler}
      />

      <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
      <IconButton
        size="small"
        onClick={onClickHandler}
        style={{ position: 'absolute', top: '2px', right: '2px' }}
      >
        <Delete fontSize="small" />
      </IconButton>
    </div>
  );
});
