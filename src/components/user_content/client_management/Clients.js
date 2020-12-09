import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Link } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import { AddClientResponseReset } from "../../actions/client_management/AddClientAction";
import {
  ClientListStorageDispatcher,
  ClientListStorageResponseReset,
} from "../../actions/client_management/ClientListStorage";
import Pagination from "../Pagination";
import ProfilePicAvatar from "../../../images/profile_pic_avatar2.png";

const Clients = (props) => {
  const [clients, setClients] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

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
  const [activeVerfiedFilter, setActiveVerifiedFilter] = useState(false);
  const [activeUnverfiedFilter, setActiveUnverifiedFilter] = useState(false);

  const dispatch = useDispatch();
  const response2 = useSelector((state) => state.ClientListStorageResponse);

  // gets authorized client
  useLayoutEffect(() => {
    const config = {
      method: "get",
      url: "/api/v1/clients/" + page,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (response2.data.hasOwnProperty(1)) {
      var clientList = response2.data[1];
      setClients(clientList);
      setTableLoading(false);
      setTotalRecords(response2.data["total_records"]);
    } else {
      axios(config)
        .then((res) => {
          setClients(res.data["clients"]);
          setTableLoading(false);
          setTotalRecords(res.data["total_records"]);
          var page = res.data["page"];
          dispatch(
            ClientListStorageDispatcher({
              [page]: res.data["clients"],
              total_records: res.data["total_records"],
            })
          );
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  }, []);

  useEffect(() => {}, [clients]);

  const SortingRequest = (value) => {
    // send reset dispatch request to redux
    dispatch(ClientListStorageResponseReset());
    setPage(1);
    setTableLoading(true);
    var defaultPage = 1;
    const config = {
      method: "post",
      url: "/api/v1/clients/" + defaultPage,
      data: {
        keyword: searchKeyword,
        filters: filters,
        sorting: value,
      },
    };
    axios(config)
      .then((res) => {
        setClients(res.data["clients"]);
        setTableLoading(false);
        setTotalRecords(res.data["total_records"]);
        var reduxResponse = [];
        var page = res.data["page"];
        reduxResponse[page] = res.data["clients"];
        reduxResponse["total_records"] = res.data["total_records"];
        dispatch(ClientListStorageDispatcher(reduxResponse));
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

  // For pagination Component
  const handlePageChange = (value) => {
    setPage(value);
    const config = {
      method: "post",
      url: "/api/v1/clients/" + value,
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
      var clientList = response2.data[value];
      setClients(clientList);
    } else {
      axios(config)
        .then((res) => {
          setClients(res.data["clients"]);
          setTableLoading(false);
          setTotalRecords(res.data["total_records"]);
          var reduxResponse = response2.data;
          var page = res.data["page"];
          reduxResponse[page] = res.data["clients"];
          reduxResponse["total_records"] = res.data["total_records"];
          dispatch(ClientListStorageDispatcher(reduxResponse));
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  const regex = /^\.com$/;
  // For search bar action
  const handleSearch = (e) => {
    var search_keyword;
    if (!regex.test(e.target.value)) {
      setSearchKeyword(e.target.value);
      search_keyword = e.target.value;
    } else {
      setSearchKeyword("");
      search_keyword = "";
    }
    // send reset dispatch request to redux
    dispatch(ClientListStorageResponseReset());
    setPage(1);
    setSearchKeyword(e.target.value);
    setTableLoading(true);
    var defaultPage = 1;
    setSortingKey("");
    setSortingValue(null);
    const config = {
      method: "post",
      url: "/api/v1/clients/" + defaultPage,
      data: {
        keyword: search_keyword,
        filters: filters,
        sorting: {
          sortingKey: "",
          sortingValue: "",
        },
      },
    };
    axios(config)
      .then((res) => {
        setClients(res.data["clients"]);
        setTableLoading(false);
        setTotalRecords(res.data["total_records"]);
        var reduxResponse = [];
        var page = res.data["page"];
        reduxResponse[page] = res.data["clients"];
        reduxResponse["total_records"] = res.data["total_records"];
        dispatch(ClientListStorageDispatcher(reduxResponse));
      })
      .catch((error) => {
        console.log("response error of search", error.response);
      });
  };

  // For filters
  // have a funtion that makes the axios request and retrieve the filtered data
  const handleFilter = (data) => {
    // send reset dispatch request to redux
    dispatch(ClientListStorageResponseReset());
    setPage(1);
    setTableLoading(true);
    setSortingKey("");
    setSortingValue(null);
    var defaultPage = 1;
    const config = {
      method: "post",
      url: "/api/v1/clients/" + defaultPage,
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
        setClients(res.data["clients"]);
        setTableLoading(false);
        setTotalRecords(res.data["total_records"]);
        var reduxResponse = [];
        var page = res.data["page"];
        reduxResponse[page] = res.data["clients"];
        reduxResponse["total_records"] = res.data["total_records"];
        dispatch(ClientListStorageDispatcher(reduxResponse));
      })
      .catch((error) => {
        console.log("response error of search", error.response);
      });
  };

  //for the filter "verified"
  const handleVerfiedFilter = () => {
    var filters_value = filters;
    // this making the filter inactive if it is active now
    // or making the filter active if it is inactive now
    if (activeVerfiedFilter) {
      setActiveVerifiedFilter(false);
      var result = filters_value.filter((item) => item.is_verified == false);
      handleFilter(result);
      setFilters(result);
    } else {
      setActiveVerifiedFilter(true);
      filters_value.push({ is_verified: true });
      handleFilter(filters_value);
      setFilters(filters_value);
    }
  };

  //for the filter "Unverified"
  const handleUnverfiedFilter = () => {
    var filters_value = filters;
    // this making the filter inactive if it is active now
    // or making the filter active if it is inactive now
    if (activeUnverfiedFilter) {
      setActiveUnverifiedFilter(false);
      var result = filters_value.filter((item) => item.is_verified == true);
      handleFilter(result);
      setFilters(result);
    } else {
      setActiveUnverifiedFilter(true);
      filters_value.push({ is_verified: false });
      handleFilter(filters_value);
      setFilters(filters_value);
    }
  };

  // *********************************************************************** //

  const handleAdd = () => {
    dispatch(AddClientResponseReset());
    return props.history.push("/user/client/add");
  };

  return (
    <div>
      <div class=" px-4 sm:px-8">
        <div class="flex">
          <div class="w-1/5">
            <p class="text-3xl my-3" style={{ textAlign: "left" }}>
              Clients
            </p>
          </div>
          <div class="w-3/5"></div>
          <div class="w-1/5 flex justify-end">
            <button class="focus:outline-none" onClick={() => handleAdd()}>
              <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">
                Add Clients
              </div>
            </button>
          </div>
        </div>
        <nav>
          <div class="">
            <div class="relative flex items-center justify-between h-16">
              <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div
                  class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"
                  onClick={() => handleVerfiedFilter()}
                >
                  <div
                    class={`rounded-full text-sm px-3 py-1 ${
                      activeVerfiedFilter ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    Verified
                  </div>
                </div>
                <div
                  class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"
                  onClick={() => handleUnverfiedFilter()}
                >
                  <div
                    class={`rounded-full text-sm px-3 py-1 ${
                      activeUnverfiedFilter ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    Unverfied
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
          {tableLoading ? (
            <div class="animate-pulse flex space-x-4">
              <div class="flex-1 space-y-4 py-1">
                <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                  <div class="min-w-full shadow rounded-lg overflow-hidden mt-3">
                    <table class="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Email
                          </th>

                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            User Since
                          </th>
                          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
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
              <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table class="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSorting("email")}
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Email
                      </th>

                      <th
                        onClick={() => handleSorting("user_since")}
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        user Since
                      </th>
                      <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((item, index) => {
                      return (
                        <tr>
                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div class="flex items-center">
                              <div class="flex-shrink-0 w-10 h-10">
                                <Link to={`/user/client/${item._id.$oid}`}>
                                  <img
                                    class="w-full h-full rounded-full"
                                    src={ProfilePicAvatar}
                                  />
                                </Link>
                              </div>
                              <Link to={`/user/client/${item._id.$oid}`}>
                                <div class="ml-3">
                                  {item.hasOwnProperty("name") ? (
                                    <p class="text-blue-700 whitespace-no-wrap">
                                      {item.name}
                                    </p>
                                  ) : (
                                    <p class="text-blue-700 whitespace-no-wrap">
                                      {item.email}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            </div>
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-gray-900 whitespace-no-wrap">
                              {item.createdDate}
                            </p>
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {item.is_verified ? (
                              <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">Verified</span>
                              </span>
                            ) : (
                              <span class="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                <span
                                  aria-hidden
                                  class="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                                ></span>
                                <span class="relative">Unverfied</span>
                              </span>
                            )}
                          </td>

                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-blue-700 whitespace-no-wrap">
                              <Link to={`/user/client/${item._id.$oid}`}>
                                Details{" "}
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

export default Clients;
