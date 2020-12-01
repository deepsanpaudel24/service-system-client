import axios from "axios"
// Action Types
export const CONFIRM_COMPLETION_LOADING = 'CONFIRM_COMPLETION_LOADING'
export const CONFIRM_COMPLETION_FAIL =   'CONFIRM_COMPLETION_FAIL'
export const CONFIRM_COMPLETION_SERVER_FAIL =   'CONFIRM_COMPLETION_SERVER_FAIL'
export const CONFIRM_COMPLETION_SUCCESS = 'CONFIRM_COMPLETION_SUCCESS'
export const CONFIRM_COMPLETION_RESPONSE_RESET = 'CONFIRM_COMPLETION_RESPONSE_RESET'

export const ConfirmCompletionDispatcher = (data) => async dispatch => {
    try {
        dispatch({
            type: "CONFIRM_COMPLETION_SUCCESS",
            payload: data,
        })

    }
    catch (e) {
        dispatch({
            type: "CONFIRM_COMPLETION_FAIL"
        })
    }
}

export const ConfirmCompletionDispatcherResponseReset = () =>async dispatch  => {
    dispatch({
        type: "CONFIRM_COMPLETION_RESPONSE_RESET"
    })
}
