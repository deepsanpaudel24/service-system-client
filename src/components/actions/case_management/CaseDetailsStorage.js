// Action Types
export const CASE_DETAILS_STORAGE_FAIL =   'CASE_DETAILS_STORAGE_FAIL'
export const CASE_DETAILS_STORAGE_SUCCESS = 'CASE_DETAILS_STORAGE_SUCCESS'


export const CaseDetailsStorageDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "CASE_DETAILS_STORAGE_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "CASE_DETAILS_STORAGE_FAIL"
        })
    }
}
