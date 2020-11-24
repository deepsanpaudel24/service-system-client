import { PEOPLES_LIST_STORAGE_FAIL, PEOPLES_LIST_STORAGE_SUCCESS, PEOPLES_LIST_STORAGE_RESPONSE_RESET} from "../actions/people_mangement/PeopleListStorage"

const DefaultState = {
    loading: false,
    data: [],
    total_records:0,
    errorMsg: "",
    serverErrorMsg: ""
}

const PeoplesListStorageReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case PEOPLES_LIST_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case PEOPLES_LIST_STORAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                total_records: action.total_record,
                errorMsg: ""
            }
        case PEOPLES_LIST_STORAGE_RESPONSE_RESET:
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

export default PeoplesListStorageReducer