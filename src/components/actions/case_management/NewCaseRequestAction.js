import axios from "axios"
// Action Types
export const NEW_CASE_REQUEST_LOADING = 'NEW_CASE_REQUEST_LOADING'
export const NEW_CASE_REQUEST_FAIL =   'NEW_CASE_REQUEST_FAIL'
export const NEW_CASE_REQUEST_SERVER_FAIL =   'ADD_EMPLOYEE_SERVER_FAIL'
export const NEW_CASE_REQUEST_SUCCESS = 'NEW_CASE_REQUEST_SUCCESS'
export const NEW_CASE_REQUEST_RESPONSE_RESET = 'NEW_CASE_REQUEST_RESPONSE_RESET'

export const NewCaseRequestDispacther = (data) => async dispatch => {
    try {
        dispatch({
            type: "NEW_CASE_REQUEST_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/case-request',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "NEW_CASE_REQUEST_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "NEW_CASE_REQUEST_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "NEW_CASE_REQUEST_FAIL"
        })
    }
}

export const NewCaseRequestResponseReset = () => async dispatch => {
    dispatch({
        type: "NEW_CASE_REQUEST_RESPONSE_RESET"
    })
}
