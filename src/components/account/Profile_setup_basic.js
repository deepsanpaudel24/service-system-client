import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ProfileNav from "./Profile_nav";
import _ from "lodash";
import luhn from "luhn";
import { PulseLoader } from "react-spinners";
import BasicInformationIcon from "../../images/profile_setup_basic_information-1.png";
import { UpdateUserBasicProfile } from "../actions/UserProfileSetupAction";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";

const ProfileSetupBasic = ({ t }) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const [userType, setUserType] = useState("NR");
  const dispatch = useDispatch();
  const response = useSelector((state) => state.updateBasicProfileResponse);

  useLayoutEffect(() => {
    const config = {
      method: "get",
      url: "/api/v1/user/validity",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then((res) => {
        setUserType(res.data["user_type"]);
      })
      .catch((error) => {
        history.push("/user/login");
      });
  }, []);

  useEffect(() => {}, [userType]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePersonalNumberChange = (e) => {
    setPersonalNumber(e.target.value);
  };

  const handleRegistrationNumberChange = (e) => {
    setRegistrationNumber(e.target.value);
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

  const handleStepOneSubmit = () => {
    if (userType == "SPCA" || userType == "CCA") {
      if (
        !_.isEmpty(name) &&
        !_.isEmpty(address) &&
        !_.isEmpty(phoneNumber) &&
        !_.isEmpty(registrationNumber)
      ) {
        setFormErrorMsg("");
        var data = {
          name: name,
          address: address,
          phone_number: phoneNumber,
          registration_number: registrationNumber,
        };
        localStorage.setItem("name", name);
        localStorage.setItem("address", address);
        localStorage.setItem("phone_number", phoneNumber);
        localStorage.setItem("registration_number", registrationNumber);
        return history.push("/user/setup/profile/preferences");
      } else {
        setFormErrorMsg("Please fill up all the required fields.");
      }
    } else {
      if (
        !_.isEmpty(name) &&
        !_.isEmpty(address) &&
        !_.isEmpty(phoneNumber) &&
        !_.isEmpty(personalNumber)
      ) {
        if (personalNumber.length == 10) {
          if (luhn.validate(personalNumber)) {
            setFormErrorMsg("");
            var data = {
              name: name,
              address: address,
              phone_number: phoneNumber,
              personal_number: personalNumber,
            };
            //dispatch(UpdateUserBasicProfile(data))
            localStorage.setItem("name", name);
            localStorage.setItem("address", address);
            localStorage.setItem("phone_number", phoneNumber);
            localStorage.setItem("personal_number", personalNumber);
            return history.push("/user/setup/profile/preferences");
          } else {
            setFormErrorMsg("Not a valid personal number");
          }
        } else {
          setFormErrorMsg("Not a valid personal number");
        }
      } else {
        setFormErrorMsg("Please fill up all the required fields.");
      }
    }
  };

  const showData = () => {
    return (
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={() => handleStepOneSubmit()}
      >
        {t("continue")}
      </button>
    );
  };

  return (
    <div>
      {userType == "NR" ? (
        <div class="flex h-screen">
          <div class="m-auto">
            <PulseLoader size={10} color={"#6DADE3"} loading={true} />
          </div>
        </div>
      ) : (
        <div>
          {showServerError()}
          <div>
            <ProfileNav />
          </div>
          {userType == "SPCA" || userType == "CCA" ? (
            <div class="container mx-auto w-auto py-4">
              <form>
                <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                  <div class="flex mb-4">
                    <div class="w-1/6  h-15"></div>
                    <div class="w-4/6  h-15">
                      <h1 class="text-3xl my-5" style={{ textAlign: "center" }}>
                        {t("info_will_help")}
                      </h1>
                      <p
                        class="text-1xl mt-5 mb-10 text-gray-500 text-s italic"
                        style={{ textAlign: "center" }}
                      >
                        {t("fill_company_info")}
                      </p>
                    </div>
                    <div class="w-1/6  h-15"></div>
                  </div>
                  <div class="flex mb-4">
                    <div class="w-2/6  h-15"></div>
                    <div class="w-2/6  h-15">
                      {formErrorMsg == "" ? (
                        ""
                      ) : (
                        <div>
                          <div
                            class="bg-red-100 border-l-4 border-orange-500 text-orange-700 p-4"
                            role="alert"
                          >
                            <p>{formErrorMsg}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div class="w-2/6  h-15"></div>
                  </div>
                  <div class="flex mb-4">
                    <div class="w-2/6 ">
                      <img src={BasicInformationIcon} alt="Select user type" />
                    </div>
                    <div class="w-2/6">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="name"
                      >
                        {t("company_name")}
                      </label>
                      <input
                        class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Company name"
                        onChange={(e) => handleNameChange(e)}
                        style={{ width: "80%" }}
                      />
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="address"
                      >
                        {t("address")}
                      </label>
                      <input
                        class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="address"
                        type="text"
                        placeholder="Company address"
                        onChange={(e) => handleAddressChange(e)}
                        style={{ width: "80%" }}
                      />
                    </div>
                    <div class="w-2/6 ">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="phone_number"
                      >
                        {t("phone_number")}
                      </label>
                      <input
                        class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="phone_number"
                        type="text"
                        placeholder="Phone number"
                        onChange={(e) => handlePhoneNumberChange(e)}
                        style={{ width: "80%" }}
                      />
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="registration_number"
                      >
                        {t("registration_number")}
                      </label>
                      <input
                        class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="registration_number"
                        type="text"
                        placeholder="Registration number"
                        onChange={(e) => handleRegistrationNumberChange(e)}
                        style={{ width: "80%" }}
                      />
                      <div
                        class="flex justify-end"
                        style={{ marginRight: "20%" }}
                      >
                        {showData()}
                      </div>
                    </div>
                    <div class="w-1/6 "></div>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div class="container mx-auto w-auto py-4">
              <form>
                <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                  <div class="flex mb-4">
                    <div class="w-1/6  h-15"></div>
                    <div class="w-4/6  h-15">
                      <h1 class="text-3xl my-5" style={{ textAlign: "center" }}>
                        {t("setup_person_profile_greeting")}
                      </h1>
                      <p
                        class="text-1xl mt-5 mb-10 text-gray-500 text-s italic"
                        style={{ textAlign: "center" }}
                      >
                        {t("fill_person_info")}
                      </p>
                    </div>
                    <div class="w-1/6  h-15"></div>
                  </div>
                  <div class="flex mb-4">
                    <div class="w-2/6  h-15"></div>
                    <div class="w-2/6  h-15">
                      {formErrorMsg == "" ? (
                        ""
                      ) : (
                        <div>
                          <div
                            class="bg-red-100 border-l-4 border-orange-500 text-orange-700 p-4"
                            role="alert"
                          >
                            <p>{formErrorMsg}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div class="w-2/6  h-15"></div>
                  </div>
                  <div class="flex mb-4">
                    <div class="w-2/6 ">
                      <img src={BasicInformationIcon} alt="Select user type" />
                    </div>
                    <div class="w-2/6">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="name"
                      >
                        {t("name")}
                      </label>
                      <input
                        class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Company name"
                        onChange={(e) => handleNameChange(e)}
                        style={{ width: "80%" }}
                      />
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="address"
                      >
                       {t("address")}
                      </label>
                      <input
                        class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="address"
                        type="text"
                        placeholder="Company address"
                        onChange={(e) => handleAddressChange(e)}
                        style={{ width: "80%" }}
                      />
                    </div>
                    <div class="w-2/6 ">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="phone_number"
                      >
                        {t("phone_number")}
                      </label>
                      <input
                        class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="phone_number"
                        type="text"
                        placeholder="Phone number"
                        onChange={(e) => handlePhoneNumberChange(e)}
                        style={{ width: "80%" }}
                      />
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="registration_number"
                      >
                       {t("personal_number")}
                      </label>
                      <input
                        class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="registration_number"
                        type="text"
                        placeholder="Registration number"
                        onChange={(e) => handlePersonalNumberChange(e)}
                        style={{ width: "80%" }}
                      />
                      <div
                        class="flex justify-end"
                        style={{ marginRight: "20%" }}
                      >
                        {showData()}
                      </div>
                    </div>
                    <div class="w-1/6 "></div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default withTranslation()(ProfileSetupBasic);
