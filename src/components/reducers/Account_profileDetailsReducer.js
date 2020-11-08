import { PROFILE_SETTING_FAIL, PROFILE_SETTING_SUCCESS} from "../actions/ProfileDetailsAction"

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
        default:
            return state
    }
}

export default ProfileDetailsReducer