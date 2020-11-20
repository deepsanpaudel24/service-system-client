// Action Types
export const EMPLOYEES_LIST_STORAGE_FAIL =   'EMPLOYEES_LIST_STORAGE_FAIL'
export const EMPLOYEES_LIST_STORAGE_SUCCESS = 'EMPLOYEES_LIST_STORAGE_SUCCESS'
export const EMPLOYEES_LIST_STORAGE_RESPONSE_RESET = 'EMPLOYEES_LIST_STORAGE_RESPONSE_RESET'


export const EmployeesListStorageDispatcher = (data, total_records) => dispatch => {
    try {
        dispatch({
            type: "EMPLOYEES_LIST_STORAGE_SUCCESS",
            payload: data,
            total_record: total_records
        })
    }
    catch (e) {
        dispatch({
            type: "EMPLOYEES_LIST_STORAGE_FAIL"
        })
    }
}

export const EmployeesListStorageResponseReset = () => dispatch => {
    dispatch({
        type: "EMPLOYEES_LIST_STORAGE_RESPONSE_RESET"
    })
}
