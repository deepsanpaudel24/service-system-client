import { PROFILE_SETTING_FAIL, PROFILE_SETTING_SUCCESS, PROFILE_SETTING_RESPONSE_RESET} from "../actions/ProfileDetailsAction"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const ProfileDetailsReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case PROFILE_SETTING_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case PROFILE_SETTING_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case PROFILE_SETTING_RESPONSE_RESET:
            return {
                ...state,
                loading: false,
                data: [],
                errorMsg: "",
                serverErrorMsg: ""
            }
        default:
            return state
    }
}

export default ProfileDetailsReducer