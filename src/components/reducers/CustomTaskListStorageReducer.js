import { CUSTOM_TASK_LIST_STORAGE_FAIL, CUSTOM_TASK_LIST_STORAGE_SUCCESS, CUSTOM_TASK_LSIT_STORAGE_RESPONSE_RESET} from "../actions/custom_task/CustomTaskListStorage"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const CustomTaskListStorageReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CUSTOM_TASK_LIST_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CUSTOM_TASK_LIST_STORAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case CUSTOM_TASK_LSIT_STORAGE_RESPONSE_RESET:
            return {
                ...state,
                loading: false,
                data:[],
                errorMsg: "",
                serverErrorMsg: ""
            }
        default:
            return state
    }
}

export default CustomTaskListStorageReducer