import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ProfileNav from "./Profile_nav";
import _, { isEmpty } from "lodash";
import { PulseLoader } from "react-spinners";
import CreatableSelect from "react-select/creatable";
import DetailedInformationIcon from "../../images/setup_profile_detailed.png";
import { UpdateUserDetailedProfile } from "../actions/UserProfileSetupAction";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";

const ProfileSetupDetailed = ({ t }, props) => {
  const history = useHistory();
  const [serviceType, setServiceType] = useState("both");
  const [serviceCategories, setServiceCategories] = useState("");
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const [userType, setUserType] = useState("NR");
  const dispatch = useDispatch();
  const response = useSelector((state) => state.updateDetailedProfileResponse);

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

  const handleSericeType = (e) => {
    setServiceType(e.target.value);
  };

  const handleServiceCategories = (e) => {
    var values = [];
    if (isEmpty(e)) {
      //
    } else {
      e.map((item, index) => {
        values.push(item.value);
      });
      setServiceCategories(values.toString());
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

  const handleStepTwoSubmit = () => {
    if (!_.isEmpty(serviceType) && !_.isEmpty(serviceCategories)) {
      setFormErrorMsg("");
      var data = {
        service_type: serviceType,
        service_categories: serviceCategories,
      };
      localStorage.setItem("service_type", serviceType);
      localStorage.setItem("service_categories", serviceCategories);
      history.push("/user/setup/profile/basic");
    } else {
      setFormErrorMsg("Please fill up all the required fields.");
    }
  };

  const showData = () => {
    return (
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-5 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={() => handleStepTwoSubmit()}
      >
        {t("continue")}
      </button>
    );
  };

  const options = [
    { label: "Law", value: "law" },
    { label: "Account", value: "account" },
  ];

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
          <div class="container mx-auto w-auto py-4">
            <form>
              <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                <div class="flex mb-4">
                  <div class="w-1/6  h-15"></div>
                  <div class="w-4/6  h-15">
                    <h1 class="text-3xl my-5" style={{ textAlign: "center" }}>
                      {t("setup_company_profile_greeting")}
                    </h1>
                    <p
                      class="text-1xl mt-5 mb-10 text-gray-500 text-s italic"
                      style={{ textAlign: "center" }}
                    >
                      {t("fill_up_details")}
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
                  <div class="w-1/6"></div>
                  <div class="w-2/6 ">
                    <img src={DetailedInformationIcon} alt="Select user type" />
                  </div>
                  <div class="w-2/6">
                    <div class="flex justify-between">
                      <form>
                        <div class="flex items-center mr-4 mb-1">
                          <label
                            class="block text-black text-md mb-2"
                            for="name"
                          >
                            {t("service_type")}
                          </label>
                        </div>
                        <div class="flex items-center mr-4 mb-4">
                          <input
                            id="radio1"
                            type="radio"
                            name="radio"
                            class="hidden"
                            value="law"
                            onClick={(e) => {
                              handleSericeType(e);
                            }}
                          />
                          <label
                            for="radio1"
                            class="flex items-center cursor-pointer mr-4"
                          >
                            <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                            <p class="text-gray-800">{t("law")}</p>
                          </label>
                          <input
                            id="radio2"
                            type="radio"
                            name="radio"
                            class="hidden"
                            value="account"
                            onClick={(e) => {
                              handleSericeType(e);
                            }}
                          />
                          <label
                            for="radio2"
                            class="flex items-center cursor-pointer mr-4"
                          >
                            <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                            <p class="text-gray-800">{t("account")}</p>
                          </label>
                          <input
                            id="radio3"
                            type="radio"
                            name="radio"
                            class="hidden"
                            value="both"
                            onClick={(e) => {
                              handleSericeType(e);
                            }}
                          />
                          <label
                            for="radio3"
                            class="flex items-center cursor-pointer mr-4"
                          >
                            <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                            <p class="text-gray-800">{t("both")}</p>
                          </label>
                        </div>
                        <p class="text-gray-500 text-xs italic">
                          {t("hint_for_service_category")}
                        </p>
                        <div class="flex items-center mr-4 mt-2 mb-1">
                          <label
                            class="block text-black text-md mb-2"
                            for="name"
                          >
                            {t("service_categories")}
                          </label>
                        </div>
                        <CreatableSelect
                          isMulti
                          onChange={(e) => handleServiceCategories(e)}
                          options={options}
                        />
                      </form>
                    </div>
                    <div class="flex justify-end">{showData()}</div>
                  </div>
                  <div class="w-1/6"></div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withTranslation()(ProfileSetupDetailed);
