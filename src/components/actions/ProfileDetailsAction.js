// Action Types
export const PROFILE_SETTING_FAIL =   'PROFILE_SETTING_FAIL'
export const PROFILE_SETTING_SUCCESS = 'PROFILE_SETTING_SUCCESS'
export const PROFILE_SETTING_RESPONSE_RESET = 'PROFILE_SETTING_RESPONSE_RESET'


export const ProfileSettingDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "PROFILE_SETTING_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "PROFILE_SETTING_FAIL"
        })
    }
}

export const ProfileSettingResponseReset = () => async dispatch => {
    dispatch({
        type: "PROFILE_SETTING_RESPONSE_RESET"
    })
}