// Action Types
export const CUSTOM_TASK_LIST_STORAGE_FAIL =   'CUSTOM_TASK_LIST_STORAGE_FAIL'
export const CUSTOM_TASK_LIST_STORAGE_SUCCESS = 'CUSTOM_TASK_LIST_STORAGE_SUCCESS'
export const CUSTOM_TASK_LSIT_STORAGE_RESPONSE_RESET = 'CUSTOM_TASK_LSIT_STORAGE_RESPONSE_RESET'


export const CustomTaskListStorageDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "CUSTOM_TASK_LIST_STORAGE_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "CUSTOM_TASK_LIST_STORAGE_FAIL"
        })
    }
}

export const CustomTaskListStorageResponseReset = () => async dispatch => {
    dispatch({
        type: "CUSTOM_TASK_LSIT_STORAGE_RESPONSE_RESET"
    })
}
