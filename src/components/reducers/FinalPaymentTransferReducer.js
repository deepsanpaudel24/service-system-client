import { FINAL_PAYMENT_TRANSFER_LOADING, FINAL_PAYMENT_TRANSFER_FAIL, FINAL_PAYMENT_TRANSFER_SERVER_FAIL , FINAL_PAYMENT_TRANSFER_SUCCESS, FINAL_PAYMENT_TRANSFER_RESPONSE_RESET} from "../actions/case_management/FinalPaymentTransferAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const FinalPaymentTransferReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case FINAL_PAYMENT_TRANSFER_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case FINAL_PAYMENT_TRANSFER_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case FINAL_PAYMENT_TRANSFER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case FINAL_PAYMENT_TRANSFER_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        case FINAL_PAYMENT_TRANSFER_RESPONSE_RESET:
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

export default FinalPaymentTransferReducer