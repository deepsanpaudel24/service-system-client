import axios from "axios"
// Action Types
export const EDIT_SERVICE_LOADING = 'EDIT_SERVICE_LOADING'
export const EDIT_SERVICE_FAIL =   'EDIT_SERVICE_FAIL'
export const EDIT_SERVICE_SERVER_FAIL =   'EDIT_SERVICE_SERVER_FAIL'
export const EDIT_SERVICE_SUCCESS = 'EDIT_SERVICE_SUCCESS'
export const EDIT_SERVICE_RESPONSE_RESET = 'EDIT_SERVICE_RESPONSE_RESET'


export const EditServiceDispatcher = (data, id) => async dispatch => {
    try {
        dispatch({
            type: "EDIT_SERVICE_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/service/' + id,
            headers: { 
                'Content-Type': 'application/json'
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "EDIT_SERVICE_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "EDIT_SERVICE_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "EDIT_SERVICE_FAIL"
        })
    }
}

export const EDITServiceResponseReset = () => async dispatch => {
    dispatch({
        type: "EDIT_SERVICE_RESPONSE_RESET"
    })
}
