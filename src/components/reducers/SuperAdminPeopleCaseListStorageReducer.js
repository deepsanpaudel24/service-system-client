import { CASES_LIST_STORAGE_FAIL, CASES_LIST_STORAGE_SUCCESS, CASES_LIST_STORAGE_RESPONSE_RESET} from "../actions/case_management/SuperAdminCaseListStorageDispatcher";

const DefaultState = {
    loading: false,
    data: [],
    total_records:0,
    errorMsg: "",
    serverErrorMsg: ""
}

const SAPeopleCaseListStorageReducer = (state = DefaultState, action) => {
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
                total_records: action.total_record,
                errorMsg: ""
            }
        case CASES_LIST_STORAGE_RESPONSE_RESET:
            return {
                ...state,
                loading: false,
                data: [],
                total_records:0,
                errorMsg: "",
                serverErrorMsg: ""
            }
        default:
            return state
    }
}

export default SAPeopleCaseListStorageReducer