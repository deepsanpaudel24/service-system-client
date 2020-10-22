import axios from "axios"
// Action Types
export const SAVE_INTAKE_FORM_LOADING = 'SAVE_INTAKE_FORM_LOADING'
export const SAVE_INTAKE_FORM_FAIL =   'SAVE_INTAKE_FORM_FAIL'
export const SAVE_INTAKE_FORM_SERVER_FAIL =   'SAVE_INTAKE_FORM_SERVER_FAIL'
export const SAVE_INTAKE_FORM_SUCESS = 'SAVE_INTAKE_FORM_SUCESS'
export const SAVE_INTAKE_FORM_RESPONSE_RESET = 'SAVE_INTAKE_FORM_RESPONSE_RESET'

export const SaveIntakeFormDispatcher = (data, method) => async dispatch => {
    try {
        dispatch({
            type: "SAVE_INTAKE_FORM_LOADING"
        })
        const config = {
            method: method,
            url: '/api/v1/intake-form',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "SAVE_INTAKE_FORM_SUCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "SAVE_INTAKE_FORM_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "SAVE_INTAKE_FORM_FAIL"
        })
    }
}

export const SaveIntakeFormResponseReset = () => async dispatch => {
    dispatch({
        type: "SAVE_INTAKE_FORM_RESPONSE_RESET"
    })
}
