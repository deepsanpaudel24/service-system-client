import { CONFIRM_CONTRACT_FAIL, CONFIRM_CONTRACT_SUCCESS} from "../actions/case_management/ConfirmContractAction"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const ConfirmContractReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CONFIRM_CONTRACT_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CONFIRM_CONTRACT_SUCCESS:
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

export default ConfirmContractReducer