// Action Types
export const CONTRACT_DETAILS_STORAGE_FAIL =   'CONTRACT_DETAILS_STORAGE_FAIL'
export const CONTRACT_DETAILS_STORAGE_SUCCESS = 'CONTRACT_DETAILS_STORAGE_SUCCESS'


export const ContractDetailsStorageDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "CONTRACT_DETAILS_STORAGE_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "CONTRACT_DETAILS_STORAGE_FAIL"
        })
    }
}
