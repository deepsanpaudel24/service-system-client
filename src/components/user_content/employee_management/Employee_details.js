import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import _ from "lodash";
import { AddEmployeeResponseReset } from "../../actions/employee_management/AddEmployeeAction";
import { Link } from "react-router-dom";
import EmpAvatar from "../../../images/emp_avatar.jpg";
import EmployeeCases from "./Employee_cases";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";
import ProfilePicAvatar from "../../../images/profile_pic_avatar2.png";
import folderEmptyIcon from "../../../images/folder_empty.png";

const EmployeeDetails = (props) => {
  const { t } = props;
  const history = useHistory();
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [empDetailsLoading, setEmpDetailsLoading] = useState(true);

  const [detailsNotFound, setDetailsNotFound] = useState(false)
  const dispatch = useDispatch();
  const response = useSelector((state) => state.addEmployeeResponse);

  useLayoutEffect(() => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    const config = {
      method: "get",
      url: "/api/v1/employee/" + urlvalues[3],
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
        setEmpDetailsLoading(false);
        setDetailsNotFound(true)
      });
  }, []);

  useEffect(() => {}, [employeeDetails]);

  const handleAdd = () => {
    dispatch(AddEmployeeResponseReset());
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    return history.push("/user/employee/roles/" + urlvalues[3]);
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
                   {t("manage_roles")}
                </div>
              </button>
            </div>
          </div>
        )
        :
        detailsNotFound ? 
        <div>
          <p class="mx-3 text-gray-700 text-md">Sorry, no details found.</p>
          <img src={folderEmptyIcon} style={{ width: "60%"}}/>
        </div>
        : 
        (
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
                    <p class="ml-3 mr-10 text-base text-black">
                      {employeeDetails.no_cases}
                    </p>
                     {t("caps_user_since")}
                    <p class="ml-3 mr-10 text-base text-black">
                      {_.isEmpty(employeeDetails.createdDate)
                        ? "-"
                        : employeeDetails.createdDate}
                    </p>
                    {t("caps_status")}{" "}
                    {employeeDetails.is_verified ? (
                      <p class="ml-3 text-base text-green-600">{t("caps_active")}</p>
                    ) : (
                      <p class="ml-3 text-base text-red-600">
                        {t("caps_unverified")}
                      </p>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div class="w-1/5 flex justify-end">
              <button class="focus:outline-none" onClick={() => handleAdd()}>
                <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">
                   {t("manage_roles")}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
      {
        detailsNotFound ? 
        ""
        :
        <EmployeeCases />
      }
    </div>
  );
};

export default withTranslation() (EmployeeDetails);
