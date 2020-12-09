import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import EmpAvatar from "../../../images/emp_avatar.jpg";
import { UpdateEmployeeRolesDispatcher } from "../../actions/employee_management/EmployeeRolesAction";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";
import ProfilePicAvatar from "../../../images/profile_pic_avatar2.png";

const EmployeeRoles = (props) => {
  const { t } = props;
  const history = useHistory();
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [empDetailsLoading, setEmpDetailsLoading] = useState(true);
  const [SM, setSM] = useState(false);
  const [CMloading, setCMloading] = useState(false);
  const [CM, setCM] = useState(false);

  const [caseManagement, setCaseManagement] = useState(false);
  const [assignCaseManagement, setAssignCaseManagement] = useState(false);
  const [Collaborator, setCollaborator] = useState(false);
  const [Reviewer, setReviewer] = useState(false);
  const [IntakeForm, setIntakeForm] = useState(false);
  const [CustomTask, setCustomTask] = useState(false);

  const dispatch = useDispatch();
  const response = useSelector((state) => state.UpdateEmployeeRolesResponse);

  useLayoutEffect(() => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    const config = {
      method: "get",
      url: "/api/v1/employee/" + urlvalues[4],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then((res) => {
        setEmployeeDetails(res.data);
        setEmpDetailsLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  useEffect(() => {
    setCaseManagement(employeeDetails.caseManagement);
    setAssignCaseManagement(employeeDetails.assignCaseManagement);
    setSM(employeeDetails.serviceManagement);
    setCM(employeeDetails.clientManagement);
    setCollaborator(employeeDetails.collaborator);
    setReviewer(employeeDetails.reviewer);
    setIntakeForm(employeeDetails.IntakeForm);
    setCustomTask(employeeDetails.CustomTask);
  }, [employeeDetails]);

  const handleCollaboratorChange = (e) => {
    setCollaborator(e.target.checked);
  };

  const handleReviewerChange = (e) => {
    setReviewer(e.target.checked);
  };

  // For full fledged case management module access
  const handleCaseManagement = (e) => {
    setCaseManagement(e.target.checked);
    setAssignCaseManagement(e.target.checked);
  };

  // For only the assigned case moudle acess
  const handleAssignCaseManagement = (e) => {
    setAssignCaseManagement(e.target.checked);
  };

  const handleClientIntakeForm = (e) => {
    setIntakeForm(e.target.checked);
  };

  const handleCustomTask = (e) => {
    setCustomTask(e.target.checked);
  };

  const handleServiceManagementChange = (e) => {
    setSM(e.target.checked);
  };

  const handleClientManagementChange = (e) => {
    setCM(e.target.checked);
  };

  const handleRolesSubmit = () => {
    var data = {
      caseManagement: caseManagement,
      assignCaseManagement: assignCaseManagement,
      serviceManagement: SM,
      clientManagement: CM,
      collaborator: Collaborator,
      reviewer: Reviewer,
      IntakeForm: IntakeForm,
      CustomTask: CustomTask,
    };
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    dispatch(UpdateEmployeeRolesDispatcher(data, urlvalues[4]));
  };

  const confirmRolesUpdate = () => {
    if (!_.isEmpty(response.data)) {
      return (
        <div
          class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4"
          role="alert"
        >
          <p class="font-bold">{t("roles_updated_successfully")}</p>
        </div>
      );
    }
  };

  const showData = () => {
    if (response.loading) {
      return (
        <div class="">
          <PulseLoader size={10} color={"#6DADE3"} loading={true} />
        </div>
      );
    }
    return (
      <button
        class="hover:bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline"
        type="button"
        style={{ backgroundColor: "#3490ff" }}
        onClick={() => handleRolesSubmit()}
      >
        {t("submit")}
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
              <button class="focus:outline-none">
                <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">
                  {t("manage_roles")}
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
                  src={ProfilePicAvatar}
                />
                <div
                  class="ml-5 y-5"
                  style={{ marginTop: "1.5em", marginLeft: "2em" }}
                >
                  <h1 class="text-2xl font-bold">
                    {_.isEmpty(employeeDetails.name)
                      ? "-"
                      : employeeDetails.name}
                  </h1>
                  <h1 class="text-1xl my-1">
                    {_.isEmpty(employeeDetails.email)
                      ? "-"
                      : employeeDetails.email}
                  </h1>
                  <p class="flex mt-8 text-base text-gray-600">
                    {t("caps_total_cases")}{" "}
                    <p class="ml-3 mr-10 text-base text-black">3</p>
                    {t("user_since")}
                    <p class="ml-3 mr-10 text-base text-black">
                      {_.isEmpty(employeeDetails.createdDate)
                        ? "-"
                        : employeeDetails.createdDate}
                    </p>
                    {t("caps_status")}{" "}
                    {employeeDetails.is_verified ? (
                      <p class="ml-3 text-base text-green-600">
                        {t("caps_verified")}
                      </p>
                    ) : (
                      <p class="ml-3 text-base text-red-600">
                        {t("caps_unverified")}
                      </p>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div class="my-8">
          <h1 class="text-2xl text-gray-800">{t("roles_and_permission")}</h1>
          <p class="text-sm text-gray-600 flex items-center">
            <svg
              class="fill-current text-gray-500 w-3 h-3 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
            </svg>
            {t("admin_only")}
          </p>
          {confirmRolesUpdate()}
          {employeeDetails.user_type == "SPCAe" ? (
            <div class="flex my-3">
              <div class="w-3/5">
                <div>
                  <div class="flex">
                    <div>
                      <input
                        class="my-3"
                        type="checkbox"
                        value="SM"
                        onChange={(e) => handleCaseManagement(e)}
                        checked={caseManagement}
                      />
                    </div>
                    <div style={{ marginLeft: "2em" }}>
                      <div class="mb-8">
                        <div class="flex text-gray-800 font-bold text-xl mb-2">
                          {t("case_management")}
                        </div>
                        <hr class="border-gray-400" />
                        <p class="text-gray-700 text-sm my-5">
                          {t("employee_permission_info")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {caseManagement ? (
                    <div class="flex" style={{ marginLeft: "3em" }}>
                      <div>
                        <input
                          class="my-3"
                          type="checkbox"
                          value="SM"
                          checked={assignCaseManagement}
                          disabled
                        />
                      </div>
                      <div style={{ marginLeft: "2em" }}>
                        <div class="mb-8">
                          <div class="flex text-gray-800 font-bold text-xl mb-2">
                            {t("assigned_case_management")}
                          </div>
                          <hr class="border-gray-400" />
                          <p class="text-gray-700 text-sm my-5">
                            {t("employee_permission_info")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div class="flex" style={{ marginLeft: "3em" }}>
                      <div>
                        <input
                          class="my-3"
                          type="checkbox"
                          value="SM"
                          onChange={(e) => handleAssignCaseManagement(e)}
                          checked={assignCaseManagement}
                        />
                      </div>
                      <div style={{ marginLeft: "2em" }}>
                        <div class="mb-8">
                          <div class="flex text-gray-800 font-bold text-xl mb-2">
                            {t("assigned_case_management")}
                          </div>
                          <hr class="border-gray-400" />
                          <p class="text-gray-700 text-sm my-5">
                            {t("employee_permission_info")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div class="flex">
                  <div>
                    <input
                      class="my-3"
                      type="checkbox"
                      value="SM"
                      onChange={(e) => handleServiceManagementChange(e)}
                      checked={SM}
                    />
                  </div>
                  <div style={{ marginLeft: "2em" }}>
                    <div class="mb-8">
                      <div class="flex text-gray-800 font-bold text-xl mb-2">
                        {t("service_management")}
                      </div>
                      <hr class="border-gray-400" />
                      <p class="text-gray-700 text-sm my-5">
                        {t("employee_permission_info")}
                      </p>
                    </div>
                  </div>
                </div>
                {CMloading ? (
                  <div class="animate-pulse flex space-x-4 mb-8">
                    <div class="flex-1 space-y-4 py-1">
                      <div class="h-4 bg-gray-400 rounded w-3/4"></div>
                      <hr class="border-gray-400" />
                      <div class="space-y-2">
                        <div class="h-4 bg-gray-400 rounded"></div>
                        <div class="h-4 bg-gray-400 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div class="flex">
                    <div>
                      <input
                        class="my-3"
                        type="checkbox"
                        value="SM"
                        onChange={(e) => handleClientManagementChange(e)}
                        checked={CM}
                      />
                    </div>
                    <div style={{ marginLeft: "2em" }}>
                      <div class="mb-8">
                        <div class="flex text-gray-800 font-bold text-xl mb-2">
                          {t("client_management")}
                        </div>
                        <hr class="border-gray-400" />
                        <p class="text-gray-700 text-sm my-5">
                          {t("employee_permission_info")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div class="flex">
                  <div>
                    <input
                      class="my-3"
                      type="checkbox"
                      value="SM"
                      onChange={(e) => handleCollaboratorChange(e)}
                      checked={Collaborator}
                    />
                  </div>
                  <div style={{ marginLeft: "2em" }}>
                    <div class="mb-8">
                      <div class="flex text-gray-800 font-bold text-xl mb-2">
                        {t("collaborator")}
                      </div>
                      <hr class="border-gray-400" />
                      <p class="text-gray-700 text-sm my-5">
                        {t("employee_as_collaborator")}{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div>
                    <input
                      class="my-3"
                      type="checkbox"
                      value="SM"
                      onChange={(e) => handleReviewerChange(e)}
                      checked={Reviewer}
                    />
                  </div>
                  <div style={{ marginLeft: "2em" }}>
                    <div class="mb-8">
                      <div class="flex text-gray-800 font-bold text-xl mb-2">
                        {t("reviewer")}
                      </div>
                      <hr class="border-gray-400" />
                      <p class="text-gray-700 text-sm my-5">
                        {t("employee_as_reviewer")}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex">
                  <div>
                    <input
                      class="my-3"
                      type="checkbox"
                      value="SM"
                      onChange={(e) => handleClientIntakeForm(e)}
                      checked={IntakeForm}
                    />
                  </div>
                  <div style={{ marginLeft: "2em" }}>
                    <div class="mb-8">
                      <div class="flex text-gray-800 font-bold text-xl mb-2">
                        {t("client_intake_form")}
                      </div>
                      <hr class="border-gray-400" />
                      <p class="text-gray-700 text-sm my-5">
                        {t("employee_intake_form_permission")}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex">
                  <div>
                    <input
                      class="my-3"
                      type="checkbox"
                      value="SM"
                      onChange={(e) => handleCustomTask(e)}
                      checked={CustomTask}
                    />
                  </div>
                  <div style={{ marginLeft: "2em" }}>
                    <div class="mb-8">
                      <div class="flex text-gray-800 font-bold text-xl mb-2">
                        {t("custom_task")}
                      </div>
                      <hr class="border-gray-400" />
                      <p class="text-gray-700 text-sm my-5">
                        {t("employee_custom_task_permission")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div class="flex my-3">
              <div class="w-3/5">
                <div>
                  <div class="flex">
                    <div>
                      <input
                        class="my-3"
                        type="checkbox"
                        value="SM"
                        onChange={(e) => handleCaseManagement(e)}
                        checked={caseManagement}
                      />
                    </div>
                    <div style={{ marginLeft: "2em" }}>
                      <div class="mb-8">
                        <div class="flex text-gray-800 font-bold text-xl mb-2">
                          {t("case_management")}
                        </div>
                        <hr class="border-gray-400" />
                        <p class="text-gray-700 text-sm my-5">
                          {t("employee_case_management_permission")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {caseManagement ? (
                    <div class="flex" style={{ marginLeft: "3em" }}>
                      <div>
                        <input
                          class="my-3"
                          type="checkbox"
                          value="SM"
                          checked={assignCaseManagement}
                          disabled
                        />
                      </div>
                      <div style={{ marginLeft: "2em" }}>
                        <div class="mb-8">
                          <div class="flex text-gray-800 font-bold text-xl mb-2">
                            {t("assigned_case_management")}
                          </div>
                          <hr class="border-gray-400" />
                          <p class="text-gray-700 text-sm my-5">
                            {t("assigned_case_permission")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div class="flex" style={{ marginLeft: "3em" }}>
                      <div>
                        <input
                          class="my-3"
                          type="checkbox"
                          value="SM"
                          onChange={(e) => handleAssignCaseManagement(e)}
                          checked={assignCaseManagement}
                        />
                      </div>
                      <div style={{ marginLeft: "2em" }}>
                        <div class="mb-8">
                          <div class="flex text-gray-800 font-bold text-xl mb-2">
                            {t("assigned_case_management")}
                          </div>
                          <hr class="border-gray-400" />
                          <p class="text-gray-700 text-sm my-5">
                            {t("assigned_case_management_permission")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div class="flex justify-start my-2">{showData()}</div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation() (EmployeeRoles);
