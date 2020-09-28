import { USER_PROFILE_BILLING_SUBMIT_LOADING, USER_PROFILE_BILLING_SUBMIT_FAIL, USER_PROFILE_BILLING_SUBMIT_SERVER_FAIL, USER_PROFILE_BILLING_SUBMIT_SUCCESS } from "../actions/UserProfileSetupAction"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const UpdateBillingProfileReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case USER_PROFILE_BILLING_SUBMIT_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case USER_PROFILE_BILLING_SUBMIT_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case USER_PROFILE_BILLING_SUBMIT_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case USER_PROFILE_BILLING_SUBMIT_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default UpdateBillingProfileReducer