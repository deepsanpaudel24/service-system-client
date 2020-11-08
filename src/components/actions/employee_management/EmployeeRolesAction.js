import axios from "axios"
// Action Types
export const UPDATE_EMPLOYEE_ROLES_LOADING = 'UPDATE_EMPLOYEE_ROLES_LOADING'
export const UPDATE_EMPLOYEE_ROLES_FAIL =   'UPDATE_EMPLOYEE_ROLES_FAIL'
export const UPDATE_EMPLOYEE_ROLES_SERVER_FAIL =   'UPDATE_EMPLOYEE_ROLES_SERVER_FAIL'
export const UPDATE_EMPLOYEE_ROLES_SUCCESS = 'UPDATE_EMPLOYEE_ROLES_SUCCESS'


export const UpdateEmployeeRolesDispatcher = (data, id) => async dispatch => {
    try {
        dispatch({
            type: "UPDATE_EMPLOYEE_ROLES_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/employee/' + id,
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "UPDATE_EMPLOYEE_ROLES_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "UPDATE_EMPLOYEE_ROLES_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "UPDATE_EMPLOYEE_ROLES_FAIL"
        })
    }
}

