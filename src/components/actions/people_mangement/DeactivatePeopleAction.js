import axios from "axios"
// Action Types
export const DEACTIVATE_PEOPLE_LOADING = 'DEACTIVATE_PEOPLE_LOADING'
export const DEACTIVATE_PEOPLE_FAIL =   'DEACTIVATE_PEOPLE_FAIL'
export const DEACTIVATE_PEOPLE_SERVER_FAIL =   'DEACTIVATE_PEOPLE_SERVER_FAIL'
export const DEACTIVATE_PEOPLE_SUCCESS = 'DEACTIVATE_PEOPLE_SUCCESS'
export const DEACTIVATE_PEOPLE_RESPONSE_RESET = 'DEACTIVATE_PEOPLE_RESPONSE_RESET'


export const DeactivatePeopleDispatcher = (data, id) => async dispatch => {
    try {
        dispatch({
            type: "DEACTIVATE_PEOPLE_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/peoples/' + id,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "DEACTIVATE_PEOPLE_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "DEACTIVATE_PEOPLE_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "DEACTIVATE_PEOPLE_FAIL"
        })
    }
}

export const DeactivatePeopleResponseReset = () => async dispatch => {
    dispatch({
        type: "DEACTIVATE_PEOPLE_RESPONSE_RESET"
    })
}

