import React, { useCallback, useEffect } from 'react';

import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { Todolist } from './Todolist/Todolist';

import { todolistsActions } from './index';

import { AddItemForm, AddItemFormSubmitHelperType } from 'components/AddItemForm';
import { selectIsLoggedIn } from 'features/Application/selectors';
import { selectTasks, selectTodolists } from 'features/Application/selectors/selectors';
import { useActions, useAppDispatch } from 'utils/redux-utils';

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const dispatch = useAppDispatch();

  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { fetchTodolistsTC } = useActions(todolistsActions);

  const addTodolistCallback = useCallback(
    async (title: string, helper: AddItemFormSubmitHelperType) => {
      const thunk = todolistsActions.addTodolistTC(title);
      const resultAction = await dispatch(thunk);

      if (todolistsActions.addTodolistTC.rejected.match(resultAction)) {
        if (resultAction.payload?.errors?.length) {
          const errorMessage = resultAction.payload?.errors[0];

          helper.setError(errorMessage);
        } else {
          helper.setError('Some error occured');
        }
      } else {
        helper.setTitle('');
      }
    },
    [],
  );

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    fetchTodolistsTC();
  }, []);

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid
        container
        spacing={3}
        style={{
          flexWrap: 'nowrap',
          overflowX: 'scroll',
          minHeight: 'calc(100vh - 64px - 96px)',
        }}
      >
        {todolists.map(tl => {
          const allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <div style={{ width: '300px' }}>
                <Todolist todolist={tl} tasks={allTodolistTasks} demo={demo} />
              </div>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
