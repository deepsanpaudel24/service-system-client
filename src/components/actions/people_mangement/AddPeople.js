import axios from "axios"
// Action Types
export const ADD_PEOPLE_LOADING = 'ADD_PEOPLE_LOADING'
export const ADD_PEOPLE_FAIL =   'ADD_PEOPLE_FAIL'
export const ADD_PEOPLE_SERVER_FAIL =   'ADD_PEOPLE_SERVER_FAIL'
export const ADD_PEOPLE_SUCCESS = 'ADD_PEOPLE_SUCCESS'
export const ADD_PEOPLE_RESPONSE_RESET = 'ADD_PEOPLE_RESPONSE_RESET'


export const AddPeopleDispatcher = (data, addNext) => async dispatch => {
    try {
        dispatch({
            type: "ADD_PEOPLE_LOADING"
        })
        const config = {
            method: 'post',
            url: '/api/v1/people',
            headers: { 
                'Content-Type': 'application/json'
              },
            data: data
        }
        await axios(config)
        .then((res) => {
            dispatch({
                type: "ADD_PEOPLE_SUCCESS",
                payload: res.data,
                addNext: addNext
            })

        })
        .catch((error) => {
            dispatch({
                type: "ADD_PEOPLE_SERVER_FAIL",
                serverErrorMsg: error.response.data['message']
            })
        })
    }
    catch (e) {
        dispatch({
            type: "ADD_PEOPLE_FAIL"
        })
    }
}

export const AddPeopleResponseReset = () => async dispatch => {
    dispatch({
        type: "ADD_PEOPLE_RESPONSE_RESET"
    })
}
