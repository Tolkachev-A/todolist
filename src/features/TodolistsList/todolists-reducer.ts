import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {AppThunk} from '../../app/store';
import {AxiosError} from 'axios';
import {handleServerNetworkError} from '../../utils/error-utils';
import {clearData, fetchTasksTC} from './tasks-reducer';

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id != action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]

        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case 'TASK-CLEAR-DATA':
            return []
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)

// thunks
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await todolistsAPI.getTodolists()
        dispatch(setTodolistsAC(res.data))
        res.data.forEach(tl => dispatch(fetchTasksTC(tl.id)))

    } catch (e) {
        handleServerNetworkError(e as Error | AxiosError, dispatch)

    }
}

export const removeTodolistTC = (todolistId: string): AppThunk => async dispatch => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatusAC('loading'))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    try {
        const res = await todolistsAPI.deleteTodolist(todolistId)
        dispatch(removeTodolistAC(todolistId))
        //скажем глобально приложению, что асинхронная операция завершена
        dispatch(setAppStatusAC('succeeded'))
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)
    }
}

export const addTodolistTC = (title: string): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await todolistsAPI.createTodolist(title)
        dispatch(addTodolistAC(res.data.data.item))
        dispatch(setAppStatusAC('succeeded'))
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)
    }
}

export const changeTodolistTitleTC = (id: string, title: string): AppThunk => async dispatch => {
    try {
        const res = await todolistsAPI.updateTodolist(id, title)
        dispatch(changeTodolistTitleAC(id, title))
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)
    }
}


// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type TodolistActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | ReturnType<typeof clearData>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

