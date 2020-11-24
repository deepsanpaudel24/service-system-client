// Action Types
export const EMPLOYEE_CASE_LIST_STORAGE_FAIL =   'EMPLOYEE_CASE_LIST_STORAGE_FAIL'
export const EMPLOYEE_CASE_LIST_STORAGE_SUCCESS = 'EMPLOYEE_CASE_LIST_STORAGE_SUCCESS'
export const EMPLOYEE_CASE_LIST_STORAGE_RESPONSE_RESET = 'EMPLOYEE_CASE_LIST_STORAGE_RESPONSE_RESET'


export const EmployeeCaseListStorageDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "EMPLOYEE_CASE_LIST_STORAGE_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "EMPLOYEE_CASE_LIST_STORAGE_FAIL"
        })
    }
}

export const EmployeeCaseListStorageResponseReset = (data) => dispatch => {
    dispatch({
        type: "EMPLOYEE_CASE_LIST_STORAGE_RESPONSE_RESET",
        payload: data,
    })
}
