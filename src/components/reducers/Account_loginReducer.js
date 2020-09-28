import { LOGIN_USER_LOADING, LOGIN_USER_FAIL, LOGIN_USER_SUCCESS, LOGIN_USER_SERVER_FAIL } from "../actions/AccountAction"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const AccountLoginReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case LOGIN_USER_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case LOGIN_USER_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case LOGIN_USER_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default AccountLoginReducer