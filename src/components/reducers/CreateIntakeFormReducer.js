import {
  CREATE_INTAKE_FORM_LOADING,
  CREATE_INTAKE_FORM_FAIL,
  CREATE_INTAKE_FORM_SERVER_FAIL,
  CREATE_INTAKE_FORM_SUCESS,
} from "../actions/form_generator/CreateIntakeFormAction";

const DefaultState = {
  loading: false,
  data: [],
  errorMsg: "",
  serverErrorMsg: "",
};

const CreateIntakeFormReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case CREATE_INTAKE_FORM_LOADING:
      return {
        ...state,
        loading: true,
        errorMsg: "",
      };
    case CREATE_INTAKE_FORM_FAIL:
      return {
        ...state,
        loading: false,
        errorMsg: "Something went wrong",
      };
    case CREATE_INTAKE_FORM_SUCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        errorMsg: "",
      };
    case CREATE_INTAKE_FORM_SERVER_FAIL:
      return {
        ...state,
        loading: false,
        serverErrorMsg: action.serverErrorMsg,
      };
    default:
      return state;
  }
};

export default CreateIntakeFormReducer;
