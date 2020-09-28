import { REGISTER_USER_LOADING, REGISTER_USER_FAIL, REGISTER_USER_SERVER_FAIL ,REGISTER_USER_SUCCESS} from "../actions/AccountAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const AccountRegisterReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case REGISTER_USER_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case REGISTER_USER_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
                emailConfirmationMessage: "Check your email for confirmation"
            }
        case REGISTER_USER_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default AccountRegisterReducer