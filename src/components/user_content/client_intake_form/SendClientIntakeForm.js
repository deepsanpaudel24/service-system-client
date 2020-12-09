import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import _ from "lodash";
import { PulseLoader } from "react-spinners";
import ClientDetails from "../client_management/Client_details";
import Pagination from "../Pagination";
import { IntakeFormListStorageDispatcher, IntakeFormListStorageResponseReset } from "../../actions/form_generator/IntakeFormListStorage";


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

  // For sorting 
  const [sortingKey, setSortingKey] = useState(null)
  const [sortingValue, setSortingValue] = useState(null)
  // states for pagination
  const [totalRecords, setTotalRecords] = useState(0)
  const [page, setPage] = useState(1)
  // states for search 
  const [searchKeyword, setSearchKeyword] = useState("")
  // states for filters
  const [filters, setFilters] = useState([])

  const dispatch = useDispatch();
  const response = useSelector((state) => state.NewCaseRequestResponse);
  const response2 = useSelector((state) => state.IntakeFormListStorageResponse);

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
      url: '/api/v1/intake-form/list/'+ page,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config2)
    .then((res) => {
            setIntakeForms(res.data['forms'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var page = res.data['page']
            dispatch(IntakeFormListStorageDispatcher({[page]: res.data['forms'], 'total_records': res.data['total_records']}))
    })
    .catch((error) => {
        console.log(error.response)
    })
  }, []);

  useEffect(() => {}, [clientDetails]);

  const SortingRequest = (value) => {
    // send reset dispatch request to redux
    dispatch(IntakeFormListStorageResponseReset())
    setPage(1)
    setTableLoading(true)
    var defaultPage = 1
    const config = {
        method: 'post',
        url: '/api/v1/intake-form/list/'+ defaultPage,
        data: {
            "keyword": searchKeyword,
            "filters": filters,
            "sorting": value
        }
    }
    axios(config)
    .then((res) => {
        setIntakeForms(res.data['forms'])
        setTableLoading(false)
        setTotalRecords(res.data['total_records'])
        var reduxResponse = []
        var page = res.data['page']
        reduxResponse[page]= res.data['forms']
        reduxResponse['total_records'] = res.data['total_records']
        dispatch(IntakeFormListStorageDispatcher(reduxResponse))
    })
    .catch((error) => {
        console.log("response error of search", error.response)
    })
}

// For sorting
const handleSorting = (value) => {
    // check if sorting has value
    if (sortingKey == value){
        if(sortingValue == 1){
            // create var beacuse set state is async event
            var data = {
                "sortingKey": value,
                "sortingValue": -1
            }
            SortingRequest(data)
            // Desending
            setSortingKey(data['sortingKey'])
            setSortingValue(data['sortingValue'])
        }
        else{
            //neutral
            // create var beacuse set state is async event
            var data = {
                "sortingKey": "_id",
                "sortingValue": -1
            }
            SortingRequest(data)
            // Assending
            setSortingKey(data['sortingKey'])
            setSortingValue(data['sortingValue'])
        }
    }
    else {
        // create var beacuse set state is async event
        var data = {
            "sortingKey": value,
            "sortingValue": 1
        }
        SortingRequest(data)
        // Assending
        setSortingKey(data['sortingKey'])
        setSortingValue(data['sortingValue'])
    }
}


// For pagination Component
const handlePageChange = (value) => {
    setPage(value)
    const config = {
        method: 'post',
        url: '/api/v1/intake-form/list/'+ value,
        data: {
            "keyword": searchKeyword,
            "filters": filters,
            "sorting": {
                "sortingKey": sortingKey,
                "sortingValue": sortingValue
            }
        }
    }
    if(response2.data.hasOwnProperty(value)){
        var formList = response2.data[value]
        setIntakeForms(formList)
    }
    else {
        axios(config)
        .then((res) => {
            setIntakeForms(res.data['forms'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = response2.data
            var page = res.data['page']
            reduxResponse[page]= res.data['forms']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(IntakeFormListStorageDispatcher(reduxResponse))
        })
        .catch((error) => {
            console.log(error.response)
        })
    }
}

// For search bar action 
const handleSearch = (e) => {
    // send reset dispatch request to redux
    dispatch(IntakeFormListStorageResponseReset())
    setPage(1)
    setSearchKeyword(e.target.value)
    setTableLoading(true)
    var defaultPage = 1
    setSortingKey("")
    setSortingValue(null)
    const config = {
        method: 'post',
        url: '/api/v1/intake-form/list/'+ defaultPage,
        data: {
            "keyword": e.target.value,
            "filters": filters,
            "sorting": {
                "sortingKey": "",
                "sortingValue": ""
            }
        }
    }
    axios(config)
    .then((res) => {
        setIntakeForms(res.data['forms'])
        setTableLoading(false)
        setTotalRecords(res.data['total_records'])
        var reduxResponse = []
        var page = res.data['page']
        reduxResponse[page]= res.data['forms']
        reduxResponse['total_records'] = res.data['total_records']
        dispatch(IntakeFormListStorageDispatcher(reduxResponse))
    })
    .catch((error) => {
        console.log("response error of search", error.response)
    })
}

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
        <nav>
            <div class="">
                <div class="relative flex items-center justify-between h-16">
                    <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        
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
                        <th onClick={() => handleSorting("title")} class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Title
                        </th>
                        <th onClick={() => handleSorting("createdDate")} class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                <div>
                    <Pagination pageChanger={handlePageChange} totalRows={totalRecords} activePage={page}/>
                </div>
                </div>
            )}
            <div class="my-4">
                {showData()}
            </div>
            </div>
        </div>
    </div>
  );
};

export default SendIntakeForm;
