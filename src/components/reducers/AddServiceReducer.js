import { ADD_SERVICE_LOADING, ADD_SERVICE_FAIL, ADD_SERVICE_SERVER_FAIL ,ADD_SERVICE_SUCCESS, ADD_SERVICE_RESPONSE_RESET} from "../actions/service_management/AddServiceAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const ServiceRegisterReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case ADD_SERVICE_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case ADD_SERVICE_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case ADD_SERVICE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
                addNext: action.addNext
            }
        case ADD_SERVICE_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case ADD_SERVICE_RESPONSE_RESET:
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

export default ServiceRegisterReducer