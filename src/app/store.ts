import {TodolistActionsType, todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {appReducer, AppReducerActionsType} from './app-reducer'
import {configureStore, ThunkAction, ThunkDispatch} from '@reduxjs/toolkit';
import {AuthActionsType, authReducer} from '../features/login/auth-reducer';
import {TaskActionsType, tasksReducer} from '../features/TodolistsList/tasks-reducer';


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
// непосредственно создаём store
export const store = configureStore({
    reducer: rootReducer,
})


export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>
//type
type AppActionsType = TaskActionsType | AppReducerActionsType | TodolistActionsType | AuthActionsType
export type AppRootStateType = ReturnType<typeof rootReducer>




