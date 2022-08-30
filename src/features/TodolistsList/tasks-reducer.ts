import {
    addTodolist,
    AddTodolistActionType, removeTodolist,
    RemoveTodolistActionType,
    setTodolists,
    SetTodolistsActionType
} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {AppRootStateType, AppThunk} from '../../app/store'
import {setAppStatus} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {AxiosError} from 'axios';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {actions} from '@storybook/addon-actions';

const initialState: TasksStateType = {}

const slise = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTask(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const idnex = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId)
            if (idnex !== -1) {
                state[action.payload.todolistId].splice(idnex, 1)
            }
        },
        addTask(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTask(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId)
            const tasks = state[action.payload.todolistId]
            if (index !== -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTasks(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
        },
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
            })
    }
})
export const {removeTask, addTask, updateTask, setTasks, clearData} = slise.actions

export const tasksReducer = slise.reducer


//
//     case 'TASK-CLEAR-DATA':
//         return {}
//     default:
//         return state
// }
// }


// thunks
export const fetchTasksTC = (todolistId: string): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        dispatch(setTasks({tasks, todolistId}))
        dispatch(setAppStatus({status: 'succeeded'}))
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)
    }
}
export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => async dispatch => {
    try {
        const res = await todolistsAPI.deleteTask(todolistId, taskId)
        const action = removeTask({taskId, todolistId})
        dispatch(action)
    } catch (e) {
        const error = e as Error | AxiosError
        handleServerNetworkError(error, dispatch)
    }
}
export const addTaskTC = (title: string, todolistId: string): AppThunk => async dispatch => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(todolistId, title)
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            const action = addTask({task})
            dispatch(action)
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        handleServerNetworkError(e as Error | AxiosError, dispatch)
    }


}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
    async (dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        try {
            const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
            if (res.data.resultCode === 0) {
                const action = updateTask({taskId, model: domainModel, todolistId})
                dispatch(action)
            } else {
                handleServerAppError(res.data, dispatch);
            }
        } catch (e) {
            handleServerNetworkError(e as Error | AxiosError, dispatch)
        }
    }

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
    | ReturnType<typeof removeTask>
    | ReturnType<typeof addTask>
    | ReturnType<typeof updateTask>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasks>
    | ReturnType<typeof clearData>

