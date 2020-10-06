import axios from "axios"
// Action Types
export const LIST_EMPLOYEE_LOADING = 'LIST_EMPLOYEE_LOADING'
export const LIST_EMPLOYEE_FAIL =   'LIST_EMPLOYEE_FAIL'
export const LIST_EMPLOYEE_SERVER_FAIL =   'LIST_EMPLOYEE_SERVER_FAIL'
export const LIST_EMPLOYEE_SUCCESS = 'LIST_EMPLOYEE_SUCCESS'


export const ListEmployeeDispatcher = () => async dispatch => {
    try {
        dispatch({
            type: "LIST_EMPLOYEE_LOADING"
        })
        const config = {
            method: 'get',
            url: '/api/v1/user/employee/list',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "LIST_EMPLOYEE_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "LIST_EMPLOYEE_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "LIST_EMPLOYEE_FAIL"
        })
    }
}
