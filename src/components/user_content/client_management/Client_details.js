import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import _ from "lodash";
import { PulseLoader } from "react-spinners";
import { AddEmployeeResponseReset } from "../../actions/employee_management/AddEmployeeAction";
import { Link } from "react-router-dom";
import EmpAvatar from "../../../images/emp_avatar.jpg";

const ClientDetails = (props) => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [pulseLoading, setPulseLoading] = useState(false);
  const [isIntakeFormSent, setIsIntakeFormSent] = useState(false);
  const [formAssignment, setFormAssignment] = useState("");
  const [clientDetails, setClientDetails] = useState([]);
  const [empDetailsLoading, setEmpDetailsLoading] = useState(true);
  const [IntakeForms, setIntakeForms] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
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
        console.log(res.data);
        setClientDetails(res.data);
        console.log(res.data["intake_form"], "form id");
        setFormAssignment(res.data["intake_form"]);
        setEmpDetailsLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
      });

    const config2 = {
      method: "get",
      url: "/api/v1/intake-form/list",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config2)
      .then((res) => {
        setIntakeForms(res.data);
        setTableLoading(false);
      })
      .catch((error) => {
        setTableLoading(false);
      });
  }, []);

  useEffect(() => {}, [clientDetails]);

  const confirmIntakeFormSent = () => {
    if (isIntakeFormSent) {
      return (
        <div
          class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4"
          role="alert"
        >
          <p class="font-bold">Intake form sent successfully</p>
        </div>
      );
    }
  };

  const handleAdd = () => {
    dispatch(AddEmployeeResponseReset());
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    return props.history.push("/user/employee/roles/" + urlvalues[3]);
  };

  const handleFormAssignment = (e, id) => {
    setButtonDisabled(false);
    if (e.target.checked) {
      setFormAssignment(id);
    } else {
      setFormAssignment("");
    }
  };

  const handleAssignForm = () => {
    setPulseLoading(true);
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    var config3 = {
      method: "put",
      url: "/api/v1/send-intake-form/" + urlvalues[3],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      data: {
        form_id: formAssignment,
      },
    };
    axios(config3)
      .then((res) => {
        setPulseLoading(false);
        setIsIntakeFormSent(true);
      })
      .catch((error) => {
        setPulseLoading(false);
      });
  };

  const showData = () => {
    if (pulseLoading) {
      return (
        <div class="">
          <PulseLoader size={10} color={"#6DADE3"} loading={true} />
        </div>
      );
    }
    if (buttonDisabled) {
      return (
        <button class="bg-blue-600 text-white font-bold py-2 px-3 opacity-50 cursor-not-allowed">
          Send Form
        </button>
      );
    }
    return (
      <button
        class="bg-blue-600 text-white px-3 py-2 mb-2 foucs:outline-none"
        onClick={() => handleAssignForm()}
      >
        Send Form
      </button>
    );
  };

  return (
    <div>
      <div class="px-4 sm:px-8">
        {empDetailsLoading ? (
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
                    TOTAL CASES <p class="ml-3 mr-10 text-base text-black">0</p>
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
              {/* any code in place of manage role buttons in employee details page */}
            </div>
          </div>
        )}
        <div class="py-8">
          {confirmIntakeFormSent()}
          {showData()}
          {tableLoading ? (
            <div class="animate-pulse flex space-x-4">
              <div class="flex-1 space-y-4 py-1">
                <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                  <div class="min-w-full shadow rounded-lg overflow-hidden">
                    <table class="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Title
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Created On
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Action
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
              <div class="min-w-full shadow rounded-lg overflow-hidden">
                <table class="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Title
                      </th>
                      <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Created On
                      </th>
                      <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {IntakeForms.map((item, index) => {
                      return (
                        <tr>
                          <td
                            class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                            style={{ maxWidth: "14em" }}
                          >
                            <div class="flex items-center">
                              <div class="mx-3">
                                <input
                                  class="mr-2 leading-tight"
                                  type="checkbox"
                                  onChange={(e) =>
                                    handleFormAssignment(e, item._id.$oid)
                                  }
                                  checked={
                                    formAssignment == item._id.$oid
                                      ? true
                                      : false
                                  }
                                />
                              </div>
                              <div class="ml-3">
                                <p class="text-gray-900">{item.title}</p>
                              </div>
                            </div>
                          </td>

                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-gray-900">{item.createdDate}</p>
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-blue-700 whitespace-no-wrap">
                              <Link to={`/user/intake/form/${item._id.$oid}`}>
                                View Details
                              </Link>
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
      </div>
    </div>
  );
};

export default ClientDetails;
