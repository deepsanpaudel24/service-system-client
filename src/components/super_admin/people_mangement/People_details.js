import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import _ from "lodash";
import { Link } from "react-router-dom";
import EmpAvatar from "../../../images/emp_avatar.jpg";
import { AddPeopleResponseReset } from "../../actions/people_mangement/AddPeople";
import PeopleCases from "./People_cases";
import { FaEdit } from "react-icons/fa";
import { VscClose } from "react-icons/vsc";
import { UpdateCommission } from "../../actions/people_mangement/SetCommissionRateAction";
import ChildAccounts from "./Child_accounts";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";

const PeopleDetails = ({ t }) => {
  const history = useHistory();
  const [peopleDetails, setPeopleDetails] = useState([]);
  const [peopleDetailsLoading, setPeopleDetailsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState("cases");
  const [showCommissionField, setShowCommissionField] = useState(false);
  const [commission, setCommission] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showExpiryAlert, setShowExpiryAlert] = useState(false);
  const [expiryDate, SetExpiryDate] = useState("");
  const dispatch = useDispatch();
  const response = useSelector((state) => state.addEmployeeResponse);

  useLayoutEffect(() => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");

    const config = {
      method: "get",
      url: "/api/v1/peoples/" + urlvalues[3],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then((res) => {
        setPeopleDetails(res.data);
        setPeopleDetailsLoading(false);
        setCommission(res.data["commission"]);
      })
      .catch((error) => {
        console.log(error.response);
      });

    const config2 = {
      method: "get",
      url: "/api/v1/services/" + urlvalues[3],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config2)
      .then((res2) => {
        setServices(res2.data);
      })
      .catch((error2) => {
        console.log(error2.response);
      });
  }, []);

  useEffect(() => {
    SetExpiryDate(peopleDetails.expiryDate);
    setCommission(peopleDetails.commission);
  }, [peopleDetails]);

  const activeCasetab = () => {
    setActiveTab("cases");
  };

  const activeServicetab = () => {
    setActiveTab("services");
  };

  const activeEmployeestab = () => {
    setActiveTab("employees");
  };

  /********************************************************************/
  // Function for Commission field
  const handleShowCommissionField = (value) => {
    if (value) {
      setShowCommissionField(true);
    } else {
      setShowCommissionField(false);
    }
  };
  const handleCommission = (e) => {
    setCommission(e.target.value);
    setShowAlert(false);
  };
  const SubmitCommission = (e) => {
    e.preventDefault();
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    var data = {
      commission: commission,
    };
    dispatch(UpdateCommission(data, urlvalues[3]));
    setShowCommissionField(false);
    setShowExpiryAlert(false);
    setShowAlert(true);
  };

  /********************************************************************/

  var expiry_date;
  // for the Accont expiry date
  const handleAccountExpiry = (e) => {
    // storing the value in the variable since the modal box cannot update the state
    expiry_date = e.target.value;
  };

  const SubmitAccountExpiry = () => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    var data = {
      expiry_date: expiry_date,
    };
    const config = {
      method: "put",
      url: "/api/v1/peoples/account-expiry/" + urlvalues[3],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      data: data,
    };
    axios(config)
      .then((res) => {
        // give the confirmation
        setShowAlert(false);
        setShowExpiryAlert(true);
        SetExpiryDate(expiry_date);
      })
      .catch((error) => {
        // give the user the failure message
      });
  };

  // Modal box action listener
  const OpenModal = (type) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg"
            style={{ minHeight: "15rem", minWidth: "30rem" }}
          >
            <h1 class="text-3xl text-blue-600 px-4">{t("edit_acc_expiry")}</h1>
            <hr class="border-gray-300 my-4" />
            <div class="px-4">
              <label class="block text-black text-md mb-2" for="name">
                {t("acc_expiry_date")}:
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="budget"
                type="date"
                defaultValue={peopleDetails.expiryDate}
                onChange={(e) => handleAccountExpiry(e)}
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
                  SubmitAccountExpiry();
                  onClose();
                }}
                class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
              >
                {t("update_it")}
              </button>
            </div>
          </div>
        );
      },
      title: "Confirm to submit",
    });
  };

  //************************************************************************************************ */

  return (
    <div>
      <div class="px-4 sm:px-8">
        {showAlert ? (
          <div
            class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
            role="alert"
          >
            <p class="font-bold">{t("commission_rate_updated")}</p>
          </div>
        ) : (
          ""
        )}
        {showExpiryAlert ? (
          <div
            class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
            role="alert"
          >
            <p class="font-bold">{t("acc_expiry_date_updated")}</p>
          </div>
        ) : (
          ""
        )}
        {peopleDetailsLoading ? (
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
            <div class="w-4/5">
              <div class="flex">
                <img
                  style={{ height: "7em" }}
                  class="rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                  alt=""
                />
                <div
                  class="ml-5 y-5"
                  style={{ marginTop: "1.5em", marginLeft: "2em" }}
                >
                  <h1 class="text-2xl font-bold">
                    {_.isEmpty(peopleDetails.name) ? "-" : peopleDetails.name}
                  </h1>
                  <h1 class="text-1xl my-1">
                    {_.isEmpty(peopleDetails.email) ? "-" : peopleDetails.email}
                  </h1>
                  <p class="flex mt-8 text-base text-gray-600">
                    USER SINCE{t("")}{" "}
                    <p class="ml-3 mr-10 text-base text-black">
                      {_.isEmpty(peopleDetails.createdDate)
                        ? "-"
                        : peopleDetails.createdDate}
                    </p>
                    {t("caps_expires_on")}{" "}
                    <p class="ml-3 text-base text-black">
                      {_.isEmpty(expiryDate) ? "-" : expiryDate}
                    </p>
                    <button
                      class="focus:outline-none ml-3 mr-10 "
                      onClick={() => OpenModal()}
                    >
                      <p class="text-blue-400 mx-6">
                        <FaEdit />
                      </p>
                    </button>
                    {t("caps_commission")}
                    {showCommissionField ? (
                      <form onSubmit={SubmitCommission}>
                        <input
                          class="shadow appearance-none border rounded ml-6 w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="label"
                          type="text"
                          defaultValue={commission}
                          onChange={(e) => handleCommission(e)}
                        />
                      </form>
                    ) : peopleDetails.hasOwnProperty("commission") ? (
                      <p class="ml-6 text-base text-black">{commission} %</p>
                    ) : (
                      <p class="ml-6 text-base text-black">
                        {t("caps_not_set")}
                      </p>
                    )}
                    {showCommissionField ? (
                      <button
                        class="focus:outline-none"
                        onClick={() => handleShowCommissionField(false)}
                      >
                        <p class="text-red-400 mx-6 text-lg">
                          <VscClose />
                        </p>
                      </button>
                    ) : (
                      <button
                        class="focus:outline-none ml-3 mr-10 "
                        onClick={() => handleShowCommissionField(true)}
                      >
                        <p class="text-blue-400 mx-6">
                          <FaEdit />
                        </p>
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div class="w-1/5 flex justify-end"></div>
          </div>
        )}
        <div class="pt-8 pb-5">
          {peopleDetails.user_type == "SPCA" ||
          peopleDetails.user_type == "SPS" ? (
            peopleDetails.user_type == "SPCA" ? (
              activeTab == "cases" ? (
                <ul class="flex border-b">
                  <li class="-mb-px mr-1">
                    <button
                      class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none"
                      onClick={() => activeCasetab()}
                    >
                      {t("cases")}
                    </button>
                  </li>
                  <li class="mr-1">
                    <button
                      class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                      onClick={() => activeServicetab()}
                    >
                      {t("services")}
                    </button>
                  </li>
                  <li class="mr-1">
                    <button
                      class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                      onClick={() => activeEmployeestab()}
                    >
                      {t("employees")}
                    </button>
                  </li>
                </ul>
              ) : activeTab == "services" ? (
                <ul class="flex border-b">
                  <li class="mr-1">
                    <button
                      class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                      onClick={() => activeCasetab()}
                    >
                      {t("cases")}
                    </button>
                  </li>
                  <li class="-mb-px mr-1">
                    <button
                      class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none"
                      onClick={() => activeServicetab()}
                    >
                      {t("services")}
                    </button>
                  </li>
                  <li class="mr-1">
                    <button
                      class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                      onClick={() => activeEmployeestab()}
                    >
                      {t("employees")}
                    </button>
                  </li>
                </ul>
              ) : (
                <ul class="flex border-b">
                  <li class="mr-1">
                    <button
                      class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                      onClick={() => activeCasetab()}
                    >
                      {t("cases")}
                    </button>
                  </li>
                  <li class="mr-1">
                    <button
                      class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                      onClick={() => activeServicetab()}
                    >
                      {t("services")}
                    </button>
                  </li>
                  <li class="-mb-px mr-1">
                    <button
                      class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none"
                      onClick={() => activeEmployeestab()}
                    >
                      {t("employees")}
                    </button>
                  </li>
                </ul>
              )
            ) : (
              ""
            )
          ) : peopleDetails.user_type == "CCA" ? (
            activeTab == "cases" ? (
              <ul class="flex border-b">
                <li class="-mb-px mr-1">
                  <button
                    class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none"
                    onClick={() => activeCasetab()}
                  >
                    {t("cases")}
                  </button>
                </li>
                <li class="mr-1">
                  <button
                    class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                    onClick={() => activeEmployeestab()}
                  >
                    {t("employees")}
                  </button>
                </li>
              </ul>
            ) : (
              <ul class="flex border-b">
                <li class="mr-1">
                  <button
                    class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                    onClick={() => activeCasetab()}
                  >
                    {t("cases")}
                  </button>
                </li>
                <li class="-mb-px mr-1">
                  <button
                    class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none"
                    onClick={() => activeEmployeestab()}
                  >
                    {t("employees")}
                  </button>
                </li>
              </ul>
            )
          ) : (
            <ul class="flex border-b">
              <li class="-mb-px mr-1">
                <button
                  class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none"
                  onClick={() => activeCasetab()}
                >
                  {t("cases")}
                </button>
              </li>
            </ul>
          )}
        </div>
        {
          activeTab == "cases" ? (
            // Cases div opens here
            <div>
              {peopleDetailsLoading ? (
                <div class="animate-pulse flex space-x-4">
                  <div class="flex-1 space-y-4 py-1">
                    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                      <div class="min-w-full shadow rounded-lg overflow-hidden mt-3">
                        <table class="min-w-full leading-normal">
                          <thead>
                            <tr>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("cases")}
                              </th>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("client")}
                              </th>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("status")}
                              </th>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("role")}
                              </th>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("assigned_on")}
                              </th>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("time_spent")}
                              </th>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("action")}
                              </th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                    <div class="h-4 bg-gray-400 rounded w-3/4"></div>
                    <div class="space-y-2">
                      <div class="h-4 bg-gray-400 rounded"></div>
                      <div class="h-4 bg-gray-400 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <PeopleCases />
              )}
            </div>
          ) : // cases div closes here
          activeTab == "employees" ? (
            <ChildAccounts />
          ) : (
            // Services div opens here
            <div>
              {peopleDetailsLoading ? (
                <div class="animate-pulse flex space-x-4">
                  <div class="flex-1 space-y-4 py-1">
                    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                      <div class="min-w-full shadow rounded-lg overflow-hidden mt-3">
                        <table class="min-w-full leading-normal">
                          <thead>
                            <tr>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("title")}
                              </th>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("rate")}
                              </th>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("avg_time_taken")}
                              </th>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("status")}
                              </th>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("created_on")}
                              </th>
                              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {t("commission_rate")}
                              </th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                    <div class="h-4 bg-gray-400 rounded w-3/4"></div>
                    <div class="space-y-2">
                      <div class="h-4 bg-gray-400 rounded"></div>
                      <div class="h-4 bg-gray-400 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                  <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table class="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {t("title")}
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {t("rate")}
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {t("avg_time")}
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {t("status")}
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {t("created_on")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((item, index) => {
                          return (
                            <tr>
                              <td class="px-2 py-5 border-b border-gray-200 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="ml-3">
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      {item.title}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-gray-900 whitespace-no-wrap">
                                  {item.rate} / {item.rateType}
                                </p>
                              </td>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-gray-900 whitespace-no-wrap">
                                  {item.averageTimeTaken} {t("hours")}
                                </p>
                              </td>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {item.status == "Active" ? (
                                  <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                    <span
                                      aria-hidden
                                      class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                    ></span>
                                    <span class="relative">{t("active")}</span>
                                  </span>
                                ) : (
                                  <span class="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                    <span
                                      aria-hidden
                                      class="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                                    ></span>
                                    <span class="relative">
                                      {t("inactive")}
                                    </span>
                                  </span>
                                )}
                              </td>
                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-gray-900 whitespace-no-wrap">
                                  {item.createdDate}
                                </p>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
          // services div closes here
        }
      </div>
    </div>
  );
};

export default withTranslation()(PeopleDetails);
