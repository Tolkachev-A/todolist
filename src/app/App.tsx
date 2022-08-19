import React from 'react'
import './App.css'
import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography} from '@material-ui/core'
import {Menu, Navigation} from '@material-ui/icons'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {useSelector} from 'react-redux'
import {AppRootStateType} from './store'
import {RequestStatusType} from './app-reducer'
import { Routes,Route,Navigate } from 'react-router-dom'
import {Login} from '../features/login/Login';

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
    return (

        <div className="App">
            <ErrorSnackbar />
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
             { status === 'loading' &&  <LinearProgress /> }
            </AppBar>
            <Container fixed>

                <Routes>
                    <Route path={'/'} element={ <TodolistsList demo={demo}/>}/>
                    <Route path={'/login'} element={ <Login/>}/>
                    <Route path='*' element={<Navigate to={'/404'}/>} />
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>} />
                </Routes>
            </Container>
        </div>
    )
}

export default App
