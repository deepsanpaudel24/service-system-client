import axios from "axios"
// Action Types
export const ACCEPT_PROPOSAL_LOADING = 'ACCEPT_PROPOSAL_LOADING'
export const ACCEPT_PROPOSAL_FAIL =   'ACCEPT_PROPOSAL_FAIL'
export const ACCEPT_PROPOSAL_SERVER_FAIL =   'ACCEPT_PROPOSAL_SERVER_FAIL'
export const ACCEPT_PROPOSAL_SUCCESS = 'ACCEPT_PROPOSAL_SUCCESS'
export const ACCEPT_PROPOSAL_RESPONSE_RESET = 'ACCEPT_PROPOSAL_RESPONSE_RESET'

export const ProposalAcceptDispacther = (data, proposalId) => async dispatch => {
    try {
        dispatch({
            type: "ACCEPT_PROPOSAL_LOADING"
        })
        const config = {
            method: 'put',
            url: '/api/v1/proposal/'+ proposalId,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "ACCEPT_PROPOSAL_SUCCESS",
                payload: res.data,
            })

        })
        .catch((error) => {
            dispatch({
                type: "ACCEPT_PROPOSAL_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "ACCEPT_PROPOSAL_FAIL"
        })
    }
}

export const ProposalAcceptDispatcherResponseReset = () =>async dispatch  => {
    dispatch({
        type: "ACCEPT_PROPOSAL_RESPONSE_RESET"
    })
}
