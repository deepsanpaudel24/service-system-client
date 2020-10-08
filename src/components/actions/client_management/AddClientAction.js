import axios from "axios"
// Action Types
export const ADD_CLIENT_LOADING = 'ADD_CLIENT_LOADING'
export const ADD_CLIENT_FAIL =   'ADD_CLIENT_FAIL'
export const ADD_CLIENT_SERVER_FAIL =   'ADD_CLIENT_SERVER_FAIL'
export const ADD_CLIENT_SUCCESS = 'ADD_CLIENT_SUCCESS'
export const ADD_CLIENT_RESPONSE_RESET = 'ADD_CLIENT_RESPONSE_RESET'


export const AddClientDispatcher = (data, addNext) => async dispatch => {
    try {
        dispatch({
            type: "ADD_CLIENT_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/client/register',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "ADD_CLIENT_SUCCESS",
                payload: res.data,
                addNext: addNext
            })

        })
        .catch((error) => {
            dispatch({
                type: "ADD_CLIENT_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "ADD_CLIENT_FAIL"
        })
    }
}

export const AddClientResponseReset = () => async dispatch => {
    dispatch({
        type: "ADD_CLIENT_RESPONSE_RESET"
    })
}
