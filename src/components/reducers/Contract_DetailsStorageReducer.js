import { CONTRACT_DETAILS_STORAGE_FAIL, CONTRACT_DETAILS_STORAGE_SUCCESS} from "../actions/contract_management/ContractDetailsStorageAction"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const ContractDetailsStorageReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case CONTRACT_DETAILS_STORAGE_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case CONTRACT_DETAILS_STORAGE_SUCCESS:
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

export default ContractDetailsStorageReducer