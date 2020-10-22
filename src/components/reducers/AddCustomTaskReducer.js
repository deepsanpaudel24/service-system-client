import { ADD_CUSTOM_TASK_LOADING, ADD_CUSTOM_TASK_FAIL, ADD_CUSTOM_TASK_SERVER_FAIL , ADD_CUSTOM_TASK_SUCCESS, ADD_CUSTOM_TASK_RESPONSE_RESET} from "../actions/custom_task/AddCustomTaskAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const AddCustomTaskReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case ADD_CUSTOM_TASK_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case ADD_CUSTOM_TASK_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case ADD_CUSTOM_TASK_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case ADD_CUSTOM_TASK_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case ADD_CUSTOM_TASK_RESPONSE_RESET:
            return {
                ...state,
                loading: false,
                data: [],
                errorMsg: "",
                serverErrorMsg: "",
                emailConfirmationMessage: ""
                
            }
        default:
            return state
    }
}

export default AddCustomTaskReducer