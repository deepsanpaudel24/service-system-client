import { CLIENT_CASE_LIST_STORAGE_FAIL, CLIENT_CASE_LIST_STORAGE_SUCCESS, CLIENT_CASE_LIST_STORAGE_RESPONSE_RESET} from "../actions/case_management/ClientCasesListStorage"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const ClientCaseListReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CLIENT_CASE_LIST_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CLIENT_CASE_LIST_STORAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case CLIENT_CASE_LIST_STORAGE_RESPONSE_RESET:
            return {
                ...state,
                loading: false,
                data: [],
                errorMsg: "",
                serverErrorMsg: ""
            }
        default:
            return state
    }
}

export default ClientCaseListReducer