import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { RegisterUser } from "../actions/AccountAction";
import NavAccount from "./Nav";
import validator from "validator";
import PasswordStrengthBar from "react-password-strength-bar";
import { PulseLoader } from "react-spinners";
import { SendEmailConfirmationDispatcher } from "../actions/SendEmailConfirmationAction";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";
const Register = ({ t }) => {
  //create state
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mailSent, setmailSent] = useState(false);
  const dispatch = useDispatch();
  const response = useSelector((state) => state.resgiterResponse);

  const handleEmailChange = (e) => {
    setEmail(e.target.value.trim());
    if (validator.isEmail(email)) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.trim());
    if (!password.length < 7) {
      setPasswordError("");
    }
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value.trim());
    setConfirmPasswordValid("");
  };

  var data = {
    email: email,
    password: password,
    confirm_password: confirmPassword,
  };

  const strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  const dataValidator = (e) => {
    e.preventDefault();
    if (email == "") {
      setEmailError("Please enter your email.");
    } else if (!validator.isEmail(email)) {
      setEmailError("The email address is not valid.");
    } else if (!strongRegex.test(password)) {
      setPasswordError("Password must meet all the criteria.");
    } else if (confirmPassword == "") {
      setConfirmPasswordValid("Please confirm the password.");
    } else if (confirmPassword !== password) {
      setConfirmPasswordValid(
        "Does not match with the password above. please try again."
      );
    } else {
      localStorage.setItem("emailID", email);
      var edata = {
        email: email,
      };
      dispatch(RegisterUser(data));
      dispatch(SendEmailConfirmationDispatcher(edata));
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

  const showMessage = () => {
    if (!_.isEmpty(response.data)) {
      history.push("/user/login");
    }
  };

  const showData = () => {
    if (response.loading) {
      return (
        <div class="m-auto">
          <PulseLoader size={10} color={"#6DADE3"} loading={true} />
        </div>
      );
    }
    return (
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        {t("sign_up")}
      </button>
    );
  };
  return (
    <div>
      <div>
        <NavAccount />
      </div>
      <div class="container mx-auto w-full max-w-sm py-4">
        <form onSubmit={dataValidator}>
          <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            {showServerError()}
            {showMessage()}
            <p class="text-3xl my-3" style={{ textAlign: "center" }}>
              {t("sign_up")}
            </p>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="email"
              >
                {t("email")}
              </label>
              {emailError == "" ? (
                <div>
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="text"
                    placeholder="email"
                    onChange={(e) => handleEmailChange(e)}
                  />
                </div>
              ) : (
                <div>
                  <input
                    class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="text"
                    placeholder="email"
                    onChange={(e) => handleEmailChange(e)}
                  />
                  <p class="text-red-500 text-xs italic">{emailError}</p>
                </div>
              )}
            </div>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                {t("password")}
              </label>
              {password == "" && passwordError == "" ? (
                <div>
                  <p class="text-gray-500 text-xs italic">
                    {t("password_hint")}
                  </p>
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="******************"
                    onChange={(e) => handlePasswordChange(e)}
                  />
                </div>
              ) : passwordError == "" ? (
                <div>
                  <p class="text-gray-500 text-xs italic">
                    {t("password_hint")}
                  </p>
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="******************"
                    onChange={(e) => handlePasswordChange(e)}
                  />
                  <PasswordStrengthBar password={password} />
                </div>
              ) : (
                <div>
                  <p class="text-gray-500 text-xs italic">
                    {t("password_hint")}
                  </p>
                  <input
                    class="shadow appearance-none border border-orange-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="******************"
                    onChange={(e) => handlePasswordChange(e)}
                  />
                  <p class="text-red-500 text-xs italic">{passwordError}</p>
                  <PasswordStrengthBar password={password} />
                </div>
              )}
            </div>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                {t("confirm_password")}
              </label>
              {confirmPasswordValid == "" ? (
                <div>
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="******************"
                    onChange={(e) => handleConfirmPassword(e)}
                  />
                </div>
              ) : (
                <div>
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="******************"
                    onChange={(e) => handleConfirmPassword(e)}
                  />
                  <p class="text-red-500 text-xs italic">
                    {confirmPasswordValid}
                  </p>
                </div>
              )}
            </div>
            <div
              class="flex justify-between my-4"
              style={{ justifyContent: "center" }}
            >
              {showData()}
            </div>
            <div
              class="flex justify-between my-4"
              style={{ justifyContent: "center" }}
            >
              <a
                class="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800"
                href="/user/login"
              >
                {t("already_have_account")}
              </a>
            </div>
          </div>
        </form>
        <p class="text-center text-gray-500 text-xs">&copy;{t("copyright")}</p>
      </div>
    </div>
  );
};

export default withTranslation()(Register);
