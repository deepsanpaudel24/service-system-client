import axios from "axios"
// Action Types
export const NOTIFICATION_CHANGE_STATUS_LOADING = 'NOTIFICATION_CHANGE_STATUS_LOADING'
export const NOTIFICATION_CHANGE_STATUS_FAIL =   'NOTIFICATION_CHANGE_STATUS_FAIL'
export const NOTIFICATION_CHANGE_STATUS_SERVER_FAIL =   'ADD_EMPLOYEE_SERVER_FAIL'
export const NOTIFICATION_CHANGE_STATUS_SUCCESS = 'NOTIFICATION_CHANGE_STATUS_SUCCESS'
export const NOTIFICATION_CHANGE_STATUS_RESPONSE_RESET = 'NOTIFICATION_CHANGE_STATUS_RESPONSE_RESET'

export const NotificationChangeStatusDispacther = (notification_id) => async dispatch => {
    try {
        dispatch({
            type: "NOTIFICATION_CHANGE_STATUS_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/notifications/' + notification_id,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "NOTIFICATION_CHANGE_STATUS_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "NOTIFICATION_CHANGE_STATUS_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "NOTIFICATION_CHANGE_STATUS_FAIL"
        })
    }
}

export const NotificationChangeStatusResponseReset = () => async dispatch => {
    dispatch({
        type: "NOTIFICATION_CHANGE_STATUS_RESPONSE_RESET"
    })
}
