// Action Types
export const CASES_LIST_STORAGE_FAIL =   'CASES_LIST_STORAGE_FAIL'
export const CASES_LIST_STORAGE_SUCCESS = 'CASES_LIST_STORAGE_SUCCESS'
export const CASES_LIST_STORAGE_RESPONSE_RESET = 'CASES_LIST_STORAGE_RESPONSE_RESET'


export const CaseListStorageDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "CASES_LIST_STORAGE_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "CASES_LIST_STORAGE_FAIL"
        })
    }
}

export const CaseListStorageResponseReset = () => dispatch => {
    dispatch({
        type: "CASES_LIST_STORAGE_RESPONSE_RESET"
    })
}
