import { REPLY_CASE_REQUEST_LOADING, REPLY_CASE_REQUEST_FAIL, REPLY_CASE_REQUEST_SERVER_FAIL , REPLY_CASE_REQUEST_SUCCESS} from "../actions/case_management/ReplyCaseRequestAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const ReplyCaseRequestReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case REPLY_CASE_REQUEST_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case REPLY_CASE_REQUEST_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case REPLY_CASE_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case REPLY_CASE_REQUEST_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default ReplyCaseRequestReducer