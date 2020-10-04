import { REMOVE_EMPLOYEE_LOADING, REMOVE_EMPLOYEE_FAIL, REMOVE_EMPLOYEE_SERVER_FAIL ,REMOVE_EMPLOYEE_SUCCESS, REMOVE_EMPLOYEE_RESPONSE_RESET} from "../actions/employee_management/RemoveEmployeeAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const EmployeeRemoveReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case REMOVE_EMPLOYEE_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case REMOVE_EMPLOYEE_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case REMOVE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
                emailConfirmationMessage: "Check your email for confirmation",
                REMOVENext: action.REMOVENext
            }
        case REMOVE_EMPLOYEE_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case REMOVE_EMPLOYEE_RESPONSE_RESET:
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

export default EmployeeRemoveReducer