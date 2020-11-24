import { CHILD_ACCOUNT_LIST_STORAGE_FAIL, CHILD_ACCOUNT_LIST_STORAGE_SUCCESS, CHILD_ACCOUNT_LIST_STORAGE_RESPONSE_RESET} from "../actions/people_mangement/ChildAccountListStorage"

const DefaultState = {
    loading: false,
    data: [],
    total_records:0,
    errorMsg: "",
    serverErrorMsg: ""
}

const ChildAccountListStorageReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CHILD_ACCOUNT_LIST_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CHILD_ACCOUNT_LIST_STORAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                total_records: action.total_record,
                errorMsg: ""
            }
        case CHILD_ACCOUNT_LIST_STORAGE_RESPONSE_RESET:
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

export default ChildAccountListStorageReducer