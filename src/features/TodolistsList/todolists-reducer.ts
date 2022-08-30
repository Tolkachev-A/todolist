import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatus} from '../../app/app-reducer'
import {AppThunk} from '../../app/store';
import {AxiosError} from 'axios';
import {handleServerNetworkError} from '../../utils/error-utils';
import {clearData, fetchTasksTC} from './tasks-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {action} from '@storybook/addon-actions';

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        removeTodolist(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) {
                state.splice(index, 1)
            }

        },
        addTodolist(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitle(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
        setTodolists(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
    },
    extraReducers: (builder => {
        builder.addCase(clearData, (state, action) => {
            state = []
        })
    })
})
export const todolistsReducer = slice.reducer
export const {
    removeTodolist,
    addTodolist,
    changeTodolistTitle,
    changeTodolistFilter,
    changeTodolistEntityStatus,
    setTodolists
} = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTodolists()
        dispatch(setTodolists({todolists: res.data}))
        res.data.forEach(tl => dispatch(fetchTasksTC(tl.id)))

    } catch (e) {
        handleServerNetworkError(e as Error | AxiosError, dispatch)

    }
}

export const removeTodolistTC = (todolistId: string): AppThunk => async dispatch => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatus({status: 'loading'}))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTodolist(todolistId)
        dispatch(removeTodolist({id: todolistId}))
        //скажем глобально приложению, что асинхронная операция завершена
        dispatch(setAppStatus({status: 'succeeded'}))
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)
    }
}

export const addTodolistTC = (title: string): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTodolist(title)
        dispatch(addTodolist({todolist: res.data.data.item}))
        dispatch(setAppStatus({status: 'succeeded'}))
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)
    }
}

export const changeTodolistTitleTC = (id: string, title: string): AppThunk => async dispatch => {
    try {
        const res = await todolistsAPI.updateTodolist(id, title)
        dispatch(changeTodolistTitle({id: id, title: title}))
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)
    }
}


// types
export type AddTodolistActionType = ReturnType<typeof addTodolist>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolist>;
export type SetTodolistsActionType = ReturnType<typeof setTodolists>;
export type TodolistActionsType =
    | ReturnType<typeof removeTodolist>
    | ReturnType<typeof addTodolist>
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof changeTodolistFilter>
    | ReturnType<typeof setTodolists>
    | ReturnType<typeof changeTodolistEntityStatus>
    | ReturnType<typeof clearData>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

