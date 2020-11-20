// Action Types
export const CLIENT_LIST_STORAGE_FAIL =   'CLIENT_LIST_STORAGE_FAIL'
export const CLIENT_LIST_STORAGE_SUCCESS = 'CLIENT_LIST_STORAGE_SUCCESS'


export const ClientListStorageDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "CLIENT_LIST_STORAGE_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "CLIENT_LIST_STORAGE_FAIL"
        })
    }
}
