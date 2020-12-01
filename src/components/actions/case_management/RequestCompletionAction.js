import axios from "axios"
// Action Types
export const REQUEST_COMPLETION_LOADING = 'REQUEST_COMPLETION_LOADING'
export const REQUEST_COMPLETION_FAIL =   'REQUEST_COMPLETION_FAIL'
export const REQUEST_COMPLETION_SERVER_FAIL =   'REQUEST_COMPLETION_SERVER_FAIL'
export const REQUEST_COMPLETION_SUCCESS = 'REQUEST_COMPLETION_SUCCESS'
export const REQUEST_COMPLETION_RESPONSE_RESET = 'REQUEST_COMPLETION_RESPONSE_RESET'

export const RequestCompletionDispatcher = (urlvalues) => async dispatch => {
    try {
        dispatch({
            type: "REQUEST_COMPLETION_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/request-case-completion/' + urlvalues,
          }
        axios(config)
        .then((res) => {
            dispatch({
                type: "REQUEST_COMPLETION_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "REQUEST_COMPLETION_SERVER_FAIL",
                serverErrorMsg: ""
            })
        })
    }
    catch (e) {
        dispatch({
            type: "REQUEST_COMPLETION_FAIL"
        })
    }
}

export const RequestCompletionDispatcherResponseReset = () =>async dispatch  => {
    dispatch({
        type: "REQUEST_COMPLETION_RESPONSE_RESET"
    })
}
