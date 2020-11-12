import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import _ from "lodash";
import { PulseLoader } from "react-spinners";
import ClientDetails from "../client_management/Client_details";

const SendIntakeForm = (props) => {
  const [IntakeForms, setIntakeForms] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [pulseLoading, setPulseLoading] = useState(false);
  const [isIntakeFormSent, setIsIntakeFormSent] = useState(false);
  const [formAssignment, setFormAssignment] = useState([]);
  const [clientDetails, setClientDetails] = useState([]);
  const [empDetailsLoading, setEmpDetailsLoading] = useState(true);
  const [firstTime, setFirstTime] = useState(true)
  const [enableForm, setEnableForm] = useState("")
  const [disabledForms, setDisabledForms] = useState([])
  const dispatch = useDispatch();
  const response = useSelector((state) => state.NewCaseRequestResponse);

  useLayoutEffect(() => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    const config = {
      method: "get",
      url: "/api/v1/client-details/" + urlvalues[4],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then((res) => {
        setClientDetails(res.data);
        var ids = [] 
        res.data["intake_forms"].map((item) => ids.push(item.$oid))
        setFormAssignment(ids);
        setDisabledForms(ids)
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

  const handleFormAssignment = (e, id) => {
    setButtonDisabled(false);
    setFirstTime(false)
    if (e.target.checked) {
      setFormAssignment([...formAssignment, id]);
      setEnableForm(id)
    } else {
      setFormAssignment("");
      setEnableForm("")
      setFirstTime(true)
    }
  };

  const handleAssignForm = () => {
    setPulseLoading(true);
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    var config3 = {
      method: "put",
      url: "/api/v1/send-intake-form/" + urlvalues[4],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      data: {
        forms_id: formAssignment,
      },
    };
    axios(config3)
      .then((res) => {
        setPulseLoading(false);
        setIsIntakeFormSent(true);
        props.history.push("/user/client/"+ urlvalues[4])
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
        <div class="flex min-w-full">
          <div class="w-2/5">
            <p class="text-3xl my-3" style={{ textAlign: "left" }}>
              Send Client Intake Form
            </p>
          </div>
          <div class="w-2/5"></div>
          <div class="w-1/5" >
          </div>
        </div>
        <div class="py-8">
            {confirmIntakeFormSent()}
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
                              {
                                disabledForms.includes(item._id.$oid) ? 
                                <td
                                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                                    style={{ maxWidth: "14em" }}
                                >
                                <div class="flex items-center">
                                  <div class="mx-3">
                                    <input type="checkbox" checked disabled/>
                                  </div>
                                  <div class="ml-3">
                                      <p class="text-gray-900">{item.title}</p>
                                  </div>
                                  </div>
                              </td>
                              :
                              <td
                              class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                              style={{ maxWidth: "14em" }}
                          >
                              <div class="flex items-center">
                              <div class="mx-3">
                                {
                                  firstTime ? 
                                  <input
                                  class="mr-2 leading-tight"
                                  type="checkbox"
                                  onChange={(e) =>
                                      handleFormAssignment(e, item._id.$oid)
                                  }
                                  checked={
                                      formAssignment.includes(item._id.$oid)
                                      ? true
                                      : false
                                  }
                                  />
                                  :
                                    enableForm == item._id.$oid ? 
                                    <input
                                    class="mr-2 leading-tight"
                                    type="checkbox"
                                    onChange={(e) =>
                                        handleFormAssignment(e, item._id.$oid)
                                    }
                                    checked={
                                      formAssignment.includes(item._id.$oid)
                                        ? true
                                        : false
                                    }
                                    />
                                  :
                                    <input
                                    class="mr-2 leading-tight disabled"
                                    type="checkbox"
                                    disabled
                                    onChange={(e) =>
                                        handleFormAssignment(e, item._id.$oid)
                                    }
                                    checked={
                                      formAssignment.includes(item._id.$oid)
                                        ? true
                                        : false
                                    }
                                  />
                                }
                              </div>
                              <div class="ml-3">
                                  <p class="text-gray-900">{item.title}</p>
                              </div>
                              </div>
                              </td>
                              }

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
            <div class="my-4">
                {showData()}
                      <pre>{JSON.stringify(formAssignment, null, 2)}</pre>
            </div>
            </div>
        </div>
    </div>
  );
};

export default SendIntakeForm;
