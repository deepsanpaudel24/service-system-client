import { NEW_CASE_REQUEST_LOADING, NEW_CASE_REQUEST_FAIL, NEW_CASE_REQUEST_SERVER_FAIL , NEW_CASE_REQUEST_SUCCESS} from "../actions/case_management/NewCaseRequestAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const NewCaseRequestReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case NEW_CASE_REQUEST_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case NEW_CASE_REQUEST_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case NEW_CASE_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case NEW_CASE_REQUEST_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default NewCaseRequestReducer