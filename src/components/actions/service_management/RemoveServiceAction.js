import axios from "axios"
// Action Types
export const REMOVE_SERVICE_LOADING = 'REMOVE_SERVICE_LOADING'
export const REMOVE_SERVICE_FAIL =   'REMOVE_SERVICE_FAIL'
export const REMOVE_SERVICE_SERVER_FAIL =   'REMOVE_SERVICE_SERVER_FAIL'
export const REMOVE_SERVICE_SUCCESS = 'REMOVE_SERVICE_SUCCESS'
export const REMOVE_SERVICE_RESPONSE_RESET = 'REMOVE_SERVICE_RESPONSE_RESET'


export const RemoveServiceDispatcher = (id) => async dispatch => {
    try {
        dispatch({
            type: "REMOVE_SERVICE_LOADING"
        })
        const config = {
            method: 'delete',
            url: '/api/v1/service/' + id,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        await axios(config)
        .then((res) => {
            console.log(id)
            dispatch({
                type: "REMOVE_SERVICE_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "REMOVE_SERVICE_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "REMOVE_SERVICE_FAIL"
        })
    }
}

export const RemoveServiceResponseReset = () => async dispatch => {
    dispatch({
        type: "REMOVE_SERVICE_RESPONSE_RESET"
    })
}
