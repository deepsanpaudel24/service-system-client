// Action Types
export const INTAKE_FORM_LIST_STORAGE_FAIL =   'INTAKE_FORM_LIST_STORAGE_FAIL'
export const INTAKE_FORM_LIST_STORAGE_SUCCESS = 'INTAKE_FORM_LIST_STORAGE_SUCCESS'
export const INTAKE_FORM_LIST_STORAGE_RESPONSE_RESET = 'INTAKE_FORM_LIST_STORAGE_RESPONSE_RESET'


export const IntakeFormListStorageDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "INTAKE_FORM_LIST_STORAGE_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "INTAKE_FORM_LIST_STORAGE_FAIL"
        })
    }
}

export const IntakeFormListStorageResponseReset = () => dispatch => [
    dispatch({
        type: "INTAKE_FORM_LIST_STORAGE_RESPONSE_RESET"
    })
]
