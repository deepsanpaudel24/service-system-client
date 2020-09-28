import { ACCEPT_PROPOSAL_LOADING, ACCEPT_PROPOSAL_FAIL, ACCEPT_PROPOSAL_SERVER_FAIL , ACCEPT_PROPOSAL_SUCCESS} from "../actions/case_management/ProposalAcceptAction";

const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
    serverErrorMsg: "",
    emailConfirmationMessage: ""
}

const ProposalAcceptReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case ACCEPT_PROPOSAL_LOADING:
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        case ACCEPT_PROPOSAL_FAIL: 
            return {
                ...state,
                loading: false,
                errorMsg: "Something went wrong"
            }
        case ACCEPT_PROPOSAL_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                errorMsg: "",
            }
        case ACCEPT_PROPOSAL_SERVER_FAIL:
            return {
                ...state,
                loading: false,
                serverErrorMsg: action.serverErrorMsg
            }
        default:
            return state
    }
}

export default ProposalAcceptReducer