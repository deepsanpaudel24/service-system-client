import axios from "axios"
// Action Types
export const ADD_EMPLOYEE_LOADING = 'ADD_EMPLOYEE_LOADING'
export const ADD_EMPLOYEE_FAIL =   'ADD_EMPLOYEE_FAIL'
export const ADD_EMPLOYEE_SERVER_FAIL =   'ADD_EMPLOYEE_SERVER_FAIL'
export const ADD_EMPLOYEE_SUCCESS = 'ADD_EMPLOYEE_SUCCESS'
export const ADD_EMPLOYEE_RESPONSE_RESET = 'ADD_EMPLOYEE_RESPONSE_RESET'


export const AddEmployeeDispatcher = (data, addNext) => async dispatch => {
    try {
        dispatch({
            type: "ADD_EMPLOYEE_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/user/employee/register',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "ADD_EMPLOYEE_SUCCESS",
                payload: res.data,
                addNext: addNext
            })

        })
        .catch((error) => {
            dispatch({
                type: "ADD_EMPLOYEE_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })

        const config2 = {
            method: 'post',
            url: '/api/v1/user/employee/send-email-confirmation',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config2)

    }
    catch (e) {
        dispatch({
            type: "ADD_EMPLOYEE_FAIL"
        })
    }
}

export const AddEmployeeResponseReset = () => async dispatch => {
    dispatch({
        type: "ADD_EMPLOYEE_RESPONSE_RESET"
    })
}
