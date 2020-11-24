// Action Types
export const CHILD_ACCOUNT_LIST_STORAGE_FAIL =   'CHILD_ACCOUNT_LIST_STORAGE_FAIL'
export const CHILD_ACCOUNT_LIST_STORAGE_SUCCESS = 'CHILD_ACCOUNT_LIST_STORAGE_SUCCESS'
export const CHILD_ACCOUNT_LIST_STORAGE_RESPONSE_RESET = 'CHILD_ACCOUNT_LIST_STORAGE_RESPONSE_RESET'


export const ChildAccountListStorageDispatcher = (data, total_records) => dispatch => {
    try {
        dispatch({
            type: "CHILD_ACCOUNT_LIST_STORAGE_SUCCESS",
            payload: data,
            total_record: total_records
        })
    }
    catch (e) {
        dispatch({
            type: "CHILD_ACCOUNT_LIST_STORAGE_FAIL"
        })
    }
}

export const ChildAccountListStorageResponseReset = () => dispatch => {
    dispatch({
        type: "CHILD_ACCOUNT_LIST_STORAGE_RESPONSE_RESET"
    })
}
