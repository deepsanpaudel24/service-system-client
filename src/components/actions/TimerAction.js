import axios from "axios"
// Action Types
export const ADD_TIMER_LOADING = 'ADD_TIMER_LOADING'
export const ADD_TIMER_FAIL =   'ADD_TIMER_FAIL'
export const ADD_TIMER_SERVER_FAIL =   'ADD_TIMER_SERVER_FAIL'
export const ADD_TIMER_SUCCESS = 'ADD_TIMER_SUCCESS'
export const ADD_TIMER_RESPONSE_RESET = 'ADD_TIMER_RESPONSE_RESET'

export const AddTimerDispatcher = (data) => async dispatch => {
    try {
        dispatch({
            type: "ADD_TIMER_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/timers',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "ADD_TIMER_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "ADD_TIMER_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "ADD_TIMER_FAIL"
        })
    }
}

export const AddTimerResponseReset = () => async dispatch => {
    dispatch({
        type: "ADD_TIMER_RESPONSE_RESET"
    })
}
