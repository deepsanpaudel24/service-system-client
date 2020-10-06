import axios from "axios"

// Action Types
export const CHANGE_PASSWORD_LOADING = 'CHANGE_PASSWORD_LOADING'
export const CHANGE_PASSWORD_FAIL =   'CHANGE_PASSWORD_FAIL'
export const CHANGE_PASSWORD_SERVER_FAIL =   'CHANGE_PASSWORD_SERVER_FAIL'
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS'


export const ChangePasswordDispatcher = (data) => async dispatch => {
    try {
        dispatch({
            type: "CHANGE_PASSWORD_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/user/change-password',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "CHANGE_PASSWORD_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "CHANGE_PASSWORD_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "CHANGE_PASSWORD_FAIL"
        })
    }
}
