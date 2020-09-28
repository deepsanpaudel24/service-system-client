import axios from "axios"
// Action Types
export const REPLY_CASE_REQUEST_LOADING = 'REPLY_CASE_REQUEST_LOADING'
export const REPLY_CASE_REQUEST_FAIL =   'REPLY_CASE_REQUEST_FAIL'
export const REPLY_CASE_REQUEST_SERVER_FAIL =   'REPLY_EMPLOYEE_SERVER_FAIL'
export const REPLY_CASE_REQUEST_SUCCESS = 'REPLY_CASE_REQUEST_SUCCESS'


export const ReplyCaseRequestDispacther = (data, caseid) => async dispatch => {
    try {
        dispatch({
            type: "REPLY_CASE_REQUEST_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/case-request/reply/'+ caseid,
            headers: { 
                'Content-Type': 'application/json'
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "REPLY_CASE_REQUEST_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "REPLY_CASE_REQUEST_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "REPLY_CASE_REQUEST_FAIL"
        })
    }
}
