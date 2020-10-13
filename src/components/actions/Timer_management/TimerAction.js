import axios from "axios"
// Action Types
export const START_TIMER_FAIL =   'START_TIMER_FAIL'
export const START_TIMER_SUCCESS = 'START_TIMER_SUCCESS'

export const TimerDispatcher = (data) => async dispatch => {
    try {
        dispatch({
            type: "START_TIMER_SUCCESS",
            payload: data
        })
    }
    catch (e) {
        dispatch({
            type: "START_TIMER_FAIL"
        })
    }
}
