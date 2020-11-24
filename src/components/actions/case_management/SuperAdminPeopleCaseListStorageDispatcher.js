// Action Types
export const CASES_LIST_STORAGE_FAIL =   'CASES_LIST_STORAGE_FAIL'
export const CASES_LIST_STORAGE_SUCCESS = 'CASES_LIST_STORAGE_SUCCESS'
export const CASES_LIST_STORAGE_RESPONSE_RESET = 'CASES_LIST_STORAGE_RESPONSE_RESET'


export const SAPeopleCaseListStorageDispatcher = (data, total_records) => dispatch => {
    try {
        dispatch({
            type: "CASES_LIST_STORAGE_SUCCESS",
            payload: data,
            total_record: total_records
        })
    }
    catch (e) {
        dispatch({
            type: "CASES_LIST_STORAGE_FAIL"
        })
    }
}

export const SAPeopleCaseListStorageResponseReset = () => dispatch => {
    dispatch({
        type: "CASES_LIST_STORAGE_RESPONSE_RESET"
    })
}
