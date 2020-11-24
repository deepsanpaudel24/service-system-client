// Action Types
export const CLIENT_CASE_LIST_STORAGE_FAIL =   'CLIENT_CASE_LIST_STORAGE_FAIL'
export const CLIENT_CASE_LIST_STORAGE_SUCCESS = 'CLIENT_CASE_LIST_STORAGE_SUCCESS'
export const CLIENT_CASE_LIST_STORAGE_RESPONSE_RESET = 'CLIENT_CASE_LIST_STORAGE_RESPONSE_RESET'


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

export const ClientCaseListStorageResponseReset = (data) => dispatch => {
    dispatch({
        type: "CLIENT_CASE_LIST_STORAGE_RESPONSE_RESET",
        payload: data,
    })
}
