// Action Types
export const CASES_TIMERS_LIST_STORAGE_FAIL =   'CASES_TIMERS_LIST_STORAGE_FAIL'
export const CASES_TIMERS_LIST_STORAGE_SUCCESS = 'CASES_TIMERS_LIST_STORAGE_SUCCESS'
export const CASES_TIMERS_LIST_STORAGE_RESPONSE_RESET = 'CASES_TIMERS_LIST_STORAGE_RESPONSE_RESET'


export const CaseTimersListStorageDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "CASES_TIMERS_LIST_STORAGE_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "CASES_TIMERS_LIST_STORAGE_FAIL"
        })
    }
}

export const CaseTimersListStorageResponseReset = () => dispatch => {
    dispatch({
        type: "CASES_TIMERS_LIST_STORAGE_RESPONSE_RESET"
    })
}
