import { CHANGE_PASSWORD_LOADING, CHANGE_PASSWORD_FAIL, CHANGE_PASSWORD_SERVER_FAIL, CHANGE_PASSWORD_SUCCESS } from "../actions/ChangePasswordAction"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const ChangePasswordReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CHANGE_PASSWORD_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case CHANGE_PASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case CHANGE_PASSWORD_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default ChangePasswordReducer