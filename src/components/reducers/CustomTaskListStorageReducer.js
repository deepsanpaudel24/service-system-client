import { CUSTOM_TASK_LIST_STORAGE_FAIL, CUSTOM_TASK_LIST_STORAGE_SUCCESS} from "../actions/custom_task/CustomTaskListStorage"

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
        default:
            return state
    }
}

export default CustomTaskListStorageReducer