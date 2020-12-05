import { CASES_LIST_STORAGE_FAIL, CASES_LIST_STORAGE_SUCCESS, CASES_LIST_STORAGE_RESPONSE_RESET} from "../actions/case_management/CaseTimersListStorage";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const CaseListStorageReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CASES_LIST_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CASES_LIST_STORAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case CASES_LIST_STORAGE_RESPONSE_RESET:
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

export default CaseListStorageReducer