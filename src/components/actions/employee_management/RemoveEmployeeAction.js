import axios from "axios"
// Action Types
export const REMOVE_EMPLOYEE_LOADING = 'REMOVE_EMPLOYEE_LOADING'
export const REMOVE_EMPLOYEE_FAIL =   'REMOVE_EMPLOYEE_FAIL'
export const REMOVE_EMPLOYEE_SERVER_FAIL =   'REMOVE_EMPLOYEE_SERVER_FAIL'
export const REMOVE_EMPLOYEE_SUCCESS = 'REMOVE_EMPLOYEE_SUCCESS'
export const REMOVE_EMPLOYEE_RESPONSE_RESET = 'REMOVE_EMPLOYEE_RESPONSE_RESET'


export const RemoveEmployeeDispatcher = (id) => async dispatch => {
    try {
        dispatch({
            type: "REMOVE_EMPLOYEE_LOADING"
        })
        const config = {
            method: 'delete',
            url: '/api/v1/employee/' + id,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "REMOVE_EMPLOYEE_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "REMOVE_EMPLOYEE_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "REMOVE_EMPLOYEE_FAIL"
        })
    }
}

export const RemoveEmployeeResponseReset = () => async dispatch => {
    dispatch({
        type: "REMOVE_EMPLOYEE_RESPONSE_RESET"
    })
}
