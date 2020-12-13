import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { GetNewPassword } from "../actions/AccountAction";
import NavAccount from "./Nav";
import PasswordStrengthBar from "react-password-strength-bar";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { PulseLoader } from "react-spinners";

const ResetPassword = ({ t }) => {
  const history = useHistory();
  //create state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const response = useSelector((state) => state.resetPasswordResponse);

  useEffect(() => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    setToken(urlvalues[3]);
  }, []);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!password.length < 7) {
      setPasswordError("");
    }
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordValid("");
  };

  const dataValidator = () => {
    if (password.length < 7) {
      setPasswordError("Password must contain more than 6 letters.");
    } else if (confirmPassword == "") {
      setConfirmPasswordValid("Please confirm the password.");
    } else if (confirmPassword !== password) {
      setConfirmPasswordValid(
        "Does not match with the password above. please try again."
      );
    } else {
      var data = {
        password: password,
      };
      dispatch(GetNewPassword(data, token));
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
      return history.push("/user/login");
    }
  };

  const showData = () => {
    if (response.loading) {
      return (
        <PulseLoader size={10} color={"#6DADE3"} loading={true} />
      );
    }
    return (
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={() => dataValidator()}
      >
        {t("submit")}
      </button>
    );
  };
  return (
    <div>
      <div>
        <NavAccount />
      </div>
      <div class="container mx-auto w-full max-w-sm py-4">
        <form>
          <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            {showServerError()}
            {showMessage()}
            <p class="text-3xl my-3" style={{ textAlign: "center" }}>
              {t("reset_password")}
            </p>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                {t("password")}
              </label>
              {password == "" && passwordError == "" ? (
                <div>
                  <p class="text-gray-500 text-xs italic"></p>
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
                    {t("password_keeping_hint")}
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
                    {t("password_keeping_hint")}
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
              class="flex justify-between"
              style={{ justifyContent: "center" }}
            >
              {showData()}
            </div>
          </div>
        </form>
        <p class="text-center text-gray-500 text-xs">
          &copy;{t("copyright")}
        </p>
      </div>
    </div>
  );
};

export default withTranslation() (ResetPassword);
