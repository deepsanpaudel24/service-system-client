import { TRANSACTIONS_LIST_STORAGE_FAIL, TRANSACTIONS_LIST_STORAGE_SUCCESS, TRANSACTIONS_LIST_STORAGE_RESPONSE_RESET} from "../actions/payment_module/TransactionsListStorage"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const TransactionsCaseListReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case TRANSACTIONS_LIST_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case TRANSACTIONS_LIST_STORAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case TRANSACTIONS_LIST_STORAGE_RESPONSE_RESET:
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

export default TransactionsCaseListReducer