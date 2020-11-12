// Action Types
export const SERVICES_LIST_STORAGE_FAIL =   'SERVICES_LIST_STORAGE_FAIL'
export const SERVICES_LIST_STORAGE_SUCCESS = 'SERVICES_LIST_STORAGE_SUCCESS'


export const ServicesListStorageDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "SERVICES_LIST_STORAGE_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "SERVICES_LIST_STORAGE_FAIL"
        })
    }
}
