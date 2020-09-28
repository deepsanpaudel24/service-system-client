import axios from "axios"

// Action Types
export const REGISTER_USER_LOADING = 'REGISTER_USER_LOADING'
export const REGISTER_USER_FAIL =   'REGISTER_USER_FAIL'
export const REGISTER_USER_SERVER_FAIL =   'REGISTER_USER_SERVER_FAIL'
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS'

export const FORGOT_PASSWORD_LOADING = 'FORGOT_PASSWORD_LOADING'
export const FORGOT_PASSWORD_FAIL = 'FORGOT_PASSWORD_FAIL'
export const FORGOT_PASSWORD_SERVER_FAIL = 'FORGOT_PASSWORD_SERVER_FAIL'
export const FORGOT_PASSWORD_SUCESSS = 'FORGOT_PASSWORD_SUCESSS'

export const RESET_PASSWORD_LOADING = 'RESET_PASSWORD_LOADING'
export const RESET_PASSWORD_FAIL = 'RESET_PASSWORD_FAIL'
export const RESET_PASSWORD_SERVER_FAIL = 'RESET_PASSWORD_SERVER_FAIL'
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS'

export const LOGIN_USER_LOADING = 'LOGIN_USER_LOADING'
export const LOGIN_USER_FAIL = 'LOGIN_USER_FAIL'
export const LOGIN_USER_SERVER_FAIL = 'LOGIN_USER_SERVER_FAIL'
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS'


export const RegisterUser = (data) => async dispatch => {
    try {
        dispatch({
            type: "REGISTER_USER_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/user/register',
            headers: { 
                'Content-Type': 'application/json'
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "REGISTER_USER_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "REGISTER_USER_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "REGISTER_USER_FAIL"
        })
    }
}


export const LoginUser = (data) => async dispatch => {
    try {
        dispatch({
            type: "LOGIN_USER_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/user/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "LOGIN_USER_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "LOGIN_USER_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "LOGIN_USER_FAIL"
        })
    }
}

export const ResetPassword = (data) => async dispatch => {
    try {
        dispatch({
            type: "FORGOT_PASSWORD_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/user/forgot-password',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "FORGOT_PASSWORD_SUCESSS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "FORGOT_PASSWORD_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "FORGOT_PASSWORD_FAIL"
        })
    }
}

export const GetNewPassword = (data, token) => async dispatch => {
    try {
        dispatch({
            type: "RESET_PASSWORD_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/user/reset-password/confirm/' + token,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "RESET_PASSWORD_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "RESET_PASSWORD_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "RESET_PASSWORD_FAIL"
        })
    }
}