import { REMOVE_SERVICE_LOADING, REMOVE_SERVICE_FAIL, REMOVE_SERVICE_SERVER_FAIL ,REMOVE_SERVICE_SUCCESS, REMOVE_SERVICE_RESPONSE_RESET} from "../actions/service_management/RemoveServiceAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const ServiceRemoveReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case REMOVE_SERVICE_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case REMOVE_SERVICE_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case REMOVE_SERVICE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case REMOVE_SERVICE_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case REMOVE_SERVICE_RESPONSE_RESET:
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

export default ServiceRemoveReducer