import { ADD_EMPLOYEE_LOADING, ADD_EMPLOYEE_FAIL, ADD_EMPLOYEE_SERVER_FAIL ,ADD_EMPLOYEE_SUCCESS, ADD_EMPLOYEE_RESPONSE_RESET} from "../actions/employee_management/AddEmployeeAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const EmployeeRegisterReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case ADD_EMPLOYEE_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case ADD_EMPLOYEE_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case ADD_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
                emailConfirmationMessage: "Check your email for confirmation",
                addNext: action.addNext
            }
        case ADD_EMPLOYEE_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case ADD_EMPLOYEE_RESPONSE_RESET:
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

export default EmployeeRegisterReducer