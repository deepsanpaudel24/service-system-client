import { CASE_DETAILS_STORAGE_FAIL, CASE_DETAILS_STORAGE_SUCCESS} from "../actions/case_management/CaseDetailsStorage"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const CaseDetailsStorageReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CASE_DETAILS_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CASE_DETAILS_STORAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        default:
            return state
    }
}

export default CaseDetailsStorageReducer