import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import {AxiosError} from 'axios'

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (e: Error | AxiosError, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    const error = e as Error | AxiosError
    dispatch(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
    dispatch(setAppStatusAC('failed'))
}
