import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import _ from "lodash";
import { PulseLoader } from "react-spinners";
import { AddEmployeeResponseReset } from "../../actions/employee_management/AddEmployeeAction";
import { Link } from "react-router-dom";
import EmpAvatar from "../../../images/emp_avatar.jpg";
import ClientNonCaseIntakeFormDetails from "./Client_NonCase_intake_form";
import ClientCases from "./Client_case_list";

const ClientDetails = (props) => {
  const [clientDetails, setClientDetails] = useState([]);
  const [clientDetailsLoading, setClientDetailsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cases")
  const [numberOfCases, setNumberOfCases] = useState("")
  const dispatch = useDispatch();
  const response = useSelector((state) => state.addEmployeeResponse);

  useLayoutEffect(() => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    const config = {
      method: "get",
      url: "/api/v1/client-details/" + urlvalues[3],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then((res) => {
        setClientDetails(res.data);
        setClientDetailsLoading(false);
      })
      .catch((error) => {

      });

      const config2 = {
          method: 'get',
          url: '/api/v1/sp-client-cases/' + urlvalues[3],
          headers: { 
              'Authorization': 'Bearer ' + localStorage.getItem('access_token')
          }
          }
          axios(config2)
          .then((res) => {
            setNumberOfCases(res.data.length)
          })
          .catch((error) => {
          })
  }, []);

  useEffect(() => {

  }, [clientDetails]);

  const handleCaseTab = () => {
    setActiveTab("cases")
  }

  const handleIntakeTab = () => {
    setActiveTab("intake-form-tab")
  }

  const handleAdd = () => {
    dispatch(AddEmployeeResponseReset());
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    return props.history.push("/user/employee/roles/" + urlvalues[3]);
  };

  const handleSendIntakeForm = () => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    props.history.push("/user/client/intake-form-send/" + urlvalues[3])
  }

  return (
    <div>
      <div class="px-6">
        { clientDetailsLoading ? (
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
            <div class="w-1/5 flex justify-end">
              <button class="focus:outline-none" onClick={() => handleAdd()}>
                <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">
                  Client Details
                </div>
              </button>
            </div>
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
                    {_.isEmpty(clientDetails.name) ? "-" : clientDetails.name}
                  </h1>
                  <h1 class="text-1xl my-1">
                    {_.isEmpty(clientDetails.email) ? "-" : clientDetails.email}
                  </h1>
                  <p class="flex mt-8 text-base text-gray-600">
                  TOTAL CASES <p class="ml-3 mr-10 text-base text-black">{numberOfCases}</p>
                    USER SINCE
                    <p class="ml-3 mr-10 text-base text-black">
                      {_.isEmpty(clientDetails.createdDate)
                        ? "-"
                        : clientDetails.createdDate}
                    </p>
                    STATUS{" "}
                    {clientDetails.is_verified ? (
                      <p class="ml-3 text-base text-green-600">ACTIVE</p>
                    ) : (
                      <p class="ml-3 text-base text-red-600">UNVERIFIED</p>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div class="w-1/5 flex justify-end">
                <button class="focus:outline-none"  onClick={() => handleSendIntakeForm()}>
                    <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">Send Intake Form</div>
                </button>
            </div>
          </div>
        )}
       
        <div class="pt-8 pb-5">
          {
            activeTab == "cases" ? 
              <ul class="flex border-b">
                  <li class="-mb-px mr-1">
                      <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => handleCaseTab()}>Cases</button>
                  </li>
                  <li class="mr-1">
                      <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => handleIntakeTab()}>Intake form details</button>
                  </li>
              </ul>
            :
            activeTab == "intake-form-tab" ?
              <ul class="flex border-b">
                  <li class="mr-1">
                      <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => handleCaseTab()}>Cases</button>
                  </li>
                  <li class="-mb-px mr-1">
                      <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => handleIntakeTab()}>Intake form details</button>
                  </li>
              </ul>
            :
            ""
          }
        </div>
        {
          activeTab == "cases" ? 
            <ClientCases props={props} />
          :
          activeTab == "intake-form-tab" ?
          <ClientNonCaseIntakeFormDetails />
          :
          ""
        }
      </div>
    </div>
  );
};

export default ClientDetails;
