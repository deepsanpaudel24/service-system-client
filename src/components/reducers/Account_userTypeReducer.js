import { USER_TYPE_SUBMIT_LOADING, USER_TYPE_SUBMIT_FAIL, USER_TYPE_SUBMIT_SERVER_FAIL, USER_TYPE_SUBMIT_SUCCESS } from "../actions/UserTypeAction"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const UpdateUserTypeReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case USER_TYPE_SUBMIT_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case USER_TYPE_SUBMIT_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case USER_TYPE_SUBMIT_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case USER_TYPE_SUBMIT_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default UpdateUserTypeReducer