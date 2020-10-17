import { ADD_PEOPLE_LOADING, ADD_PEOPLE_FAIL, ADD_PEOPLE_SERVER_FAIL, ADD_PEOPLE_SUCCESS, ADD_PEOPLE_RESPONSE_RESET} from "../actions/people_mangement/AddPeople";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const PeopleRegisterReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case ADD_PEOPLE_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case ADD_PEOPLE_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case ADD_PEOPLE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
                emailConfirmationMessage: "Check your email for confirmation",
                addNext: action.addNext
            }
        case ADD_PEOPLE_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case ADD_PEOPLE_RESPONSE_RESET:
            return {
                ...state,
                loading: false,
                data: [],
                errorMsg: "",
                serverErrorMsg: "",
                emailConfirmationMessage: ""
                
            }
        default:
            return state
    }
}

export default PeopleRegisterReducer