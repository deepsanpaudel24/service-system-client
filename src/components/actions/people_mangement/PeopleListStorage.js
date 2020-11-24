// Action Types
export const PEOPLES_LIST_STORAGE_FAIL =   'PEOPLES_LIST_STORAGE_FAIL'
export const PEOPLES_LIST_STORAGE_SUCCESS = 'PEOPLES_LIST_STORAGE_SUCCESS'
export const PEOPLES_LIST_STORAGE_RESPONSE_RESET = 'PEOPLES_LIST_STORAGE_RESPONSE_RESET'


export const PeoplesListStorageDispatcher = (data, total_records) => dispatch => {
    try {
        dispatch({
            type: "PEOPLES_LIST_STORAGE_SUCCESS",
            payload: data,
            total_record: total_records
        })
    }
    catch (e) {
        dispatch({
            type: "PEOPLES_LIST_STORAGE_FAIL"
        })
    }
}

export const PeoplesListStorageResponseReset = () => dispatch => {
    dispatch({
        type: "PEOPLES_LIST_STORAGE_RESPONSE_RESET"
    })
}
