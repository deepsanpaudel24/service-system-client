import { ADD_CLIENT_LOADING, ADD_CLIENT_FAIL, ADD_CLIENT_SERVER_FAIL ,ADD_CLIENT_SUCCESS, ADD_CLIENT_RESPONSE_RESET} from "../actions/client_management/AddClientAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const ClientRegisterReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case ADD_CLIENT_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case ADD_CLIENT_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case ADD_CLIENT_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
                emailConfirmationMessage: "Check your email for confirmation",
                addNext: action.addNext
            }
        case ADD_CLIENT_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case ADD_CLIENT_RESPONSE_RESET:
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

export default ClientRegisterReducer