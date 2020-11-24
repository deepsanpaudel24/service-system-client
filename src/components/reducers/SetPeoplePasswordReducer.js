import { SET_PEOPLE_PASSWORD_LOADING, SET_PEOPLE_PASSWORD_FAIL, SET_PEOPLE_PASSWORD_SERVER_FAIL ,SET_PEOPLE_PASSWORD_SUCCESS} from "../actions/people_mangement/SetPeoplePasswordAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
}

const SetPeoplePasswordReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case SET_PEOPLE_PASSWORD_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case SET_PEOPLE_PASSWORD_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case SET_PEOPLE_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case SET_PEOPLE_PASSWORD_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default SetPeoplePasswordReducer