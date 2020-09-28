import { USER_LOGOUT_LOADING, USER_LOGOUT_FAIL, USER_LOGOUT_SUCCESS, USER_LOGOUT_SERVER_FAIL } from "../actions/UserLogoutAction"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const AccountLogoutReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case USER_LOGOUT_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case USER_LOGOUT_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case USER_LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case USER_LOGOUT_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default AccountLogoutReducer