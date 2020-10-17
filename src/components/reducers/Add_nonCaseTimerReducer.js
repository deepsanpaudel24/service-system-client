import { ADD_NON_CASE_TIMER_LOADING, ADD_NON_CASE_TIMER_FAIL, ADD_NON_CASE_TIMER_SERVER_FAIL ,ADD_NON_CASE_TIMER_SUCCESS, ADD_NON_CASE_TIMER_RESPONSE_RESET} from "../actions/Timer_management/AddNonCaseTimerAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const AddNonCaseTimerReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case ADD_NON_CASE_TIMER_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case ADD_NON_CASE_TIMER_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case ADD_NON_CASE_TIMER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
                emailConfirmationMessage: "Check your email for confirmation",
                addNext: action.addNext
            }
        case ADD_NON_CASE_TIMER_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case ADD_NON_CASE_TIMER_RESPONSE_RESET:
            return {
                ...state,
                loading: false,
                data: [],
                errorMsg: "",
                serverErrorMsg: "",
                emailConfirmationMessage: ""
                
            }
        default:
            return state
    }
}

export default AddNonCaseTimerReducer