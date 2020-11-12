// Action Types
export const EMPLOYEES_LIST_STORAGE_FAIL =   'EMPLOYEES_LIST_STORAGE_FAIL'
export const EMPLOYEES_LIST_STORAGE_SUCCESS = 'EMPLOYEES_LIST_STORAGE_SUCCESS'


export const EmployeesListStorageDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "EMPLOYEES_LIST_STORAGE_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "EMPLOYEES_LIST_STORAGE_FAIL"
        })
    }
}
