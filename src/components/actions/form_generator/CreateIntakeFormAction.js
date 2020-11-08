import axios from "axios";
// Action Types
export const CREATE_INTAKE_FORM_LOADING = "CREATE_INTAKE_FORM_LOADING";
export const CREATE_INTAKE_FORM_FAIL = "CREATE_INTAKE_FORM_FAIL";
export const CREATE_INTAKE_FORM_SERVER_FAIL = "CREATE_INTAKE_FORM_SERVER_FAIL";
export const CREATE_INTAKE_FORM_SUCESS = "CREATE_INTAKE_FORM_SUCESS";
export const CREATE_INTAKE_FORM_RESPONSE_RESET =
  "CREATE_INTAKE_FORM_RESPONSE_RESET";

export const CreateIntakeFormDispatcher = (data) => async (dispatch) => {
  try {
    dispatch({
      type: "CREATE_INTAKE_FORM_LOADING",
    });
    const config = {
      method: "post",
      url: "/api/v1/intake-form",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      data: data,
    };
    await axios(config)
      .then((res) => {
        dispatch({
          type: "CREATE_INTAKE_FORM_SUCESS",
          payload: res.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: "CREATE_INTAKE_FORM_SERVER_FAIL",
          serverErrorMsg: error.response.data["message"],
        });
      });
  } catch (e) {
    dispatch({
      type: "CREATE_INTAKE_FORM_FAIL",
    });
  }
};

export const CreateIntakeFormResponseReset = () => async (dispatch) => {
  dispatch({
    type: "CREATE_INTAKE_FORM_RESPONSE_RESET",
  });
};

