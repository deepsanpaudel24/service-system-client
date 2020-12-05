// Action Types
export const TRANSACTIONS_LIST_STORAGE_FAIL =   'TRANSACTIONS_LIST_STORAGE_FAIL'
export const TRANSACTIONS_LIST_STORAGE_SUCCESS = 'TRANSACTIONS_LIST_STORAGE_SUCCESS'
export const TRANSACTIONS_LIST_STORAGE_RESPONSE_RESET = 'TRANSACTIONS_LIST_STORAGE_RESPONSE_RESET'


export const TransactionsListStorageDispatcher = (data, total_records) => dispatch => {
    try {
        dispatch({
            type: "TRANSACTIONS_LIST_STORAGE_SUCCESS",
            payload: data,
            total_record: total_records
        })
    }
    catch (e) {
        dispatch({
            type: "TRANSACTIONS_LIST_STORAGE_FAIL"
        })
    }
}

export const TransactionsListStorageResponseReset = () => dispatch => {
    dispatch({
        type: "TRANSACTIONS_LIST_STORAGE_RESPONSE_RESET"
    })
}
