import { UPDATE_EMPLOYEE_ROLES_LOADING, UPDATE_EMPLOYEE_ROLES_FAIL, UPDATE_EMPLOYEE_ROLES_SERVER_FAIL ,UPDATE_EMPLOYEE_ROLES_SUCCESS} from "../actions/employee_management/EmployeeRolesAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const UpdateEmployeeRolesReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case UPDATE_EMPLOYEE_ROLES_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case UPDATE_EMPLOYEE_ROLES_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case UPDATE_EMPLOYEE_ROLES_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case UPDATE_EMPLOYEE_ROLES_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default UpdateEmployeeRolesReducer