import axios from "axios"
// Action Types
export const ADD_CUSTOM_TASK_LOADING = 'ADD_CUSTOM_TASK_LOADING'
export const ADD_CUSTOM_TASK_FAIL =   'ADD_CUSTOM_TASK_FAIL'
export const ADD_CUSTOM_TASK_SERVER_FAIL =   'ADD_EMPLOYEE_SERVER_FAIL'
export const ADD_CUSTOM_TASK_SUCCESS = 'ADD_CUSTOM_TASK_SUCCESS'
export const ADD_CUSTOM_TASK_RESPONSE_RESET = 'ADD_CUSTOM_TASK_RESPONSE_RESET'

export const AddCustomTaskDispacther = (data) => async dispatch => {
    try {
        dispatch({
            type: "ADD_CUSTOM_TASK_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/tasks',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "ADD_CUSTOM_TASK_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "ADD_CUSTOM_TASK_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "ADD_CUSTOM_TASK_FAIL"
        })
    }
}

export const AddCustomTaskResponseReset = () => async dispatch => {
    dispatch({
        type: "ADD_CUSTOM_TASK_RESPONSE_RESET"
    })
}
