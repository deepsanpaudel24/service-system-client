import { INTAKE_FORM_LIST_STORAGE_FAIL, INTAKE_FORM_LIST_STORAGE_SUCCESS} from "../actions/form_generator/IntakeFormListStorage"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const IntakeFormListStorageReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case INTAKE_FORM_LIST_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case INTAKE_FORM_LIST_STORAGE_SUCCESS:
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

export default IntakeFormListStorageReducer