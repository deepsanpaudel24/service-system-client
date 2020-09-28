import axios from "axios"

// Action Types
export const USER_PROFILE_BASIC_SUBMIT_LOADING = 'USER_PROFILE_BASIC_SUBMIT_LOADING'
export const USER_PROFILE_BASIC_SUBMIT_FAIL =   'USER_PROFILE_BASIC_SUBMIT_FAIL'
export const USER_PROFILE_BASIC_SUBMIT_SERVER_FAIL =   'USER_PROFILE_BASIC_SUBMIT_SERVER_FAIL'
export const USER_PROFILE_BASIC_SUBMIT_SUCCESS = 'USER_PROFILE_BASIC_SUBMIT_SUCCESS'

// Action Types
export const USER_PROFILE_DETAILED_SUBMIT_LOADING = 'USER_PROFILE_DETAILED_SUBMIT_LOADING'
export const USER_PROFILE_DETAILED_SUBMIT_FAIL =   'USER_PROFILE_DETAILED_SUBMIT_FAIL'
export const USER_PROFILE_DETAILED_SUBMIT_SERVER_FAIL =   'USER_PROFILE_DETAILED_SUBMIT_SERVER_FAIL'
export const USER_PROFILE_DETAILED_SUBMIT_SUCCESS = 'USER_PROFILE_DETAILED_SUBMIT_SUCCESS'

// Action Types
export const USER_PROFILE_BILLING_SUBMIT_LOADING = 'USER_PROFILE_BILLING_SUBMIT_LOADING'
export const USER_PROFILE_BILLING_SUBMIT_FAIL =   'USER_PROFILE_BILLING_SUBMIT_FAIL'
export const USER_PROFILE_BILLING_SUBMIT_SERVER_FAIL =   'USER_PROFILE_BILLING_SUBMIT_SERVER_FAIL'
export const USER_PROFILE_BILLING_SUBMIT_SUCCESS = 'USER_PROFILE_BILLING_SUBMIT_SUCCESS'


export const UpdateUserBasicProfile = (data) => async dispatch => {
    try {
        dispatch({
            type: "USER_PROFILE_BASIC_SUBMIT_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/user/update/profile/basic',
            headers: { 
                'Content-Type': 'application/json'
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "USER_PROFILE_BASIC_SUBMIT_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "USER_PROFILE_BASIC_SUBMIT_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "USER_PROFILE_BASIC_SUBMIT_FAIL"
        })
    }
}

export const UpdateUserDetailedProfile = (data) => async dispatch => {
    try {
        dispatch({
            type: "USER_PROFILE_DETAILED_SUBMIT_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/user/update/profile/detailed',
            headers: { 
                'Content-Type': 'application/json'
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "USER_PROFILE_DETAILED_SUBMIT_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "USER_PROFILE_DETAILED_SUBMIT_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "USER_PROFILE_DETAILED_SUBMIT_FAIL"
        })
    }
}

export const UpdateUserBillingProfile = (data) => async dispatch => {
    try {
        dispatch({
            type: "USER_PROFILE_BILLING_SUBMIT_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/user/update/profile/billing',
            headers: { 
                'Content-Type': 'application/json'
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "USER_PROFILE_BILLING_SUBMIT_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "USER_PROFILE_BILLING_SUBMIT_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "USER_PROFILE_BILLING_SUBMIT_FAIL"
        })
    }
}


