import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import _ from "lodash";
import EmpAvatar from "../../images/emp_avatar.jpg";
import { FaEdit } from "react-icons/fa";
import { VscClose } from "react-icons/vsc";
import {
  ProfileSettingDispatcher,
  ProfileSettingResponseReset,
} from "../actions/ProfileDetailsAction";
import {
  UpdateProfileIntroduction,
  UpdateProfileSetting,
} from "../actions/UpdateProfileAction";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import CreatableSelect from "react-select/creatable";
import { PulseLoader } from "react-spinners";
import VideoPlayer from "./video_player/VideoPlayer";
import { MdFileUpload } from "react-icons/md";
import SubscriptionCheckout from "./payments/Subscription_Checkout";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";
import ProfilePicAvatar from "../../images/profile_pic_avatar2.png";

const ProfileSetting = (props) => {
  const { t } = props;
  // declaring a global variables
  var scToSend = "";
  var datePreferencesToSend = "";
  var currencyPreferencesToSend = "";
  var languagePreferencesToSend = "";
  const [fileNameToShow, setFileNameToShow] = useState([]);
  const [showNameField, setShowNameField] = useState(false);
  const [name, setName] = useState("");
  const [showAddressField, setShowAddressField] = useState(false);
  const [address, setAddress] = useState("");
  const [showContactField, setShowContactField] = useState(false);
  const [contact, setContact] = useState("");
  const [showRegistrationField, setShowRegistrationField] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [showPersonalNumberField, setShowPersonalNumberField] = useState(false);
  const [personalNumber, setPersonalNumber] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showRevokeAlert, setShowRevokeAlert] = useState(false);
  const [showClearIncompleteAlert , setShowClearIncompleteAlert] = useState(false)
  const [serviceCategories, setServiceCategories] = useState([]);
  const [
    serviceCategoriesDefaultValue,
    setServiceCategoriesDefaultValue,
  ] = useState([]);
  const [datePreferences, setDatePreferences] = useState("");
  const [currencyPreferences, setCurrencyPreferences] = useState("");
  const [language, setLanguage] = useState("en");

  const [remainingDays, setRemainingDays] = useState(null);

  const [fileToSend, setFileToSend] = useState([]);
  const [IntroText, setIntroText] = useState("");

  const [profileDetailsLoading, setProfileDetailsLoading] = useState(true);
  const [haveGoogleCredentials, setHaveGoogleCredentials] = useState(false);
  const [profileDetails, setProfileDetails] = useState([]);
  const [activeTab, setActiveTab] = useState("basic_info");
  const [googleOnboardIncomplete, setGoogleOnboardIncomplete] = useState(false)

  const [showVideoForm, setShowVideoForm] = useState(true);
  const [showIntroForm, setShowIntroForm] = useState(true);
  const [introUploading, setIntroUploading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false)

  const dispatch = useDispatch();
  const response = useSelector((state) => state.ProfileDetailsResponse);

  useLayoutEffect(() => {
    if (_.isEmpty(response.data)) {
      const config = {
        method: "get",
        url: "/api/v1/user/profile-details",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios(config)
        .then((res) => {
          var data = res.data;
          dispatch(ProfileSettingDispatcher(data));
          setProfileDetails(res.data);
          setName(res.data["name"]);
          setAddress(res.data["address"]);
          setContact(res.data["phone_number"]);
          setRegistrationNumber(res.data["registration_number"]);
          setPersonalNumber(res.data["personal_number"]);
          setServiceCategories(res.data["service_categories"]);
          var array = [];
          res.data["service_categories"].map((item) =>
            array.push({ label: item, value: item })
          );
          setServiceCategoriesDefaultValue(array);
          setCurrencyPreferences(res.data["currency_preferences"]);
          setDatePreferences(res.data["date_preferences"]);
          if (res.data["language"]) {
            setLanguage(res.data["language"]);
          }
          setProfileDetailsLoading(false);
          if (res.data.hasOwnProperty("intro_video")) {
            setShowVideoForm(false);
          }
          if (res.data.hasOwnProperty("intro_text")) {
            setShowIntroForm(false);
          }
          var current_date = new Date();
          var exp_date = new Date(res.data["expiryDate"]);
          var diff = Math.abs(exp_date - current_date);
          var diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
          setRemainingDays(diffDays);
        })
        .catch((error) => {});
    } else {
      setProfileDetails(response.data);
      setName(response.data["name"]);
      setAddress(response.data["address"]);
      setContact(response.data["phone_number"]);
      setRegistrationNumber(response.data["registration_number"]);
      setPersonalNumber(response.data["personal_number"]);
      setServiceCategories(response.data["service_categories"]);
      setCurrencyPreferences(response.data["currency_preferences"]);
      setDatePreferences(response.data["date_preferences"]);
      if (response.data["language"]) {
        setLanguage(response.data["language"]);
      }
      setProfileDetailsLoading(false);
      if (response.data.hasOwnProperty("intro_video")) {
        setShowVideoForm(false);
      }
      if (response.data.hasOwnProperty("intro_text")) {
        setShowIntroForm(false);
      }
      var current_date = new Date();
      var exp_date = new Date(response.data["expiryDate"]);
      var diff = Math.abs(exp_date - current_date);
      var diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setRemainingDays(diffDays);
    }
    // To check if the user has linked google account
    var config2 = {
      method: "get",
      url: "/api/v1/google-credentials-details",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config2)
      .then((res) => {
        //console.log("from response", res.data)
        setHaveGoogleCredentials(true);
      })
      .catch((error) => {
        if(error.response['data']['message'] == "incomplete"){
          setGoogleOnboardIncomplete(true)
        }
        else{
          setHaveGoogleCredentials(false);
        }
      });
  }, []);

  useEffect(() => {
    console.log("Profile details", response.data);
  }, [profileDetails]);

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

  // To open google consent for user authorization
  const handleLinkGoogleAccount = () => {
    var config = {
      method: "get",
      url: "/api/v1/authorize",
    };
    axios(config)
      .then((res) => {
        window.open(res.data["auth_uri"], "_self");
      })
      .catch((error) => {});
  };

  // To revoke google account
  const handleRevokeGoogleAccount = () => {
    //send revoke request
    const config = {
      method: "delete",
      url: "/api/v1/revoke-google"
    }
    axios(config)
    .then((res) => {
      // show the confirmation alert
      setShowRevokeAlert(true)
      // To check if the user has linked google account
      var config2 = {
        method: "get",
        url: "/api/v1/google-credentials-details",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios(config2)
        .then((res) => {
          setHaveGoogleCredentials(true);
        })
        .catch((error) => {
          setHaveGoogleCredentials(false);
        });
    })
    .catch((error) => {
      // show the revoke failed alert
    })
  };

  // To clear incomplete google account
  const handleClearGoogleAccount = () => {
    //send revoke request
    const config = {
      method: "delete",
      url: "/api/v1/revoke-google"
    }
    axios(config)
    .then((res) => {
      // show the confirmation alert
      setShowClearIncompleteAlert(true)
      setGoogleOnboardIncomplete(false)
      // To check if the user has linked google account
      var config2 = {
        method: "get",
        url: "/api/v1/google-credentials-details",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios(config2)
        .then((res) => {
          setHaveGoogleCredentials(true);
        })
        .catch((error) => {
          setHaveGoogleCredentials(false);
        });
    })
    .catch((error) => {
      // show the revoke failed alert
    })
  };

  const activeBasicInfoTab = () => {
    setActiveTab("basic_info");
  };
  const activeSubscriptionTab = () => {
    setActiveTab("subscription_info");
  };
  const activeIntroTab = () => {
    setActiveTab("Intro");
  };

  // Function for the profile data edit
  /********************************************************************/
  // Function for name field
  const handleShowNameField = (value) => {
    if (value) {
      setShowNameField(true);
    } else {
      setShowNameField(false);
    }
  };
  const handleName = (e) => {
    setName(e.target.value);
    setShowAlert(false);
  };
  const SubmitName = (e) => {
    e.preventDefault();
    var data = {
      name: name,
    };
    dispatch(UpdateProfileSetting(data));
    setShowNameField(false);
    setShowAlert(true);
  };

  /********************************************************************/
  // Function for address field
  const handleShowAddressField = (value) => {
    if (value) {
      setShowAddressField(true);
    } else {
      setShowAddressField(false);
    }
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
    setShowAlert(false);
  };
  const SubmitAddress = (e) => {
    e.preventDefault();
    var data = {
      address: address,
    };
    dispatch(UpdateProfileSetting(data));
    setShowAddressField(false);
    setShowAlert(true);
  };

  /********************************************************************/
  // Function for Contact field
  const handleShowContactField = (value) => {
    if (value) {
      setShowContactField(true);
    } else {
      setShowContactField(false);
    }
  };
  const handleContact = (e) => {
    setContact(e.target.value);
    setShowAlert(false);
  };
  const SubmitContact = (e) => {
    e.preventDefault();
    var data = {
      phone_number: contact,
    };
    dispatch(UpdateProfileSetting(data));
    setShowContactField(false);
    setShowAlert(true);
  };

  /********************************************************************/
  // Function for Registration field
  const handleShowRegistration = (value) => {
    if (value) {
      setShowRegistrationField(true);
    } else {
      setShowRegistrationField(false);
    }
  };
  const handleRegistration = (e) => {
    setRegistrationNumber(e.target.value);
    setShowAlert(false);
  };
  const SubmitRegistration = (e) => {
    e.preventDefault();
    var data = {
      registration_number: registrationNumber,
    };
    dispatch(UpdateProfileSetting(data));
    setShowRegistrationField(false);
    setShowAlert(true);
  };

  /********************************************************************/
  // Function for Personal Number field
  const handleShowPersonalNumber = (value) => {
    if (value) {
      setShowPersonalNumberField(true);
    } else {
      setShowPersonalNumberField(false);
    }
  };
  const handlePersonalNumber = (e) => {
    setPersonalNumber(e.target.value);
    setShowAlert(false);
  };
  const SubmitPersonalNumber = (e) => {
    e.preventDefault();
    var data = {
      personal_number: personalNumber,
    };
    dispatch(UpdateProfileSetting(data));
    setShowPersonalNumberField(false);
    setShowAlert(true);
  };

  /********************************************************************/
  // Function for Services Categories
  const options = [
    { label: "Law", value: "law" },
    { label: "Accounting", value: "account" },
  ];

  const handleServiceCategoriesChange = (e) => {
    // send the tags value to handleNewCaseRequest method
    var values = [];
    if (_.isEmpty(e)) {
      //
    } else {
      e.map((item, index) => {
        values.push(item.value);
      });
      setServiceCategories([...values]);
      scToSend = values.toString();
    }
  };

  const SubmitServiceCategories = () => {
    var data = {
      service_categories: scToSend,
    };
    dispatch(UpdateProfileSetting(data));
    setShowAlert(true);
  };

  // Modal box action listener
  const OpenModalServiceCategories = (type) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg"
            style={{ minHeight: "15rem", minWidth: "30rem" }}
          >
            <h1 class="text-3xl text-blue-600 px-4">
              {t("edit_service_categories")}
            </h1>
            <hr class="border-gray-300 my-4" />
            <div class="px-4">
              <div class="items-center text-black px-4 py-3 mb-3" role="alert">
                <label class="block text-black text-md mb-2" for="name">
                  {t("case_tags")}:
                </label>
                <CreatableSelect
                  isMulti
                  defaultValue={serviceCategoriesDefaultValue}
                  options={options}
                  onChange={(e) => handleServiceCategoriesChange(e)}
                />
              </div>
              <div class="flex justify-end mx-3 my-4">
                <button
                  onClick={onClose}
                  class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => {
                    SubmitServiceCategories();
                    onClose();
                  }}
                  class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
                >
                  {t("update_it")}
                </button>
              </div>
            </div>
          </div>
        );
      },
      closeOnClickOutside: false,
      title: "Confirm to submit",
    });
  };

  /********************************************************************/
  // Function for Preferences
  // Modal box action listener

  const handleCurrencyPreferences = (e) => {
    //setCurrencyPreferences(e.target.value)
    currencyPreferencesToSend = e.target.value;
  };

  const handleLanguage = (e) => {
    //setCurrencyPreferences(e.target.value)
    languagePreferencesToSend = e.target.value;
  };

  const handleDatePreferences = (e) => {
    //setCurrencyPreferences(e.target.value)
    datePreferencesToSend = e.target.value;
  };

  const submitDatePreferences = () => {
    var data = {
      date_preferences: datePreferencesToSend,
    };
    dispatch(UpdateProfileSetting(data));
    setShowAlert(true);
    setDatePreferences(datePreferencesToSend);
  };

  const clearDatePreferences = () => {
    setDatePreferences(profileDetails.date_preferences)
    datePreferencesToSend = profileDetails.date_preferences;
  }

  const submitCurrencyPreferences = () => {
    var data = {
      currency_preferences: currencyPreferencesToSend,
    };
    dispatch(UpdateProfileSetting(data));
    setShowAlert(true);
    setCurrencyPreferences(currencyPreferencesToSend);
  };

  const clearCurrencyPreferences = () => {
    setCurrencyPreferences(profileDetails.currency_preferences)
    currencyPreferencesToSend = profileDetails.currency_preferences;
  }

  const submitLanguagePreferences = () => {
    var data = {
      language: languagePreferencesToSend,
    };
    dispatch(UpdateProfileSetting(data));
    setShowAlert(true);
    setLanguage(languagePreferencesToSend);
    localStorage.setItem("lang", languagePreferencesToSend)
    window.location.reload(true)
  };

  const clearLanguagePreferences = () => {
    setLanguage(profileDetails.language)
    languagePreferencesToSend = profileDetails.language;
  };

  const OpenVideoUploader = () => {
    setShowVideoForm(true);
  };

  const OpenTextUploader = () => {
    setShowIntroForm(true);
  };

  const OpenModalDatePreferences = (type) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg"
            style={{ minHeight: "15rem", minWidth: "30rem" }}
          >
            <h1 class="text-3xl text-blue-600 px-4">{t("edit_preferences")}</h1>
            <hr class="border-gray-300 my-4" />
            <div class="px-4">
              <div class="items-center text-black px-4 py-3 mb-3" role="alert">
                <label class="block text-black text-md mb-2" for="name">
                  {t("date_preferences")}
                </label>
                <select
                  class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={datePreferences}
                  onChange={(e) => handleDatePreferences(e)}
                >
                  <option value="ymd">YYYY-MM-DD</option>
                  <option value="dmy">DD-MM-YYYY</option>
                  <option value="mdy">MM-DD-YYYY</option>
                </select>
              </div>
              <div class="flex justify-end mx-3">
                <button
                  onClick={() => {
                    clearDatePreferences();
                    onClose();
                  }}
                  class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => {
                    submitDatePreferences();
                    onClose();
                  }}
                  class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
                >
                  {t("update_it")}
                </button>
              </div>
            </div>
          </div>
        );
      },
      title: "Confirm to submit",
      closeOnClickOutside: false,
    });
  };

  const OpenModalCurrencyPreferences = (type) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg"
            style={{ minHeight: "15rem", minWidth: "30rem" }}
          >
            <h1 class="text-3xl text-blue-600 px-4">
              {t("edit_currency_preferences")}
            </h1>
            <hr class="border-gray-300 my-4" />
            <div class="px-4">
              <div class="items-center text-black px-4 py-3 mb-3" role="alert">
                <label class="block text-black text-md mb-2" for="name">
                  {t("currency_preferences")}
                </label>
                <select
                  class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={currencyPreferences}
                  onChange={(e) => handleCurrencyPreferences(e)}
                >
                  <option value="usd">USD</option>
                  <option value="pound">POUND</option>
                  <option value="euro">EURO</option>
                </select>
              </div>
              <div class="flex justify-end mx-3">
                <button
                  onClick={() => {
                    clearCurrencyPreferences();
                    onClose();
                  }}
                  class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => {
                    submitCurrencyPreferences();
                    onClose();
                  }}
                  class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
                >
                  {t("update_it")}
                </button>
              </div>
            </div>
          </div>
        );
      },
      title: "Confirm to submit",
      closeOnClickOutside: false,
    });
  };

  const OpenModalLanguage = (type) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg"
            style={{ minHeight: "15rem", minWidth: "30rem" }}
          >
            <h1 class="text-3xl text-blue-600 px-4">
              {t("choose_language_preferences")}
            </h1>
            <hr class="border-gray-300 my-4" />
            <div class="px-4">
              <div class="items-center text-black px-4 py-3 mb-3" role="alert">
                <label class="block text-black text-md mb-2" for="name">
                  {t("language_preferences")}
                </label>
                <select
                  class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={language}
                  onChange={(e) => handleLanguage(e)}
                >
                  <option value="en">English</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div class="flex justify-end mx-3">
                <button
                  onClick={() => {
                    clearLanguagePreferences();
                    onClose();
                  }}
                  class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => {
                    submitLanguagePreferences();
                    onClose();
                  }}
                  class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
                >
                  {t("update_it")}
                </button>
              </div>
            </div>
          </div>
        );
      },
      title: "Confirm to submit",
      closeOnClickOutside: false,
    });
  };

  /********************************************************************/
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
    if (file.size > 100000000){
      setFileSizeError(true)
    }
    else {
      setFileSizeError(false)
      return fileTypes.includes(file.type);
    }
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

  const handleIntroTextChange = (e) => {
    setIntroText(e.target.value);
  };

  const SubmitIntroduction = () => {
    setIntroUploading(true)
    // submit the dispatch action here
    var formData = new FormData();
    for (let file of fileToSend) {
      formData.append(file.name, file);
    }
    formData.append("intro_text", IntroText);
    
    const config = {
      method: 'put',
      url: '/api/v1/user/profile-introduction',
      data: formData
    }
    axios(config)
    .then((res) => {
      setIntroUploading(false)
      setShowAlert(true)
      const config6 = {
        method: "get",
        url: "/api/v1/user/profile-details",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios(config6)
        .then((res) => {
          var data = res.data;
          dispatch(ProfileSettingDispatcher(data));
          setProfileDetails(res.data);
          setName(res.data["name"]);
          setAddress(res.data["address"]);
          setContact(res.data["phone_number"]);
          setRegistrationNumber(res.data["registration_number"]);
          setPersonalNumber(res.data["personal_number"]);
          setServiceCategories(res.data["service_categories"]);
          var array = [];
          res.data["service_categories"].map((item) =>
            array.push({ label: item, value: item })
          );
          setServiceCategoriesDefaultValue(array);
          setCurrencyPreferences(res.data["currency_preferences"]);
          setDatePreferences(res.data["date_preferences"]);
          setProfileDetailsLoading(false);
          if (res.data.hasOwnProperty("intro_video")) {
            setShowVideoForm(false);
          }
          if (res.data.hasOwnProperty("intro_text")) {
            setShowIntroForm(false);
          }
        })
        .catch((error) => {});
    })
    .catch((error) => {
      setIntroUploading(false)
    })
    
  };

  const showData = () => {
    if (response.loading) {
      return (
        <div class="">
          <PulseLoader size={10} color={"#6DADE3"} loading={true} />
        </div>
      );
    }
    if(fileSizeError){
      return (
        <div>
          <button
            class="cursor-not-allowed bg-blue-500 opacity-50 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline disabled"
            type="button"
          >
            {t("submit")}
          </button>
        </div>
      );
    }
    return (
      <div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => SubmitIntroduction()}
        >
          {t("submit")}
        </button>
      </div>
    );
  };

  return (
    <div>
      <div class="px-4 sm:px-8">
        {showAlert ? (
          <div
            class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
            role="alert"
          >
            <p class="font-bold">{t("profile_details_updated_successfully")}</p>
          </div>
        ) : (
          ""
        )}
        {
          fileSizeError ?
          <div
            class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p class="font-bold">{t("file_size_big_info")}</p>
          </div>
          :
          ""
        }
        {showRevokeAlert ? (
          <div
            class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
            role="alert"
          >
            <p class="font-bold">{t("google_revoked_sucessfully")}</p>
          </div>
        ) : (
          ""
        )}
        {showClearIncompleteAlert ? (
          <div
            class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
            role="alert"
          >
            <p class="font-bold">{t("google_cleared_sucessfully")}</p>
          </div>
        ) : (
          ""
        )}
        {profileDetailsLoading ? (
          <div class="animate-pulse flex space-x-4">
            <div class="w-4/5">
              <div class="flex">
                <img
                  style={{ height: "7em" }}
                  class="rounded-full"
                  src={EmpAvatar}
                  alt=""
                />
              </div>
            </div>
            <div class="w-1/5 flex justify-end"></div>
          </div>
        ) : (
          <div class="flex">
            <div class="w-5/5">
              <div class="flex flex-wrap">
                <img
                  style={{ height: "7em" }}
                  class="rounded-full"
                  src={ProfilePicAvatar}
                />
                <div
                  class="y-5"
                  style={{ marginTop: "1.5em", marginLeft: "1em" }}
                >
                  {showNameField ? (
                    <div class="flex">
                      <div>
                        <form onSubmit={SubmitName}>
                          <input
                            class="shadow appearance-none border rounded w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="label"
                            type="text"
                            defaultValue={name}
                            onChange={(e) => handleName(e)}
                          />
                        </form>
                      </div>
                      <div class="mt-3">
                        <button
                          class="focus:outline-none"
                          onClick={() => handleShowNameField(false)}
                        >
                          <p class="text-red-400 mx-6 text-lg">
                            <VscClose />
                          </p>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div class="flex">
                      <h1 class="text-2xl font-bold">{name}</h1>
                      <button
                        class="focus:outline-none ml-3"
                        onClick={() => handleShowNameField(true)}
                      >
                        <p class="text-blue-400 mx-6 my-3">
                          <FaEdit />
                        </p>
                      </button>
                    </div>
                  )}
                  <h1 class="text-1xl my-1">{profileDetails["email"]}</h1>
                  <p class="flex mt-8 text-base text-gray-600">
                    {t("caps_address")}
                    {showAddressField ? (
                      <form onSubmit={SubmitAddress}>
                        <input
                          class="shadow appearance-none border w-auto rounded ml-6 w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="label"
                          type="text"
                          defaultValue={address}
                          onChange={(e) => handleAddress(e)}
                        />
                      </form>
                    ) : (
                      <p class="ml-4 text-base text-black">{address}</p>
                    )}
                    {showAddressField ? (
                      <button
                        class="focus:outline-none"
                        onClick={() => handleShowAddressField(false)}
                      >
                        <p class="text-red-400 mx-3 text-lg">
                          <VscClose />
                        </p>
                      </button>
                    ) : (
                      <button
                        class="focus:outline-none ml-3 mr-6 "
                        onClick={() => handleShowAddressField(true)}
                      >
                        <p class="text-blue-400 mx-3">
                          <FaEdit />
                        </p>
                      </button>
                    )}
                    {t("caps_contact_number")}
                    {showContactField ? (
                      <form onSubmit={SubmitContact}>
                        <input
                          class="shadow appearance-none border rounded ml-3 w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="label"
                          type="text"
                          defaultValue={contact}
                          onChange={(e) => handleContact(e)}
                        />
                      </form>
                    ) : (
                      <p class="ml-3 text-base text-black">{contact}</p>
                    )}
                    {showContactField ? (
                      <button
                        class="focus:outline-none"
                        onClick={() => handleShowContactField(false)}
                      >
                        <p class="text-red-400 mx-3 text-lg">
                          <VscClose />
                        </p>
                      </button>
                    ) : (
                      <button
                        class="focus:outline-none ml-3 mr-6 "
                        onClick={() => handleShowContactField(true)}
                      >
                        <p class="text-blue-400 mx-3">
                          <FaEdit />
                        </p>
                      </button>
                    )}
                    {t("caps_joined_on")}
                    <p class="ml-4 text-base text-black">
                      {profileDetails["createdDate"]}
                    </p>
                    <span class="focus:outline-none ml-3 mr-6 ">
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div class="w-1/5 flex justify-end"></div>
          </div>
        )}
        <div class="py-8">
          <div class="pt-8 pb-5">
            {activeTab == "basic_info" ? (
              <ul class="flex border-b">
                <li class="-mb-px mr-1">
                  <button
                    class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none"
                    onClick={() => activeBasicInfoTab()}
                  >
                    {t("basic_info")}
                  </button>
                </li>
                <li class="mr-1">
                  <button
                    class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                    onClick={() => activeSubscriptionTab()}
                  >
                    {t("subscription")}
                  </button>
                </li>
                <li class="mr-1">
                  <button
                    class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                    onClick={() => activeIntroTab()}
                  >
                    {t("intro")}
                  </button>
                </li>
              </ul>
            ) : activeTab == "subscription_info" ? (
              <ul class="flex border-b">
                <li class="mr-1">
                  <button
                    class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                    onClick={() => activeBasicInfoTab()}
                  >
                    {t("basic_info")}
                  </button>
                </li>
                <li class="-mb-px mr-1">
                  <button
                    class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none"
                    onClick={() => activeSubscriptionTab()}
                  >
                    {t("subscription")}
                  </button>
                </li>
                <li class="mr-1">
                  <button
                    class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                    onClick={() => activeIntroTab()}
                  >
                    {t("intro")}
                  </button>
                </li>
              </ul>
            ) : (
              <ul class="flex border-b">
                <li class="mr-1">
                  <button
                    class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                    onClick={() => activeBasicInfoTab()}
                  >
                    {t("basic_info")}
                  </button>
                </li>
                <li class="mr-1">
                  <button
                    class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                    onClick={() => activeSubscriptionTab()}
                  >
                    {t("subscription")}
                  </button>
                </li>
                <li class="-mb-px mr-1">
                  <button
                    class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none"
                    onClick={() => activeIntroTab()}
                  >
                    {t("intro")}
                  </button>
                </li>
              </ul>
            )}
          </div>
          <div>
            {activeTab == "basic_info" ? (
              <div style={{ marginLeft: "0.5rem" }}>
                <div class="mb-8">
                  <div class="flex items-center">
                    <div class="w-2/6">
                      <p class="text-base text-gray-600">
                        {t("caps_service_categories")}
                      </p>
                    </div>
                    <div class="w-4/6">
                      {!_.isEmpty(serviceCategories)
                        ? serviceCategories.map((item) => {
                            return (
                              <span class="relative inline-block px-3 py-1 mr-4 font-semibold text-gray-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-gray-300 opacity-50"
                                ></span>
                                <span class="relative">{item}</span>
                              </span>
                            );
                          })
                        : ""}
                      <button
                        class="focus:outline-none my-4"
                        onClick={() => OpenModalServiceCategories()}
                      >
                        <p class="text-blue-400 mx-6">
                          <FaEdit />
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
                {!_.isEmpty(profileDetails["registration_number"]) ? (
                  <div class="mt-8 mb-8">
                    {showRegistrationField ? (
                      <div class="flex">
                        <div class="w-2/6">
                          <p class="text-base text-gray-600">
                            {t("caps_registration_number")}
                          </p>
                        </div>
                        <div lass="w-4/6">
                          <form onSubmit={SubmitRegistration}>
                            <input
                              class="shadow appearance-none border rounded w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="label"
                              type="text"
                              defaultValue={registrationNumber}
                              onChange={(e) => handleRegistration(e)}
                            />
                          </form>
                        </div>
                        <div class="mt-3">
                          <button
                            class="focus:outline-none"
                            onClick={() => handleShowRegistration(false)}
                          >
                            <p class="text-red-400 mx-6 text-lg">
                              <VscClose />
                            </p>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div class="flex items-center">
                        <div class="w-2/6">
                          <p class="text-base text-gray-600">
                            {t("caps_registration_number")}
                          </p>
                        </div>
                        <div class="w-4/6">
                          {registrationNumber}
                          <button
                            class="focus:outline-none ml-3 my-4"
                            onClick={() => handleShowRegistration(true)}
                          >
                            <p class="text-blue-400 mx-6">
                              <FaEdit />
                            </p>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
                {!_.isEmpty(profileDetails["personal_number"]) ? (
                  <div class="mt-8 mb-8">
                    {showPersonalNumberField ? (
                      <div class="flex">
                        <div class="w-2/6">
                          <p class="text-base text-gray-600">
                            {t("caps_personal_number")}
                          </p>
                        </div>
                        <div class="w-4/6">
                          <form onSubmit={SubmitPersonalNumber}>
                            <input
                              class="shadow appearance-none border rounded w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="label"
                              type="text"
                              defaultValue={personalNumber}
                              onChange={(e) => handlePersonalNumber(e)}
                            />
                          </form>
                        </div>
                        <div class="mt-3">
                          <button
                            class="focus:outline-none"
                            onClick={() => handleShowPersonalNumber(false)}
                          >
                            <p class="text-red-400 mx-6 text-lg">
                              <VscClose />
                            </p>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div class="flex items-center">
                        <div class="w-2/6">
                          <p class="text-base text-gray-600">
                            {t("caps_personal_number")}
                          </p>
                        </div>
                        <div class="w-4/6">
                          {personalNumber}
                          <button
                            class="focus:outline-none ml-3 my-4"
                            onClick={() => handleShowPersonalNumber(true)}
                          >
                            <p class="text-blue-400 mx-6">
                              <FaEdit />
                            </p>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
                <div class="mt-8 mb-8">
                  <div class="flex items-center">
                    <div class="w-2/6">
                      <p class="text-base text-gray-600">
                        {t("caps_date_format")}
                      </p>
                    </div>
                    <div class="w-4/6">
                      {!_.isEmpty(datePreferences)
                        ? datePreferences == "dmy"
                          ? "DD-MM-YYYY"
                          : datePreferences == "mdy"
                          ? "MM-DD-YYYY"
                          : "YYYY-MM-DD"
                        : "NOT SET"}
                      <button
                        class="focus:outline-none ml-3 my-4"
                        onClick={() => OpenModalDatePreferences()}
                      >
                        <p class="text-blue-400 mx-6">
                          <FaEdit />
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="mt-8 mb-8">
                  <div class="flex items-center">
                    <div class="w-2/6">
                      <p class="text-base text-gray-600">
                        {t("caps_currency_preferences")}
                      </p>
                    </div>
                    <div class="w-4/6">
                      {!_.isEmpty(currencyPreferences)
                        ? currencyPreferences == "usd"
                          ? "USD"
                          : currencyPreferences == "pound"
                          ? "POUND"
                          : "EURO"
                        : "NOT SET"}
                      <button
                        class="focus:outline-none ml-3 my-4"
                        onClick={() => OpenModalCurrencyPreferences()}
                      >
                        <p class="text-blue-400 mx-6">
                          <FaEdit />
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="mt-8 mb-8">
                  <div class="flex items-center">
                    <div class="w-2/6">
                      <p class="text-base text-gray-600">
                        {t("caps_language")}
                      </p>
                    </div>
                    <div class="w-4/6">
                      {!_.isEmpty(language)
                        ? language == "en"
                          ? "English"
                          : "German"
                        : "NOT SET"}
                      <button
                        class="focus:outline-none ml-3 my-4"
                        onClick={() => OpenModalLanguage()}
                      >
                        <p class="text-blue-400 mx-6">
                          <FaEdit />
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="mt-8 mb-8">
                  {haveGoogleCredentials ? (
                    <div class="flex items-center">
                      <div class="w-2/6">
                        <p class="text-base text-gray-600">
                          {t("caps_linked_with_google")}
                        </p>
                      </div>
                      <div class="w-4/6">
                        <button
                          class=" mr-10 text-base text-blue-500 focus:outline-none"
                          onClick={() => handleRevokeGoogleAccount()}
                        >
                          {t("caps_revoke")}?
                        </button>
                      </div>
                    </div>
                  ) 
                  :
                  googleOnboardIncomplete ?
                  <div class="flex">
                    <p class="text-base text-red-600">
                      {t("google_onboard_incomplete")}
                    </p>
                    <p class="font-bold text-base text-red-600 cursor-pointer border-b border-dashed" onClick={() => handleClearGoogleAccount()}>
                      &nbsp;{t("clear_credentials_info")}
                    </p>
                  </div> 
                  : 
                  (
                    <div class="flex items-center">
                      <div class="w-2/6">
                        <p class="text-base text-gray-600">
                          {t("caps_not_linked_with_google")}
                        </p>
                      </div>
                      <div class="w-4/6">
                        <button
                          class=" mr-10 text-base text-blue-500 focus:outline-none"
                          onClick={() => handleLinkGoogleAccount()}
                        >
                          {t("caps_link")}?
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab == "subscription_info" ? (
              <div>
                <div class="flex items-center mx-2 my-4">
                  <div class="w-2/6">
                    <p class="text-base text-gray-600">
                      {t("caps_subs_expiry")}
                    </p>
                  </div>
                  <div class="w-4/6">
                    {!_.isEmpty(profileDetails.expiryDate)
                      ? profileDetails.expiryDate
                      : "NOT SET"}
                  </div>
                </div>
                <div class="flex my-4 items-center">
                  <SubscriptionCheckout />
                </div>
              </div>
            ) : (
              <div class="flex mb-4">
                {
                  introUploading ? 
                  <div class="">
                    <PulseLoader size={10} color={"#6DADE3"} loading={true} />
                  </div>
                  :
                  <div class="w-3/5 ml-5">
                  <div class="mt-2 mb-3">
                    {!showVideoForm ? (
                      <span>
                        <div class="flex items-center">
                          <div class="w-2/5">
                            <label
                              class="block text-gray-700 text-sm"
                              for="password"
                            >
                              {t("intro_video")}
                            </label>
                          </div>
                          <div class="w-3/5">
                            <button
                              class="focus:outline-none ml-3 mb-5"
                              onClick={() => OpenVideoUploader()}
                            >
                              <p class="text-blue-400 mx-6">
                                <FaEdit />
                              </p>
                            </button>
                          </div>
                        </div>
                        <VideoPlayer source={profileDetails["intro_video"]} />
                      </span>
                    ) : (
                      <div>
                        <label
                          class="block text-gray-700 text-sm mb-1"
                          for="password"
                        >
                          {t("intro_video")}
                        </label>
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
                        {!_.isEmpty(fileNameToShow)
                          ? fileNameToShow.map((item, index) => {
                              return (
                                <div class="flex mx-3 my-5">
                                  <div class="w-3/12">
                                    <p>{item}</p>
                                  </div>
                                  <div class="w-1/12">
                                    <p
                                      class="text-red-400 mx-6 text-lg"
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
                    )}
                  </div>

                  <div class="mt-2 mb-3">
                    {!showIntroForm ? (
                      <span>
                        <div class="flex items-center">
                          <div class="w-2/5">
                            <label
                              class="block text-gray-700 text-sm"
                              for="password"
                            >
                              {t("intro_desc")}
                            </label>
                          </div>
                          <div class="w-3/5">
                            <button
                              class="focus:outline-none ml-3 mb-5"
                              onClick={() => OpenTextUploader()}
                            >
                              <p class="text-blue-400 mx-6">
                                <FaEdit />
                              </p>
                            </button>
                          </div>
                        </div>
                        <div>
                          <p>{profileDetails["intro_text"]}</p>
                        </div>
                      </span>
                    ) : (
                      <span>
                        <label
                          class="block text-gray-700 text-sm mb-2"
                          for="password"
                        >
                          {t("intro_text")}
                        </label>
                        <div>
                          <textarea
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="title"
                            type="text"
                            defaultValue={profileDetails['intro_text']}
                            style={{ minHeight: "12em" }}
                            onChange={(e) => handleIntroTextChange(e)}
                          />
                        </div>
                      </span>
                    )}
                  </div>
                  {showIntroForm || showVideoForm ? (
                    <div class="flex justify-start my-5">{showData()}</div>
                  ) : (
                    ""
                  )}
                </div>
                }
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(ProfileSetting);
