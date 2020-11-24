import { CLIENT_LIST_STORAGE_FAIL, CLIENT_LIST_STORAGE_SUCCESS, CLIENT_LIST_STORAGE_RESPONSE_RESET} from "../actions/client_management/ClientListStorage"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const ClientListStorageReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CLIENT_LIST_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CLIENT_LIST_STORAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case CLIENT_LIST_STORAGE_RESPONSE_RESET:
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

export default ClientListStorageReducer