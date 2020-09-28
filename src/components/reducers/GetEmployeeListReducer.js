import { LIST_EMPLOYEE_LOADING, LIST_EMPLOYEE_FAIL, LIST_EMPLOYEE_SERVER_FAIL ,LIST_EMPLOYEE_SUCCESS} from "../actions/employee_management/GetEmployeesAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
}

const GetEmployeeListReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case LIST_EMPLOYEE_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case LIST_EMPLOYEE_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case LIST_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case LIST_EMPLOYEE_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default GetEmployeeListReducer