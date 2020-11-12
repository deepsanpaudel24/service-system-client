import { EMPLOYEES_LIST_STORAGE_FAIL, EMPLOYEES_LIST_STORAGE_SUCCESS} from "../actions/employee_management/EmployeesListStorage"

const DefaultState = {
    loading: false,
    data: [],
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
                errorMsg: ""
            }
        default:
            return state
    }
}

export default EmployeeListStorageReducer