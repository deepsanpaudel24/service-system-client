import axios from "axios"

// Action Types
export const USER_LOGOUT_LOADING = 'USER_LOGOUT_LOADING'
export const USER_LOGOUT_FAIL =   'USER_LOGOUT_FAIL'
export const USER_LOGOUT_SERVER_FAIL =   'USER_LOGOUT_SERVER_FAIL'
export const USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS'


export const LogoutUser = () => async dispatch => {
    try {
        dispatch({
            type: "USER_LOGOUT_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/user/logout',
            headers: { 
                'Content-Type': 'application/json'
              }
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "USER_LOGOUT_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "USER_LOGOUT_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "USER_LOGOUT_FAIL"
        })
    }
}

export default LogoutUser
