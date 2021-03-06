import axios from "axios"
// Action Types
export const SET_CLIENT_PASSWORD_LOADING = 'SET_CLIENT_PASSWORD_LOADING'
export const SET_CLIENT_PASSWORD_FAIL =   'SET_CLIENT_PASSWORD_FAIL'
export const SET_CLIENT_PASSWORD_SERVER_FAIL =   'SET_CLIENT_PASSWORD_SERVER_FAIL'
export const SET_CLIENT_PASSWORD_SUCCESS = 'SET_CLIENT_PASSWORD_SUCCESS'


export const SetClientPasswordDispatcher = (data, token) => async dispatch => {
    try {
        dispatch({
            type: "SET_CLIENT_PASSWORD_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/user/client/setup-password/' + token,
            headers: { 
                'Content-Type': 'application/json'
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "SET_CLIENT_PASSWORD_SUCCESS",
                payload: res.data,
            })
        })
        .catch((error) => {
            dispatch({
                type: "SET_CLIENT_PASSWORD_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "SET_CLIENT_PASSWORD_FAIL"
        })
    }
}
