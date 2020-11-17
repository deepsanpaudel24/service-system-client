import { EMPLOYEES_LIST_STORAGE_FAIL, EMPLOYEES_LIST_STORAGE_SUCCESS, EMPLOYEES_LIST_STORAGE_RESPONSE_RESET} from "../actions/employee_management/EmployeesListStorage"

const DefaultState = {
    loading: false,
    data: [],
    total_records:0,
    errorMsg: "",
    serverErrorMsg: ""
}

const EmployeeListStorageReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case EMPLOYEES_LIST_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case EMPLOYEES_LIST_STORAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                total_records: action.total_record,
                errorMsg: ""
            }
        case EMPLOYEES_LIST_STORAGE_RESPONSE_RESET:
            return {
                ...state,
                loading: false,
                data: [],
                total_records:0,
                errorMsg: "",
                serverErrorMsg: ""
            }
        default:
            return state
    }
}

export default EmployeeListStorageReducer