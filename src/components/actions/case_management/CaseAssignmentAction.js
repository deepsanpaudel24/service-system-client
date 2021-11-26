import axios from "axios";
// Action Types
export const CASE_ASSIGNMENT_LOADING = "CASE_ASSIGNMENT_LOADING";
export const CASE_ASSIGNMENT_FAIL = "CASE_ASSIGNMENT_FAIL";
export const CASE_ASSIGNMENT_SERVER_FAIL = "CASE_ASSIGNMENT_SERVER_FAIL";
export const CASE_ASSIGNMENT_SUCCESS = "CASE_ASSIGNMENT_SUCCESS";

export const CaseAssignmentDispatcher = (data, caseId) => async (dispatch) => {
  try {
    dispatch({
      type: "CASE_ASSIGNMENT_LOADING",
    });
    const config = {
      method: "put",
      url: "/api/v1/case-assign/" + caseId,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      data: data,
    };
    await axios(config)
      .then((res) => {
        dispatch({
          type: "CASE_ASSIGNMENT_SUCCESS",
          payload: res.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: "CASE_ASSIGNMENT_SERVER_FAIL",
          serverErrorMsg: error.response.data["message"],
        });
      });
  } catch (e) {
    dispatch({
      type: "CASE_ASSIGNMENT_FAIL",
    });
  }
};
