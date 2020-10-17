import { FORWARD_CASE_REQUEST_LOADING, FORWARD_CASE_REQUEST_FAIL, FORWARD_CASE_REQUEST_SERVER_FAIL , FORWARD_CASE_REQUEST_SUCCESS, FORWARD_CASE_RESPONSE_RESET} from "../actions/case_management/ForwardCaseRequestAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const ForwardCaseRequestReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case FORWARD_CASE_REQUEST_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case FORWARD_CASE_REQUEST_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case FORWARD_CASE_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case FORWARD_CASE_REQUEST_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case FORWARD_CASE_RESPONSE_RESET:
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

export default ForwardCaseRequestReducer