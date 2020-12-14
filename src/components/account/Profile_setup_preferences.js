import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ProfileNav from "./Profile_nav";
import _ from "lodash";
import luhn from "luhn";
import { PulseLoader } from "react-spinners";
import BasicInformationIcon from "../../images/profile_setup_basic_information-1.png";
import {
  UpdateUserBasicProfile,
  UpdateUserDetailedProfile,
} from "../actions/UserProfileSetupAction";
import { MdFileUpload } from "react-icons/md";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { VscClose } from "react-icons/vsc";

const ProfileSetupPreferences = ({ t }) => {
  const history = useHistory();
  const [fileNameToShow, setFileNameToShow] = useState([]);
  const [currencyPreferences, setCurrencyPreferences] = useState("ymd");
  const [datePreferences, setDatePreferences] = useState("usd");
  const [fileToSend, setFileToSend] = useState([]);
  const [introType, setIntroType] = useState("file");
  const [introDesc, setIntroDesc] = useState("");
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

  const handleCurrencyPreferences = (e) => {
    setCurrencyPreferences(e.target.value);
  };

  const handleDatePreferences = (e) => {
    setDatePreferences(e.target.value);
  };

  const handleDescChange = (e) => {
    setIntroDesc(e.target.value);
  };

  // allowed file types
  const fileTypes = [
    "video/3gpp",
    "video/3gpp2",
    "video/3gp2",
    "video/mpeg",
    "video/mp4",
    "video/ogg",
    "video/webm",
    "video/quicktime",
  ];

  //Validate files
  const validateFile = (file) => {
    return fileTypes.includes(file.type);
  };

  const handleFileUpload = (e) => {
    var targetFiles = e.target.files;
    var validateFilesList = [];
    for (let file of targetFiles) {
      if (validateFile(file)) {
        validateFilesList.push(file);
      } else {
        console.log("File Not valid....");
      }
    }
    setFileToSend(validateFilesList);
    // loop through files
    var files = e.target.files;
    var filesNameList = [];
    for (var i = 0; i < files.length; i++) {
      // get item
      var file = files.item(i);
      filesNameList.push(file.name);
    }
    setFileNameToShow(filesNameList);
  };

  const handleRemoveChatFile = (name, index) => {
    var filteredFileList = [];
    var fileList = fileToSend;
    var NewFileNameList = fileNameToShow;

    for (var i = 0; i < fileList.length; i++) {
      var file = fileList[i];
      if (file.name !== name) {
        filteredFileList.push(file);
      }
    }
    NewFileNameList.splice(index, 1);
    setFileToSend(filteredFileList);
    setFileNameToShow(NewFileNameList);
  };

  const handleTextIntroType = () => {
    setIntroType("text");
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

  const handleProfileDataSubmit = () => {
    if (userType == "SPCA" || userType == "CCA") {
      var data = {
        service_type: localStorage.getItem("service_type"),
        service_categories: localStorage.getItem("service_categories"),
        name: localStorage.getItem("name"),
        address: localStorage.getItem("address"),
        phone_number: localStorage.getItem("phone_number"),
        registration_number: localStorage.getItem("registration_number"),
        currency_preferences: currencyPreferences,
        date_preferences: datePreferences,
      };
      dispatch(UpdateUserDetailedProfile(data));
    } else {
      var data = {
        service_type: localStorage.getItem("service_type"),
        service_categories: localStorage.getItem("service_categories"),
        name: localStorage.getItem("name"),
        address: localStorage.getItem("address"),
        phone_number: localStorage.getItem("phone_number"),
        personal_number: localStorage.getItem("personal_number"),
        currency_preferences: currencyPreferences,
        date_preferences: datePreferences,
      };
      dispatch(UpdateUserDetailedProfile(data));
    }

    var formData = new FormData();
    for (let file of fileToSend) {
      formData.append(file.name, file);
    }
    formData.append("intro_text", introDesc);
    if (formData.length !== 0) {
      const config = {
        method: "put",
        url: "/api/v1/user/profile-introduction",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        data: formData,
      };
      axios(config)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  const showData = () => {
    if (!_.isEmpty(response.data)) {
      return history.push("/user/home");
    }
    if (response.loading) {
      return (
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          disabled
        >
          {t("Loading")}
        </button>
      );
    }
    return (
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={() => handleProfileDataSubmit()}
      >
        {t("submit")}
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
          <div class="container mx-auto w-auto py-4">
            <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
              <div class="flex mb-4">
                <div class="w-1/6  h-15"></div>
                <div class="w-4/6  h-15">
                  <h1 class="text-3xl my-5" style={{ textAlign: "center" }}>
                    {t("preference_heading")}
                  </h1>
                  <p
                    class="text-1xl mt-5 mb-10 text-gray-500 text-s italic"
                    style={{ textAlign: "center" }}
                  >
                    {t("fill_preference")}
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
                  <label class="block text-gray-700 text-sm mb-2" for="name">
                    {t("currency")}
                  </label>
                  <select
                    class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    style={{ width: "80%" }}
                    onChange={(e) => handleCurrencyPreferences(e)}
                  >
                    <option value="usd">USD</option>
                    <option value="pound">POUND</option>
                    <option value="euro">EURO</option>
                  </select>
                  <label class="block text-gray-700 text-sm mb-2" for="name">
                    {t("date_format")}
                  </label>
                  <select
                    class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    style={{ width: "80%" }}
                    onChange={(e) => handleDatePreferences(e)}
                  >
                    <option value="ymd">YYYY-MM-DD</option>
                    <option value="dmy">DD-MM-YYYY</option>
                    <option value="mdy">MM-DD-YYYY</option>
                  </select>
                </div>
                <div class="w-2/6 ">
                  <label class="block text-gray-700 text-sm mb-2" for="intro">
                    {t("introduction")} ({t("optional")})
                  </label>
                  {introType == "file" ? (
                    <div>
                      <label
                        for="allfilesMessage"
                        style={{ cursor: "pointer" }}
                      >
                        <a>
                          <em class="fa fa-upload"></em>{" "}
                          <span class="bg-gray-200 border border-gray-100 hover:bg-grey text-grey-darkest py-2 px-4 rounded inline-flex items-center">
                            <p class="text-lg">
                              <MdFileUpload />
                            </p>
                            <span> &nbsp;{t("attach_files")}</span>
                          </span>
                        </a>
                      </label>
                      <input
                        type="file"
                        name="allfilesMessage"
                        id="allfilesMessage"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(e)}
                        multiple
                        accept="video/mp4,video/x-m4v,video/*"
                      />
                      <button
                        class="text-sm text-blue-500 mx-4 focus:outline-none"
                        style={{ marginBottom: "2rem" }}
                        onClick={() => handleTextIntroType()}
                      >
                        {" "}
                        {t("write_a_text")}{" "}
                      </button>
                      {!_.isEmpty(fileNameToShow)
                          ? fileNameToShow.map((item, index) => {
                              return (
                                <div class="flex mx-3" style={{ marginBottom: "1rem" }}>
                                  <div class="w-4/5">
                                    <p>{item}</p>
                                  </div>
                                  <div class="w-1/5">
                                    <p
                                      class="text-red-400 mx-3 text-lg"
                                      onClick={() =>
                                        handleRemoveChatFile(item, index)
                                      }
                                    >
                                      <VscClose />
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          : ""}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        class="shadow appearance-none border rounded w-full mb-3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="title"
                        type="text"
                        style={{ minHeight: "8em", width: "80%" }}
                        onChange={(e) => handleDescChange(e)}
                      />
                    </div>
                  )}
                  <div class="flex justify-end" style={{ marginRight: "25%" }}>
                    {showData()}
                  </div>
                </div>
                <div class="w-1/6 "></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withTranslation()(ProfileSetupPreferences);
