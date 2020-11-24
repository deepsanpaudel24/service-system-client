import axios from "axios";

// Action type
export const UPDATE_COMMISSION_LOADING = 'UPDATE_COMMISSION_LOADING'
export const UPDATE_COMMISSION_FAIL =   'UPDATE_COMMISSION_FAIL'
export const UPDATE_COMMISSION_SERVER_FAIL =   'UPDATE_COMMISSION_SERVER_FAIL'
export const UPDATE_COMMISSION_SUCCESS = 'UPDATE_COMMISSION_SUCCESS'

export const UpdateCommission = (data, id) => async dispatch => {
    try {
        dispatch({
            type: "UPDATE_COMMISSION_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/people/change-commission/'+ id,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "UPDATE_COMMISSION_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "UPDATE_COMMISSION_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "UPDATE_COMMISSION_FAIL"
        })
    }
}