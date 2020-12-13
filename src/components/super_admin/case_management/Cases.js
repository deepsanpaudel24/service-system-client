import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import _ from "lodash";
import Pagination from "../Pagination";
import {
  SACaseListStorageDispatcher,
  SACaseListStorageResponseReset,
} from "../../actions/case_management/SuperAdminCaseListStorageDispatcher";
import { ForwardCaseRequestDispactherResponseReset } from "../../actions/case_management/ForwardCaseRequestAction";
import { FinalPaymentTransferDispatcherResponseReset } from "../../actions/case_management/FinalPaymentTransferAction";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";

const ViewCasesSA = ({t}) => {
  const history = useHistory();
  const [cases, setCases] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [caseForwardedConfirm, setCaseForwardedConfirm] = useState(false);
  const [TransferConfirm, setTransferConfirm] = useState(false);
  // For sorting
  const [sortingKey, setSortingKey] = useState(null);
  const [sortingValue, setSortingValue] = useState(null);
  // states for pagination
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  // states for search
  const [searchKeyword, setSearchKeyword] = useState("");
  // states for filters
  const [filters, setFilters] = useState([]);
  const [activeRequestedFilter, setActiveRequestedFilter] = useState(false);
  const [activeOnprogressFilter, setActiveOnprogressFilter] = useState(false);
  const [activeCompletedFilter, setActiveCompletedFilter] = useState(false);

  const dispatch = useDispatch();
  const response2 = useSelector((state) => state.SACaseListStorageResponse);
  const response3 = useSelector((state) => state.ForwardCaseRequestResponse);
  const response4 = useSelector((state) => state.FinalPaymentTransferResponse);

  useLayoutEffect(() => {
    const config = {
      method: "get",
      url: "/api/v1/cases/" + page,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (!_.isEmpty(response3.data)) {
      setCaseForwardedConfirm(true);
      dispatch(ForwardCaseRequestDispactherResponseReset());
      axios(config)
        .then((res) => {
          setCases(res.data["cases"]);
          setTableLoading(false);
          setTotalRecords(res.data["total_records"]);
          var page = res.data["page"];
          dispatch(
            SACaseListStorageDispatcher({
              [page]: res.data["cases"],
              total_records: res.data["total_records"],
            })
          );
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else if (!_.isEmpty(response4.data)) {
      setTransferConfirm(true);
      dispatch(FinalPaymentTransferDispatcherResponseReset());
      axios(config)
        .then((res) => {
          setCases(res.data["cases"]);
          setTableLoading(false);
          setTotalRecords(res.data["total_records"]);
          var page = res.data["page"];
          dispatch(
            SACaseListStorageDispatcher({
              [page]: res.data["cases"],
              total_records: res.data["total_records"],
            })
          );
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      if (response2.data.hasOwnProperty(1)) {
        var casesList = response2.data[1];
        setCases(casesList);
        setTableLoading(false);
        setTotalRecords(response2.data["total_records"]);
      } else {
        axios(config)
          .then((res) => {
            setCases(res.data["cases"]);
            setTableLoading(false);
            setTotalRecords(res.data["total_records"]);
            var page = res.data["page"];
            dispatch(
              SACaseListStorageDispatcher({
                [page]: res.data["cases"],
                total_records: res.data["total_records"],
              })
            );
          })
          .catch((error) => {
            console.log(error.response);
          });
      }
    }
  }, []);

  useEffect(() => {}, [cases]);

  // For pagination Component
  const handlePageChange = (value) => {
    setPage(value);
    const config = {
      method: "post",
      url: "/api/v1/cases/" + value,
      data: {
        keyword: searchKeyword,
        filters: filters,
        sorting: {
          sortingKey: sortingKey,
          sortingValue: sortingValue,
        },
      },
    };
    if (response2.data.hasOwnProperty(value)) {
      var casesList = response2.data[value];
      setCases(casesList);
    } else {
      axios(config)
        .then((res) => {
          setCases(res.data["cases"]);
          setTableLoading(false);
          setTotalRecords(res.data["total_records"]);
          var reduxResponse = response2.data;
          var page = res.data["page"];
          reduxResponse[page] = res.data["cases"];
          reduxResponse["total_records"] = res.data["total_records"];
          dispatch(SACaseListStorageDispatcher(reduxResponse));
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  const SortingRequest = (value) => {
    // send reset dispatch request to redux
    dispatch(SACaseListStorageResponseReset());
    setPage(1);
    setTableLoading(true);
    var defaultPage = 1;
    const config = {
      method: "post",
      url: "/api/v1/cases/" + defaultPage,
      data: {
        keyword: searchKeyword,
        filters: filters,
        sorting: value,
      },
    };
    axios(config)
      .then((res) => {
        setCases(res.data["cases"]);
        setTableLoading(false);
        setTotalRecords(res.data["total_records"]);
        var reduxResponse = [];
        var page = res.data["page"];
        reduxResponse[page] = res.data["cases"];
        reduxResponse["total_records"] = res.data["total_records"];
        dispatch(SACaseListStorageDispatcher(reduxResponse));
      })
      .catch((error) => {
        console.log("response error of search", error.response);
      });
  };

  // For sorting
  const handleSorting = (value) => {
    // check if sorting has value
    if (sortingKey == value) {
      if (sortingValue == 1) {
        // create var beacuse set state is async event
        var data = {
          sortingKey: value,
          sortingValue: -1,
        };
        SortingRequest(data);
        // Desending
        setSortingKey(data["sortingKey"]);
        setSortingValue(data["sortingValue"]);
      } else {
        //neutral
        // create var beacuse set state is async event
        var data = {
          sortingKey: "_id",
          sortingValue: -1,
        };
        SortingRequest(data);
        // Assending
        setSortingKey(data["sortingKey"]);
        setSortingValue(data["sortingValue"]);
      }
    } else {
      // create var beacuse set state is async event
      var data = {
        sortingKey: value,
        sortingValue: 1,
      };
      SortingRequest(data);
      // Assending
      setSortingKey(data["sortingKey"]);
      setSortingValue(data["sortingValue"]);
    }
  };

  // For search bar action
  const handleSearch = (e) => {
    // send reset dispatch request to redux
    dispatch(SACaseListStorageResponseReset());
    setPage(1);
    setSearchKeyword(e.target.value);
    setTableLoading(true);
    var defaultPage = 1;
    setSortingKey("");
    setSortingValue(null);
    const config = {
      method: "post",
      url: "/api/v1/cases/" + defaultPage,
      data: {
        keyword: e.target.value,
        filters: filters,
        sorting: {
          sortingKey: "",
          sortingValue: "",
        },
      },
    };
    axios(config)
      .then((res) => {
        setCases(res.data["cases"]);
        setTableLoading(false);
        setTotalRecords(res.data["total_records"]);
        var reduxResponse = [];
        var page = res.data["page"];
        reduxResponse[page] = res.data["cases"];
        reduxResponse["total_records"] = res.data["total_records"];
        dispatch(SACaseListStorageDispatcher(reduxResponse));
      })
      .catch((error) => {
        console.log("response error of search", error.response);
      });
  };

  // For filters
  // have a funtion that makes the axios request and retrieve the filtered data
  const handleFilter = (data) => {
    // send reset dispatch request to redux
    dispatch(SACaseListStorageResponseReset());
    setPage(1);
    setTableLoading(true);
    setSortingKey("");
    setSortingValue(null);
    var defaultPage = 1;
    const config = {
      method: "post",
      url: "/api/v1/cases/" + defaultPage,
      data: {
        keyword: searchKeyword,
        filters: data,
        sorting: {
          sortingKey: "",
          sortingValue: "",
        },
      },
    };
    axios(config)
      .then((res) => {
        setCases(res.data["cases"]);
        setTableLoading(false);
        setTotalRecords(res.data["total_records"]);
        var reduxResponse = [];
        var page = res.data["page"];
        reduxResponse[page] = res.data["cases"];
        reduxResponse["total_records"] = res.data["total_records"];
        dispatch(SACaseListStorageDispatcher(reduxResponse));
      })
      .catch((error) => {
        console.log("response error of search", error.response);
      });
  };

  //for the filter "Requested"
  const handleRequestedFilter = () => {
    var filters_value = filters;
    // this making the filter inactive if it is active now
    // or making the filter active if it is inactive now
    if (activeRequestedFilter) {
      setActiveRequestedFilter(false);
      var result = filters_value.filter((item) => item.status !== "Requested");
      handleFilter(result);
      setFilters(result);
    } else {
      setActiveRequestedFilter(true);
      filters_value.push({ status: "Requested" });
      handleFilter(filters_value);
      setFilters(filters_value);
    }
  };

  //for the filter "On-progress"
  const handleOnprogressFilter = () => {
    var filters_value = filters;
    // this making the filter inactive if it is active now
    // or making the filter active if it is inactive now
    if (activeOnprogressFilter) {
      setActiveOnprogressFilter(false);
      var result = filters_value.filter(
        (item) => item.status !== "On-progress"
      );
      handleFilter(result);
      setFilters(result);
    } else {
      setActiveOnprogressFilter(true);
      filters_value.push({ status: "On-progress" });
      handleFilter(filters_value);
      setFilters(filters_value);
    }
  };

  //for the filter "Completed"
  const handleCompletedFilter = () => {
    var filters_value = filters;
    // this making the filter inactive if it is active now
    // or making the filter active if it is inactive now
    if (activeCompletedFilter) {
      setActiveCompletedFilter(false);
      var result = filters_value.filter((item) => item.status !== "Closed");
      handleFilter(result);
      setFilters(result);
    } else {
      setActiveCompletedFilter(true);
      filters_value.push({ status: "Closed" });
      handleFilter(filters_value);
      setFilters(filters_value);
    }
  };

  return (
    <div>
      <div class="px-4">
        <div class="flex">
          <div class="w-1/5">
            <p class="text-3xl my-3" style={{ textAlign: "left" }}>
              {t("cases")}
            </p>
          </div>
          <div class="w-1/5"></div>
          <div class="w-1/5"></div>
          <div class="w-1/5"></div>
          <div class="w-1/5"></div>
        </div>
        <nav>
          <div class="">
            <div class="relative flex items-center justify-between h-16">
              <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div
                  class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"
                  onClick={() => handleRequestedFilter()}
                >
                  <div
                    class={`rounded-full text-sm px-3 py-1 ${
                      activeRequestedFilter ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {t("requested")}
                  </div>
                </div>
                <div
                  class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"
                  onClick={() => handleOnprogressFilter()}
                >
                  <div
                    class={`rounded-full text-sm px-3 py-1 ${
                      activeOnprogressFilter ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {t("on_progress")}
                  </div>
                </div>
                <div
                  class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"
                  onClick={() => handleCompletedFilter()}
                >
                  <div
                    class={`rounded-full text-sm px-3 py-1 ${
                      activeCompletedFilter ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {t("closed")}
                  </div>
                </div>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <input
                  placeholder="Search"
                  type="text"
                  class="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
            </div>
          </div>
        </nav>
        <div class="py-4">
          {caseForwardedConfirm ? (
            <div
              class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
              role="alert"
            >
              <p class="font-bold">{t("case_forwarded_successfully")}</p>
            </div>
          ) : (
            ""
          )}
          {TransferConfirm ? (
            <div
              class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
              role="alert"
            >
              <p class="font-bold">{t("final_payment_transefer")}</p>
            </div>
          ) : (
            ""
          )}
          {tableLoading ? (
            <div class="animate-pulse flex space-x-4">
              <div class="flex-1 space-y-4 py-1">
                <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                  <div class="min-w-full shadow rounded-lg overflow-hidden">
                    <table class="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {t("title")}
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {t("status")}
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {t("case_tags")}
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {t("requested_on")}
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
            <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
              <div class="inline-block min-w-full shadow rounded-lg overflow-hidden mt-4">
                <table class="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSorting("title")}
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {t("title")}
                      </th>
                      <th
                        onClick={() => handleSorting("status")}
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {t("status")}
                      </th>
                      <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {t("case_tags")}
                      </th>
                      <th
                        onClick={() => handleSorting("requestedDate")}
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {t("requested_on")}
                      </th>
                      <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {t("action")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((item, index) => {
                      return (
                        <tr>
                          <td
                            class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                            style={{ maxWidth: "15em", minWidth: "22em" }}
                          >
                            <div class="flex items-center">
                              <div class="ml-3">
                                <p class="text-blue-700">
                                  <Link to={`/sadmin/case/${item._id.$oid}`}>
                                    {item.title}
                                  </Link>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td
                            class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                            style={{ maxWidth: "12em" }}
                          >
                            {item.status == "Requested" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-blue-300 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">{t("requested")}</span>
                              </span>
                            ) : item.status == "Forwarded" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-blue-300 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">{t("forwarded")}</span>
                              </span>
                            ) : item.status == "Proposal-Forwarded" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">
                                  {t("proposal_forwarded")}
                                </span>
                              </span>
                            ) : item.status == "Contract-Waiting" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-indigo-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-indigo-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">
                                  {t("waiting_contract_paper")}
                                </span>
                              </span>
                            ) : item.status == "Contract-Sent" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-indigo-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-indigo-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">
                                  {t("contract_paper_sent")}
                                </span>
                              </span>
                            ) : item.status == "Contract-Replied" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-indigo-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-indigo-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">
                                  {t("signed_contract_paper_sent")}
                                </span>
                              </span>
                            ) : item.status == "Awaiting-Advance-Payment" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-indigo-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-indigo-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">
                                  {t("awaiting_advance_installment")}
                                </span>
                              </span>
                            ) : item.status == "On-progress" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">{t("on_progress")}</span>
                              </span>
                            ) : item.status == "Request-Completion" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">
                                  {t("completion_requested")}
                                </span>
                              </span>
                            ) : item.status == "Confirm-Completion" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">
                                  {t("awaiting_final_installment")}
                                </span>
                              </span>
                            ) : item.status ==
                              "Client-Final-Installment-Paid" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">
                                  {t("final_payment_received")}
                                </span>
                              </span>
                            ) : item.status == "Closed" ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">{t("closed")}</span>
                              </span>
                            ) : (
                              <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">{t("completed")}</span>
                              </span>
                            )}
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div class="flex">
                              {item.caseTags.map((item, index) =>
                                index > 1 ? (
                                  ""
                                ) : (
                                  <span
                                    key={index}
                                    class="relative inline-block px-3 py-1 my-1 mx-1 font-semibold text-gray-900 leading-tight"
                                  >
                                    <span
                                      aria-hidden
                                      class="absolute inset-0 bg-gray-300 opacity-50"
                                    ></span>
                                    <span class="relative">{item}</span>
                                  </span>
                                )
                              )}
                            </div>
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-gray-900">{item.requestedDate}</p>
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-blue-700 whitespace-no-wrap">
                              <Link to={`/sadmin/case/${item._id.$oid}`}>
                               {t("view_details")}
                              </Link>
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div>
                <Pagination
                  pageChanger={handlePageChange}
                  totalRows={totalRecords}
                  activePage={page}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withTranslation() (ViewCasesSA);
