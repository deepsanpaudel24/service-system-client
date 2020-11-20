// Action Types
export const CLIENT_CASE_LIST_STORAGE_FAIL =   'CLIENT_CASE_LIST_STORAGE_FAIL'
export const CLIENT_CASE_LIST_STORAGE_SUCCESS = 'CLIENT_CASE_LIST_STORAGE_SUCCESS'


export const ClientCaseListStorageDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "CLIENT_CASE_LIST_STORAGE_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "CLIENT_CASE_LIST_STORAGE_FAIL"
        })
    }
}
