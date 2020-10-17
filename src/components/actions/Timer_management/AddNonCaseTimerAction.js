import axios from "axios"
// Action Types
export const ADD_NON_CASE_TIMER_LOADING = 'ADD_NON_CASE_TIMER_LOADING'
export const ADD_NON_CASE_TIMER_FAIL =   'ADD_NON_CASE_TIMER_FAIL'
export const ADD_NON_CASE_TIMER_SERVER_FAIL =   'ADD_NON_CASE_TIMER_SERVER_FAIL'
export const ADD_NON_CASE_TIMER_SUCCESS = 'ADD_NON_CASE_TIMER_SUCCESS'
export const ADD_NON_CASE_TIMER_RESPONSE_RESET = 'ADD_NON_CASE_TIMER_RESPONSE_RESET'


export const AddNonCaseTimerDispatcher = (data, addNext) => async dispatch => {
    try {
        dispatch({
            type: "ADD_NON_CASE_TIMER_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/non-case-timer',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "ADD_NON_CASE_TIMER_SUCCESS",
                payload: res.data,
                addNext: addNext
            })

        })
        .catch((error) => {
            dispatch({
                type: "ADD_NON_CASE_TIMER_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "ADD_NON_CASE_TIMER_FAIL"
        })
    }
}

export const AddNonCaseTimerResponseReset = () => async dispatch => {
    dispatch({
        type: "ADD_NON_CASE_TIMER_RESPONSE_RESET"
    })
}
