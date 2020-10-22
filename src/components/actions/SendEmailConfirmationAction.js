import axios from "axios";
//import axios from "../Axios";

export const SendEmailConfirmationDispatcher = (data) => async dispatch => {
    try {
        const config = {
            method: 'post',
            url: '/api/v1/user/send-email-confirmation',
            headers: { 
                'Content-Type': 'application/json'
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            // see the res.data
        })
        .catch((error) => {
            // take the error.response
        })
    }
    catch (e) {

    }
}