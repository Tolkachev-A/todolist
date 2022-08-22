import {TaskActionsType, tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {TodolistActionsType, todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {applyMiddleware, combineReducers, legacy_createStore, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {appReducer, AppReducerActionsType} from './app-reducer'
import {ThunkAction, ThunkDispatch} from '@reduxjs/toolkit';
import {AuthActionsType, authReducer} from '../features/login/auth-reducer';


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// непосредственно создаём store
export const store = legacy_createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)))
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>


export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>
//type
type AppActionsType = TaskActionsType | AppReducerActionsType | TodolistActionsType | AuthActionsType



