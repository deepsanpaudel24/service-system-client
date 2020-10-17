import { ADD_TIMER_LOADING, ADD_TIMER_FAIL, ADD_TIMER_SERVER_FAIL ,ADD_TIMER_SUCCESS, ADD_TIMER_RESPONSE_RESET} from "../actions/TimerAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const AddTimerReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case ADD_TIMER_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case ADD_TIMER_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case ADD_TIMER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case ADD_TIMER_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case ADD_TIMER_RESPONSE_RESET:
            return {
                ...state,
                loading: false,
                data: [],
                errorMsg: "",
                serverErrorMsg: "",
            }
        default:
            return state
    }
}

export default AddTimerReducer