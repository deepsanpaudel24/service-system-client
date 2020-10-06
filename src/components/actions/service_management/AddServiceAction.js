import axios from "axios"
// Action Types
export const ADD_SERVICE_LOADING = 'ADD_SERVICE_LOADING'
export const ADD_SERVICE_FAIL =   'ADD_SERVICE_FAIL'
export const ADD_SERVICE_SERVER_FAIL =   'ADD_SERVICE_SERVER_FAIL'
export const ADD_SERVICE_SUCCESS = 'ADD_SERVICE_SUCCESS'
export const ADD_SERVICE_RESPONSE_RESET = 'ADD_SERVICE_RESPONSE_RESET'


export const AddServiceDispatcher = (data, addNext) => async dispatch => {
    try {
        dispatch({
            type: "ADD_SERVICE_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/service',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "ADD_SERVICE_SUCCESS",
                payload: res.data,
                addNext: addNext
            })

        })
        .catch((error) => {
            dispatch({
                type: "ADD_SERVICE_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "ADD_SERVICE_FAIL"
        })
    }
}

export const AddServiceResponseReset = () => async dispatch => {
    dispatch({
        type: "ADD_SERVICE_RESPONSE_RESET"
    })
}
