import { EDIT_SERVICE_LOADING, EDIT_SERVICE_FAIL, EDIT_SERVICE_SERVER_FAIL ,EDIT_SERVICE_SUCCESS, EDIT_SERVICE_RESPONSE_RESET} from "../actions/service_management/EditServiceAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const ServiceEditReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case EDIT_SERVICE_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case EDIT_SERVICE_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case EDIT_SERVICE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
                EDITNext: action.EDITNext
            }
        case EDIT_SERVICE_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case EDIT_SERVICE_RESPONSE_RESET:
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

export default ServiceEditReducer