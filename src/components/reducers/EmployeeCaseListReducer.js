import { EMPLOYEE_CASE_LIST_STORAGE_FAIL, EMPLOYEE_CASE_LIST_STORAGE_SUCCESS, EMPLOYEE_CASE_LIST_STORAGE_RESPONSE_RESET} from "../actions/case_management/EmployeeCasesListStorage"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const EmployeeCaseListReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case EMPLOYEE_CASE_LIST_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case EMPLOYEE_CASE_LIST_STORAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case EMPLOYEE_CASE_LIST_STORAGE_RESPONSE_RESET:
            return {
                ...state,
                loading: false,
                data: [],
                errorMsg: "",
                serverErrorMsg: ""
            }
        default:
            return state
    }
}

export default EmployeeCaseListReducer