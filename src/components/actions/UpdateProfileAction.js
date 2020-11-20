import axios from "axios";

// Action type
export const UPDATE_PROFILE_SETTING_LOADING = 'UPDATE_PROFILE_SETTING_LOADING'
export const UPDATE_PROFILE_SETTING_FAIL =   'UPDATE_PROFILE_SETTING_FAIL'
export const UPDATE_PROFILE_SETTING_SERVER_FAIL =   'UPDATE_PROFILE_SETTING_SERVER_FAIL'
export const UPDATE_PROFILE_SETTING_SUCCESS = 'UPDATE_PROFILE_SETTING_SUCCESS'

export const UpdateProfileSetting = (data) => async dispatch => {
    try {
        dispatch({
            type: "UPDATE_PROFILE_SETTING_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/user/profile-setting',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "UPDATE_PROFILE_SETTING_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "UPDATE_PROFILE_SETTING_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "UPDATE_PROFILE_SETTING_FAIL"
        })
    }
}


export const UpdateProfileIntroduction = (data) => async dispatch => {
    try {
        dispatch({
            type: "UPDATE_PROFILE_INTRODUCTION_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/user/profile-introduction',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "UPDATE_PROFILE_INTRODUCTION_SUCCESS",
                payload: res.data
            })

        })
        .catch((error) => {
            dispatch({
                type: "UPDATE_PROFILE_INTRODUCTION_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "UPDATE_PROFILE_INTRODUCTION_FAIL"
        })
    }
}