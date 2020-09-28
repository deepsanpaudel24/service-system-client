import { SET_EMPLOYEE_PASSWORD_LOADING, SET_EMPLOYEE_PASSWORD_FAIL, SET_EMPLOYEE_PASSWORD_SERVER_FAIL ,SET_EMPLOYEE_PASSWORD_SUCCESS} from "../actions/employee_management/SetEmployeePasswordAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
}

const SetEmployeePasswordReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case SET_EMPLOYEE_PASSWORD_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case SET_EMPLOYEE_PASSWORD_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case SET_EMPLOYEE_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case SET_EMPLOYEE_PASSWORD_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default SetEmployeePasswordReducer