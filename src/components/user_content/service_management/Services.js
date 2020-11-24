import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import _ from "lodash";
import { AddServiceResponseReset } from "../../actions/service_management/AddServiceAction";
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { RemoveServiceDispatcher, RemoveServiceResponseReset } from "../../actions/service_management/RemoveServiceAction";
import { ServicesListStorageDispatcher, ServicesListStorageResponseReset } from "../../actions/service_management/ServicesListStorage";
import Pagination from "../Pagination";

const Services = (props) => {
    const [services, setServices] = useState([])
    const [tableLoading, setTableLoading] = useState(true)
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
    const [activeHourlyFilter, setActiveHourlyFilter] = useState(false)
    const [activeFlatFeeFilter, setActiveFlatFeeFilter] = useState(false)

    const dispatch = useDispatch()
    const response = useSelector(state => state.ServiceRemoveResponse)
    const response2 = useSelector(state => state.SerivceListStorageResponse)

    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/services/'+ page,
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
          }
        if(response2.data.hasOwnProperty(1)){
            var serviceList = response2.data[1]
            setServices(serviceList)
            setTableLoading(false)
            setTotalRecords(response2.data['total_records'])
        }
        else {
            axios(config)
            .then((res) => {
                    setServices(res.data['services'])
                    setTableLoading(false)
                    setTotalRecords(res.data['total_records'])
                    var page = res.data['page']
                    dispatch(ServicesListStorageDispatcher({[page]: res.data['services'], 'total_records': res.data['total_records']}))
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
    }, [])
  
    useEffect(() => {
        
    }, [services])

    const SortingRequest = (value) => {
        // send reset dispatch request to redux
        dispatch(ServicesListStorageResponseReset())
        setPage(1)
        setTableLoading(true)
        var defaultPage = 1
        const config = {
            method: 'post',
            url: '/api/v1/services/'+ defaultPage,
            data: {
                "keyword": searchKeyword,
                "filters": filters,
                "sorting": value
            }
        }
        axios(config)
        .then((res) => {
            setServices(res.data['services'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['services']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(ServicesListStorageDispatcher(reduxResponse))
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
            url: '/api/v1/services/'+ value,
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
            var serviceList = response2.data[value]
            setServices(serviceList)
        }
        else {
            axios(config)
            .then((res) => {
                setServices(res.data['services'])
                setTableLoading(false)
                setTotalRecords(res.data['total_records'])
                var reduxResponse = response2.data
                var page = res.data['page']
                reduxResponse[page]= res.data['services']
                reduxResponse['total_records'] = res.data['total_records']
                dispatch(ServicesListStorageDispatcher(reduxResponse))
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
    }

    // For search bar action 
    const handleSearch = (e) => {
        // send reset dispatch request to redux
        dispatch(ServicesListStorageResponseReset())
        setPage(1)
        setSearchKeyword(e.target.value)
        setTableLoading(true)
        var defaultPage = 1
        setSortingKey("")
        setSortingValue(null)
        const config = {
            method: 'post',
            url: '/api/v1/services/'+ defaultPage,
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
            setServices(res.data['services'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['services']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(ServicesListStorageDispatcher(reduxResponse))
        })
        .catch((error) => {
            console.log("response error of search", error.response)
        })
    }

    // For filters 
    // have a funtion that makes the axios request and retrieve the filtered data 
    const handleFilter = (data) => {
        // send reset dispatch request to redux
        dispatch(ServicesListStorageResponseReset())
        setPage(1)
        setTableLoading(true)
        setSortingKey("")
        setSortingValue(null)
        var defaultPage = 1
        const config = {
            method: 'post',
            url: '/api/v1/services/'+ defaultPage,
            data: {
                "keyword": searchKeyword,
                "filters": data,
                "sorting": {
                    "sortingKey": "",
                    "sortingValue": ""
                }
            }
        }
        axios(config)
        .then((res) => {
            setServices(res.data['services'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['services']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(ServicesListStorageDispatcher(reduxResponse))
        })
        .catch((error) => {
            console.log("response error of search", error.response)
        })
    }

    //for the filter "verified"
    const handleHourlyFilter = () => {
        var filters_value = filters
        // this making the filter inactive if it is active now
        // or making the filter active if it is inactive now
        if(activeHourlyFilter) {
            setActiveHourlyFilter(false)
            var result = filters_value.filter(item => item.rateType !== "hourly");
            handleFilter( result )
            setFilters( result )
        }
        else {
            setActiveHourlyFilter(true)
            filters_value.push({"rateType": "hourly" })
            handleFilter( filters_value )
            setFilters( filters_value )
        }
    }

    //for the filter "Unverified"
    const handleFlatFeeFilter = () => {
        var filters_value = filters
        // this making the filter inactive if it is active now
        // or making the filter active if it is inactive now
        if(activeFlatFeeFilter) {
            setActiveFlatFeeFilter(false)
            var result = filters_value.filter(item => item.rateType !== "flatFee");
            handleFilter( result )
            setFilters( result )
        }
        else {
            setActiveFlatFeeFilter(true)
            filters_value.push({"rateType": "flatFee" })
            handleFilter( filters_value )
            setFilters( filters_value )
        }
    }

    // *********************************************************************** //

    const handleConfirmDelete = (id) => {
        // dispatch action to delete the item with the id parameter
        dispatch(RemoveServiceDispatcher(id))
    }

    const showServerError = () => {
        if(!_.isEmpty(response.serverErrorMsg)){
            return (
                <div class="bg-red-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                    <p class="font-bold">Be Warned</p>
                    <p>{response.serverErrorMsg}</p>
                </div>
            )
        }
    }
  
    const confirmRemovedService = () => {
        if(!_.isEmpty(response.data)){
            const config = {
                method: 'get',
                url: '/api/v1/services',
                headers: { 
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                  }
              }
              axios(config)
              .then((res) => {
                  console.log(res.data)
                  setServices(res.data)
                  setTableLoading(false)
                  dispatch(RemoveServiceResponseReset())
              })
              .catch((error) => {
                  console.log(error.response)
              })
        }
    }

    const DeletePopUp = (title, id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg">
                    <h1 class="text-3xl text-red-600 px-4">Delete Service. Are you sure?</h1>
                    <hr class="border-gray-300 my-4" />
                    <div class= "px-4">
                        <div class="flex items-center bg-orange-100 text-black px-4 py-3 mb-3" role="alert">
                            <div class="flex">
                                <div class="py-1">
                                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                                </div>
                                <div>
                                    <p class="font-bold text-md text-gray-800">You are about to delete service.</p>
                                    <p class="text-sm text-gray-800">
                                        Once a service is permanently deleted, all the details of this service will be immediately removed from the system.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center text-black px-4 py-3 mb-3" role="alert">
                            <div>
                                <p class="text-sm text-gray-900">This action cannot be undone later. You will loose this service details. Please confirm the following action: </p>
                                <p class="inline-block bg-gray-100 text-black pr-3 py-1">Delete {title} </p>
                            </div>
                        </div>
                        <div class="flex justify-end mx-3">
                            <button 
                                onClick={onClose} 
                                class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleConfirmDelete(id);
                                    onClose();
                                }}
                                class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
                            >
                                Yes, Delete it!
                            </button>
                        </div>
                  </div>
                </div>
              )
            },
            title: 'Confirm to submit'
        })
    }

    const handleAdd = () => {
        dispatch(AddServiceResponseReset())
        return (
          props.history.push("/user/add-service")
        )
      }

    return (
        <div>
            <div class=" px-4 sm:px-8">
                <div class="flex">
                    <div class="w-1/5"><p class="text-3xl my-3" style={{textAlign: "left"}}>Services</p></div>
                    <div class="w-3/5"></div>
                    <div class="w-1/5 flex justify-end">
                        <button class="focus:outline-none" onClick={() => handleAdd()}>
                            <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">Add Services</div>
                        </button>
                    </div>
                </div>
                <nav>
                    <div class="">
                        <div class="relative flex items-center justify-between h-16">
                            <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div
                                    class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"  
                                    onClick={() => handleHourlyFilter()}
                                >
                                    <div class={`rounded-full text-sm px-3 py-1 ${activeHourlyFilter ? "bg-blue-500 text-white": ""}`}>
                                        Hourly
                                    </div>
                                </div>
                                <div
                                    class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"  
                                    onClick={() => handleFlatFeeFilter()}
                                >
                                    <div class={`rounded-full text-sm px-3 py-1 ${activeFlatFeeFilter ? "bg-blue-500 text-white": ""}`}>
                                        Flat fee
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
                <div class="py-8">
                    {showServerError()}
                    {confirmRemovedService()}
                    {
                        tableLoading ? 
                            <div class="animate-pulse flex space-x-4">
                                <div class="flex-1 space-y-4 py-1">
                                    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                                        <div class="min-w-full shadow rounded-lg overflow-hidden mt-3">
                                            <table class="min-w-full leading-normal">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            onClick={() => handleSorting("title")}
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Title
                                                        </th>
                                                        <th
                                                            onClick={() => handleSorting("rateType")}
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Rate
                                                        </th>
                                                        <th
                                                            onClick={() => handleSorting("averageTimeTaken")}
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Average Time Taken
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
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
                        :
                        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                            <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                <table class="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                onClick={() => handleSorting("title")}
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th
                                                onClick={() => handleSorting("rateType")}
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Rate
                                            </th>
                                            <th
                                                onClick={() => handleSorting("averageTimeTaken")}
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Average Time Taken
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            services.map((item, index) => {
                                                return(
                                                    <tr>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
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
                                                                ${item.rate} - {item.rateType}
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                {item.averageTimeTaken} hours
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {
                                                                item.status == "Active" ?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Active</span>
                                                                </span>
                                                                :
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Inactive</span>
                                                                </span>
                                                            }
                                                        </td>
                                                        
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-blue-700 whitespace-no-wrap">
                                                                <Link to={`/user/edit-service/${item._id.$oid}`}>Edit | </Link>
                                                                <button class="focus:outline-none" onClick={() => DeletePopUp(item.title, item._id.$oid)}>Delete</button>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <Pagination pageChanger={handlePageChange} totalRows={totalRecords} activePage={page}/>
                            </div>
                        </div>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default Services