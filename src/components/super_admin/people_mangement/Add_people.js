import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import _ from "lodash";
import validator from "validator";
import {
  AddPeopleDispatcher,
  AddPeopleResponseReset,
} from "../../actions/people_mangement/AddPeople";

import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";

const AddPeoples = ({ t }) => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const dispatch = useDispatch();
  const response = useSelector((state) => state.PeopleRegisterResponse);

  const handleEmailChange = (e) => {
    dispatch(AddPeopleResponseReset());
    setEmail(e.target.value);
    if (validator.isEmail(email)) {
      setEmailError("");
    }
  };

  const dataValidatorNext = () => {
    if (email == "") {
      setEmailError("Please enter email address.");
    } else if (!validator.isEmail(email)) {
      setEmailError("The email address is not valid.");
    } else {
      var data = {
        email: email,
      };
      var addNext = "true";
      dispatch(AddPeopleDispatcher(data, addNext));
    }
  };

  const dataValidator = () => {
    if (email == "") {
      setEmailError("Please enter email address.");
    } else if (!validator.isEmail(email)) {
      setEmailError("The email address is not valid.");
    } else {
      var data = {
        email: email,
      };
      dispatch(AddPeopleDispatcher(data));
    }
  };

  const showServerError = () => {
    if (!_.isEmpty(response.serverErrorMsg)) {
      return (
        <div
          class="bg-red-100 border-l-4 border-orange-500 text-orange-700 p-4"
          role="alert"
        >
          <p class="font-bold">{t("be_warned")}</p>
          <p>{response.serverErrorMsg}</p>
        </div>
      );
    }
  };

  const confirmEmployeeRegister = () => {
    if (!_.isEmpty(response.data)) {
      if (response.addNext == "true") {
        return (
          <div
            class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4"
            role="alert"
          >
            <p class="font-bold">{t("invitation_sent_successfully")}</p>
          </div>
        );
      }
      return history.push("/sadmin/peoples");
    }
  };

  const showData = () => {
    if (response.loading) {
      return (
        <div class="">
          <PulseLoader size={10} color={"#6DADE3"} loading={true} />
        </div>
      );
    }
    return (
      <div>
        <button
          class="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => dataValidatorNext()}
        >
          {t("invite_and_continue")}
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => dataValidator()}
        >
          {t("invite")}
        </button>
      </div>
    );
  };

  return (
    <div class="flex mb-4">
      <div class="w-3/5 ml-5">
        <form>
          <p class="text-3xl my-3">{t("Add account")}</p>
          {showServerError()}
          {confirmEmployeeRegister()}
          <div class="mt-6 mb-3">
            <label class="block text-gray-700 text-sm mb-2" for="password">
            {t("email")}
            </label>
            {emailError == "" ? (
              <div>
                <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="people_email"
                  type="text"
                  onChange={(e) => handleEmailChange(e)}
                />
              </div>
            ) : (
              <div>
                <input
                  class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="people_email"
                  type="text"
                  onChange={(e) => handleEmailChange(e)}
                />
                <p class="text-red-500 text-xs italic">{emailError}</p>
              </div>
            )}
          </div>
          <div class="flex justify-start my-5">{showData()}</div>
        </form>
      </div>
    </div>
  );
};

export default withTranslation()(AddPeoples);
