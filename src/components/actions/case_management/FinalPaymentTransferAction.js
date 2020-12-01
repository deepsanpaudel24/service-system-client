import axios from "axios"
// Action Types
export const FINAL_PAYMENT_TRANSFER_LOADING = 'FINAL_PAYMENT_TRANSFER_LOADING'
export const FINAL_PAYMENT_TRANSFER_FAIL =   'FINAL_PAYMENT_TRANSFER_FAIL'
export const FINAL_PAYMENT_TRANSFER_SERVER_FAIL =   'FINAL_PAYMENT_TRANSFER_SERVER_FAIL'
export const FINAL_PAYMENT_TRANSFER_SUCCESS = 'FINAL_PAYMENT_TRANSFER_SUCCESS'
export const FINAL_PAYMENT_TRANSFER_RESPONSE_RESET = 'FINAL_PAYMENT_TRANSFER_RESPONSE_RESET'

export const FinalPaymentTransferDispatcher = (data) => async dispatch => {
    try {
        dispatch({
            type: "FINAL_PAYMENT_TRANSFER_SUCCESS",
            payload: data,
        })

    }
    catch (e) {
        dispatch({
            type: "FINAL_PAYMENT_TRANSFER_FAIL"
        })
    }
}

export const FinalPaymentTransferDispatcherResponseReset = () =>async dispatch  => {
    dispatch({
        type: "FINAL_PAYMENT_TRANSFER_RESPONSE_RESET"
    })
}
