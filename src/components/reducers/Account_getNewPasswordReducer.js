import { RESET_PASSWORD_LOADING, RESET_PASSWORD_FAIL, RESET_PASSWORD_SERVER_FAIL, RESET_PASSWORD_SUCCESS} from "../actions/AccountAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    loginConfirmationMessage: ""
}

const GetNewPasswordReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case RESET_PASSWORD_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case RESET_PASSWORD_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
                loginConfirmationMessage: "Password reset Successful."
            }
        case RESET_PASSWORD_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default GetNewPasswordReducer