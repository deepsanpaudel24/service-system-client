import { FORGOT_PASSWORD_LOADING, FORGOT_PASSWORD_FAIL, FORGOT_PASSWORD_SERVER_FAIL, FORGOT_PASSWORD_SUCESSS} from "../actions/AccountAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const ForgotPasswordReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case FORGOT_PASSWORD_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case FORGOT_PASSWORD_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case FORGOT_PASSWORD_SUCESSS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
                emailConfirmationMessage: "Check email for password reset link"
            }
        case FORGOT_PASSWORD_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default ForgotPasswordReducer