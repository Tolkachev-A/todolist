import React, {useEffect} from 'react'
import './App.css'
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@material-ui/core'
import {Menu} from '@material-ui/icons'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {ErrorSnackbar} from '../common/components/ErrorSnackbar/ErrorSnackbar'
import {Navigate, Route, Routes} from 'react-router-dom'
import {Login} from '../features/login/Login';
import {useAppDispatch, useAppSelector} from '../common/hooks/useDispatchAndSelector';
import {initializeAppTC} from './app-reducer';
import {logoutTC} from '../features/login/auth-reducer';

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const dispatch = useAppDispatch()
    const status = useAppSelector(state => state.app.status)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    function LogOutHandler() {
        dispatch(logoutTC())
    }

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }


    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {
                        isLoggedIn &&
                        <Button color="inherit"
                                onClick={LogOutHandler}
                        >
                            Login
                        </Button>
                    }
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>

                <Routes>
                    <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path="*" element={<Navigate to={'/404'}/>}/>
                    <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>}/>
                </Routes>
            </Container>
        </div>
    )
}

export default App
