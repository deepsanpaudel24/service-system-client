import axios from "axios"
// Action Types
export const UPDATE_NON_CASE_TIMER_LOADING = 'UPDATE_NON_CASE_TIMER_LOADING'
export const UPDATE_NON_CASE_TIMER_FAIL =   'UPDATE_NON_CASE_TIMER_FAIL'
export const UPDATE_NON_CASE_TIMER_SERVER_FAIL =   'UPDATE_NON_CASE_TIMER_SERVER_FAIL'
export const UPDATE_NON_CASE_TIMER_SUCCESS = 'UPDATE_NON_CASE_TIMER_SUCCESS'
export const UPDATE_NON_CASE_TIMER_RESPONSE_RESET = 'UPDATE_NON_CASE_TIMER_RESPONSE_RESET'


export const UpdateNonCaseTimerDispatcher = (data, timerId) => async dispatch => {
    try {
        dispatch({
            type: "UPDATE_NON_CASE_TIMER_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/non-case-timer/' + timerId,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "UPDATE_NON_CASE_TIMER_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "UPDATE_NON_CASE_TIMER_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "UPDATE_NON_CASE_TIMER_FAIL"
        })
    }
}

export const UpadateNonCaseTimerResponseReset = () => async dispatch => {
    dispatch({
        type: "UPDATE_NON_CASE_TIMER_RESPONSE_RESET"
    })
}
