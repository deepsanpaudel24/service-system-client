import { REQUEST_COMPLETION_LOADING, REQUEST_COMPLETION_FAIL, REQUEST_COMPLETION_SERVER_FAIL , REQUEST_COMPLETION_SUCCESS, REQUEST_COMPLETION_RESPONSE_RESET} from "../actions/case_management/RequestCompletionAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const RequestCompletionReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case REQUEST_COMPLETION_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case REQUEST_COMPLETION_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case REQUEST_COMPLETION_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case REQUEST_COMPLETION_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case REQUEST_COMPLETION_RESPONSE_RESET:
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

export default RequestCompletionReducer