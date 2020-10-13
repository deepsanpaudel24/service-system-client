import { TIMER_RUNNING_TIME_FAIL, TIMER_RUNNING_TIME_SUCESS } from "../actions/Timer_management/TimerRunningTimeAction";

const DefaultState = {
    data: [],
    errorMsg: "",
}

const TimerRunningTimeReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case TIMER_RUNNING_TIME_FAIL: 
            return {
                ...state,
                errorMsg: "Something went wrong"
            }
        case TIMER_RUNNING_TIME_SUCESS:
            return {
                ...state,
                data: action.payload,
                errorMsg: "",
            }
        default:
            return state
    }
}

export default TimerRunningTimeReducer