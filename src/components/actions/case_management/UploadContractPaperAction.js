import axios from "axios"
// Action Types
export const UPLOAD_CONTRACT_PAPER_LOADING = 'UPLOAD_CONTRACT_PAPER_LOADING'
export const UPLOAD_CONTRACT_PAPER_FAIL =   'UPLOAD_CONTRACT_PAPER_FAIL'
export const UPLOAD_CONTRACT_PAPER_SERVER_FAIL =   'REPLY_EMPLOYEE_SERVER_FAIL'
export const UPLOAD_CONTRACT_PAPER_SUCCESS = 'UPLOAD_CONTRACT_PAPER_SUCCESS'

export const UploadContractPaperAction = (data, caseId) => async dispatch => {
    try {
        dispatch({
            type: "UPLOAD_CONTRACT_PAPER_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/case-contract/'+ caseId,
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "UPLOAD_CONTRACT_PAPER_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "UPLOAD_CONTRACT_PAPER_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "UPLOAD_CONTRACT_PAPER_FAIL"
        })
    }
}
