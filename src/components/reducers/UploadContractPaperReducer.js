import { UPLOAD_CONTRACT_PAPER_LOADING, UPLOAD_CONTRACT_PAPER_FAIL, UPLOAD_CONTRACT_PAPER_SERVER_FAIL, UPLOAD_CONTRACT_PAPER_SUCCESS } from "../actions/case_management/UploadContractPaperAction"

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: ""
}

const UploadContractPaperReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case UPLOAD_CONTRACT_PAPER_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case UPLOAD_CONTRACT_PAPER_FAIL:
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case UPLOAD_CONTRACT_PAPER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: ""
            }
        case UPLOAD_CONTRACT_PAPER_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default UploadContractPaperReducer