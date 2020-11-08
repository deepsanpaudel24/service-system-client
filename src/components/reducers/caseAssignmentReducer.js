import { CASE_ASSIGNMENT_LOADING, CASE_ASSIGNMENT_FAIL, CASE_ASSIGNMENT_SERVER_FAIL ,CASE_ASSIGNMENT_SUCCESS} from "../actions/case_management/CaseAssignmentAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const CaseAssignmentReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CASE_ASSIGNMENT_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case CASE_ASSIGNMENT_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CASE_ASSIGNMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case CASE_ASSIGNMENT_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default CaseAssignmentReducer