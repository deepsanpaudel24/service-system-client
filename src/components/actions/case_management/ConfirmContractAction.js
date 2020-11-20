// Action Types
export const CONFIRM_CONTRACT_FAIL =   'CONFIRM_CONTRACT_FAIL'
export const CONFIRM_CONTRACT_SUCCESS = 'CONFIRM_CONTRACT_SUCCESS'


export const ConfirmContractDispatcher = (data) => dispatch => {
    try {
        dispatch({
            type: "CONFIRM_CONTRACT_SUCCESS",
            payload: data,
        })
    }
    catch (e) {
        dispatch({
            type: "CONFIRM_CONTRACT_FAIL"
        })
    }
}
