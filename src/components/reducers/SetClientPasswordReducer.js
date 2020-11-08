import { SET_CLIENT_PASSWORD_LOADING, SET_CLIENT_PASSWORD_FAIL, SET_CLIENT_PASSWORD_SERVER_FAIL ,SET_CLIENT_PASSWORD_SUCCESS} from "../actions/client_management/SetClientPasswordAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
}

const SetClientPasswordReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case SET_CLIENT_PASSWORD_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case SET_CLIENT_PASSWORD_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case SET_CLIENT_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case SET_CLIENT_PASSWORD_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default SetClientPasswordReducer