import { DEACTIVATE_PEOPLE_LOADING, DEACTIVATE_PEOPLE_FAIL, DEACTIVATE_PEOPLE_SERVER_FAIL, DEACTIVATE_PEOPLE_SUCCESS, DEACTIVATE_PEOPLE_RESPONSE_RESET} from "../actions/people_mangement/DeactivatePeopleAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const PeopleDeactivateReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case DEACTIVATE_PEOPLE_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case DEACTIVATE_PEOPLE_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case DEACTIVATE_PEOPLE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
                emailConfirmationMessage: "Check your email for confirmation",
                DEACTIVATENext: action.DEACTIVATENext
            }
        case DEACTIVATE_PEOPLE_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case DEACTIVATE_PEOPLE_RESPONSE_RESET:
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

export default PeopleDeactivateReducer