import axios from "axios"

// Action Types
export const USER_TYPE_SUBMIT_LOADING = 'USER_TYPE_SUBMIT_LOADING'
export const USER_TYPE_SUBMIT_FAIL =   'USER_TYPE_SUBMIT_FAIL'
export const USER_TYPE_SUBMIT_SERVER_FAIL =   'USER_TYPE_SUBMIT_SERVER_FAIL'
export const USER_TYPE_SUBMIT_SUCCESS = 'USER_TYPE_SUBMIT_SUCCESS'


export const UpdateUserType = (data) => async dispatch => {
    try {
        dispatch({
            type: "USER_TYPE_SUBMIT_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/user/update/user_type',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "USER_TYPE_SUBMIT_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "USER_TYPE_SUBMIT_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "USER_TYPE_SUBMIT_FAIL"
        })
    }
}

export default UpdateUserType
