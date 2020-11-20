import { CREATE_CLIENT_CASE_LOADING, CREATE_CLIENT_CASE_FAIL, CREATE_CLIENT_CASE_SERVER_FAIL , CREATE_CLIENT_CASE_SUCCESS, CREATE_CLIENT_CASE_RESPONSE_RESET} from "../actions/case_management/NewCaseRequestAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const CreateClientCaseReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CREATE_CLIENT_CASE_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case CREATE_CLIENT_CASE_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CREATE_CLIENT_CASE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case CREATE_CLIENT_CASE_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case CREATE_CLIENT_CASE_RESPONSE_RESET:
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

export default CreateClientCaseReducer