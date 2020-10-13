import axios from "axios"
// Action Types
export const TIMER_RUNNING_TIME_FAIL =   'TIMER_RUNNING_TIME_FAIL'
export const TIMER_RUNNING_TIME_SUCESS = 'TIMER_RUNNING_TIME_SUCESS'


export const TimerRunningTimeDispatcher = (data) => async dispatch => {
    try {
        dispatch({
            type: "TIMER_RUNNING_TIME_SUCESS",
            payload: data
        })
    }
    catch (e) {
        dispatch({
            type: "TIMER_RUNNING_TIME_FAIL"
        })
    }
}
