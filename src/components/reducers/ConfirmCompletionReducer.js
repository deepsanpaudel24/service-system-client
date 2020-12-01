import { CONFIRM_COMPLETION_LOADING, CONFIRM_COMPLETION_FAIL, CONFIRM_COMPLETION_SERVER_FAIL , CONFIRM_COMPLETION_SUCCESS, CONFIRM_COMPLETION_RESPONSE_RESET} from "../actions/case_management/ConfirmCompletionAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const ConfirmCompletionReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CONFIRM_COMPLETION_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case CONFIRM_COMPLETION_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CONFIRM_COMPLETION_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case CONFIRM_COMPLETION_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case CONFIRM_COMPLETION_RESPONSE_RESET:
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

export default ConfirmCompletionReducer