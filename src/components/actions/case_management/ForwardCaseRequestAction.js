import axios from "axios"
// Action Types
export const FORWARD_CASE_REQUEST_LOADING = 'FORWARD_CASE_REQUEST_LOADING'
export const FORWARD_CASE_REQUEST_FAIL =   'FORWARD_CASE_REQUEST_FAIL'
export const FORWARD_CASE_REQUEST_SERVER_FAIL =   'FORWARD_CASE_REQUEST_SERVER_FAIL'
export const FORWARD_CASE_REQUEST_SUCCESS = 'FORWARD_CASE_REQUEST_SUCCESS'
export const FORWARD_CASE_RESPONSE_RESET = 'FORWARD_CASE_RESPONSE_RESET'


export const ForwardCaseRequestDispacther = (caseId, data) => async dispatch => {
    try {
        dispatch({
            type: "FORWARD_CASE_REQUEST_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/forward/case-request/' + caseId,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "FORWARD_CASE_REQUEST_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "FORWARD_CASE_REQUEST_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "FORWARD_CASE_REQUEST_FAIL"
        })
    }
}

export const ForwardCaseRequestDispactherResponseReset = () => async dispatch => {
    dispatch({
        type: "FORWARD_CASE_RESPONSE_RESET"
    })
} 
