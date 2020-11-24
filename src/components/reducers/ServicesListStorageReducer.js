import { SERVICES_LIST_STORAGE_FAIL, SERVICES_LIST_STORAGE_SUCCESS, SERVICES_LIST_STORAGE_RESPONSE_RESET} from "../actions/service_management/ServicesListStorage"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const SerivceListStorageReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case SERVICES_LIST_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case SERVICES_LIST_STORAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case SERVICES_LIST_STORAGE_RESPONSE_RESET:
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

export default SerivceListStorageReducer