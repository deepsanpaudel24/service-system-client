import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import _ from "lodash";
import { AddCustomTaskResponseReset } from "../../actions/custom_task/AddCustomTaskAction";

const ClientIntakeFormList = (props) => {
  const [IntakeForms, setIntakeForms] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const dispatch = useDispatch();
  const response = useSelector((state) => state.NewCaseRequestResponse);

  useLayoutEffect(() => {
    const config = {
      method: "get",
      url: "/api/v1/intake-form/list",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then((res) => {
        setIntakeForms(res.data);
        setTableLoading(false);
      })
      .catch((error) => {
        setTableLoading(false);
      });
  }, []);

  useEffect(() => {}, [IntakeForms]);

  const handleAdd = () => {
    dispatch(AddCustomTaskResponseReset());
    return props.history.push("/user/create-intake-form");
  };

  return (
    <div>
      <div class="px-4 sm:px-8">
        <div class="flex min-w-full">
          <div class="w-2/5">
            <p class="text-3xl my-3" style={{ textAlign: "left" }}>
              Client Intake Forms
            </p>
          </div>
          <div class="w-2/5"></div>
          <button class="focus:outline-none" onClick={() => handleAdd()}>
            <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">
              Add Client Intake-Form
            </div>
          </button>
        </div>
        <div class="py-8">
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

export default ClientIntakeFormList;
