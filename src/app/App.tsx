import React, { ReactElement, useCallback, useEffect } from 'react';

import './App.css';
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';

import { ErrorSnackbar } from 'components/ErrorSnackbar';
import { appActions } from 'features/Application';
import {
  selectIsInitialized,
  selectIsLoggedIn,
  selectStatus,
} from 'features/Application/selectors';
import { authActions, Login } from 'features/Auth';
import { TodolistsList } from 'features/TodolistsList';
import { useActions } from 'utils/redux-utils';

type PropsType = {
  demo?: boolean;
};

const App = ({ demo = false }: PropsType): ReactElement => {
  const status = useSelector(selectStatus);
  const isInitialized = useSelector(selectIsInitialized);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { logout } = useActions(authActions);
  const { initializeApp } = useActions(appActions);

  useEffect(() => {
    if (!demo) {
      initializeApp();
    }
  }, []);

  const onLogoutClick = useCallback(() => {
    logout();
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={onLogoutClick}>
              Log out
            </Button>
          )}
        </Toolbar>
        {status === 'loading' && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Route exact path="/" render={() => <TodolistsList demo={demo} />} />
        <Route path="/login" render={() => <Login />} />
      </Container>
    </div>
  );
};

export default App;
