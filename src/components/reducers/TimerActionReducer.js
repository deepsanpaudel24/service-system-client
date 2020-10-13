import { START_TIMER_FAIL, START_TIMER_SUCCESS } from "../actions/Timer_management/TimerAction";

const DefaultState = {
    data: [],
    errorMsg: "",
}

const TimerActionReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case START_TIMER_FAIL: 
            return {
                ...state,
                errorMsg: "Something went wrong"
            }
        case START_TIMER_SUCCESS:
            return {
                ...state,
                data: action.payload,
                errorMsg: "",
            }
        default:
            return state
    }
}

export default TimerActionReducer