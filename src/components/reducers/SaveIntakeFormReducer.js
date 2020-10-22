import { SAVE_INTAKE_FORM_LOADING, SAVE_INTAKE_FORM_FAIL, SAVE_INTAKE_FORM_SERVER_FAIL ,SAVE_INTAKE_FORM_SUCESS} from "../actions/form_generator/SaveIntakeFormAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
}

const SaveIntakeFormReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case SAVE_INTAKE_FORM_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case SAVE_INTAKE_FORM_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case SAVE_INTAKE_FORM_SUCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case SAVE_INTAKE_FORM_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default SaveIntakeFormReducer