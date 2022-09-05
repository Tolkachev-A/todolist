import {
    addTodolist,
    AddTodolistActionType,
    removeTodolist,
    RemoveTodolistActionType,
    setTodolists,
    SetTodolistsActionType
} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {AppRootStateType} from '../../app/store'
import {setAppStatus} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {AxiosError} from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: TasksStateType = {}

//thunks
export const fetchTasks = createAsyncThunk('tasks/fetch-tasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        return {tasks, todolistId}
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, thunkAPI.dispatch)
    }
})
export const removeTaskTC = createAsyncThunk('tasks/remove-tasks', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
    try {
        await todolistsAPI.deleteTask(param.todolistId, param.taskId)
        return param
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, thunkAPI.dispatch)
    }
})
export const addTaskTC = createAsyncThunk('task/add-task', async (param: { title: string, todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {task}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
        }
    } catch (e) {
        handleServerNetworkError(e as Error | AxiosError, thunkAPI.dispatch)
    }
})
export const updateTask = createAsyncThunk('task/update-task',
    async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }, thunkAPI) => {
        const state = thunkAPI.getState() as AppRootStateType
        const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
        if (!task) {
            return thunkAPI.rejectWithValue({})
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...param.domainModel
        }

        try {
            const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel)
            if (res.data.resultCode === 0) {
                return param
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch);
                return thunkAPI.rejectWithValue({})
            }
        } catch (e) {
            handleServerNetworkError(e as Error | AxiosError, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    })


const slise = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        clearData(state, action: PayloadAction) {
            state = {}
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolist, (state, action) => {
            state[action.payload.todolist.id] = []
        }),
            builder.addCase(removeTodolist, (state, action) => {
                delete state[action.payload.id]
            }),
            builder.addCase(setTodolists, (state, action) => {
                action.payload.todolists.forEach((tl: { id: string | number }) => {
                    state[tl.id] = []
                })
            }),
            builder.addCase(fetchTasks.fulfilled, (state, action) => {
                if (action.payload) {
                    state[action.payload.todolistId] = action.payload.tasks
                }
            }),
            builder.addCase(removeTaskTC.fulfilled, (state, action) => {
                if (action.payload) {
                    const idnex = state[action.payload.todolistId].findIndex(task => task.id === action.payload?.taskId)
                    if (idnex !== -1) {
                        state[action.payload.todolistId].splice(idnex, 1)
                    }
                }
            })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            }
        }),
            builder.addCase(updateTask.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId)
                const tasks = state[action.payload.todolistId]
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })
    }
})

//action
export const {clearData} = slise.actions

export const tasksReducer = slise.reducer

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type TaskActionsType =
// | ReturnType<typeof removeTaskTC.fulfilled>
//     | ReturnType<typeof addTaskTC.fulfilled>
//     | ReturnType<typeof updateTask.fulfilled>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    // | ReturnType<typeof fetchTasks.fulfilled>
    | ReturnType<typeof clearData>

