import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import _ from "lodash";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ServicesListStorageDispatcher, ServicesListStorageResponseReset } from "../../actions/service_management/ServicesListStorage";
import Pagination from "../Pagination";
import { CaseListStorageDispatcher, CaseListStorageResponseReset } from "../../actions/case_management/CaseTimersListStorage";

const CaseTimers = (props) => {
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
    const [activeBillableFilter, setactiveBillableFilter] = useState(false)
    const [activeNonBillableFilter, setactiveNonBillableFilter] = useState(false)

    const dispatch = useDispatch()
    const response = useSelector(state => state.ServiceRemoveResponse)
    const response2 = useSelector(state => state.SerivceListStorageResponse)

    useLayoutEffect(() => {
        dispatch(CaseListStorageResponseReset())
        var string = document.location.pathname;
        var urlvalues = string.toString().split("/");
        
        const config = {
            method: 'get',
            url: '/api/v1/case-timers/'+ page + '/' + urlvalues[3],
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
                    setServices(res.data['timers'])
                    setTableLoading(false)
                    setTotalRecords(res.data['total_records'])
                    var page = res.data['page']
                    dispatch(CaseListStorageDispatcher({[page]: res.data['timers'], 'total_records': res.data['total_records']}))
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
    }, [])
  
    useEffect(() => {
        
    }, [services])

    const SortingRequest = (value) => {
        var string = document.location.pathname;
        var urlvalues = string.toString().split("/");
        // send reset dispatch request to redux
        dispatch(CaseListStorageResponseReset())
        setPage(1)
        setTableLoading(true)
        var defaultPage = 1
        const config = {
            method: 'post',
            url: '/api/v1/case-timers/'+ defaultPage + '/' + urlvalues[3],
            data: {
                "keyword": searchKeyword,
                "filters": filters,
                "sorting": value
            }
        }
        axios(config)
        .then((res) => {
            setServices(res.data['timers'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['timers']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(CaseListStorageDispatcher(reduxResponse))
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
        var string = document.location.pathname;
        var urlvalues = string.toString().split("/");
        setPage(value)
        const config = {
            method: 'post',
            url: '/api/v1/case-timers/'+ value + '/' + urlvalues[3],
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
                setServices(res.data['timers'])
                setTableLoading(false)
                setTotalRecords(res.data['total_records'])
                var reduxResponse = response2.data
                var page = res.data['page']
                reduxResponse[page]= res.data['timers']
                reduxResponse['total_records'] = res.data['total_records']
                dispatch(CaseListStorageDispatcher(reduxResponse))
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
    }

    // For search bar action 
    const handleSearch = (e) => {
        var string = document.location.pathname;
        var urlvalues = string.toString().split("/");
        // send reset dispatch request to redux
        dispatch(CaseListStorageResponseReset())
        setPage(1)
        setSearchKeyword(e.target.value)
        setTableLoading(true)
        var defaultPage = 1
        setSortingKey("")
        setSortingValue(null)
        const config = {
            method: 'post',
            url: '/api/v1/case-timers/'+ defaultPage + '/' + urlvalues[3],
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
            setServices(res.data['timers'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['timers']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(CaseListStorageDispatcher(reduxResponse))
        })
        .catch((error) => {
            console.log("response error of search", error.response)
        })
    }

    // For filters 
    // have a funtion that makes the axios request and retrieve the filtered data 
    const handleFilter = (data) => {
        var string = document.location.pathname;
        var urlvalues = string.toString().split("/");
        // send reset dispatch request to redux
        dispatch(CaseListStorageResponseReset())
        setPage(1)
        setTableLoading(true)
        setSortingKey("")
        setSortingValue(null)
        var defaultPage = 1
        const config = {
            method: 'post',
            url: '/api/v1/case-timers/'+ defaultPage + '/' + urlvalues[3],
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
            setServices(res.data['timers'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['timers']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(CaseListStorageDispatcher(reduxResponse))
        })
        .catch((error) => {
            console.log("response error of search", error.response)
        })
    }

    //for the filter "billable"
    const handleBillableFilter = () => {
        var filters_value = filters
        // this making the filter inactive if it is active now
        // or making the filter active if it is inactive now
        if(activeBillableFilter) {
            setactiveBillableFilter(false)
            var result = filters_value.filter(item => item.billable !== true);
            handleFilter( result )
            setFilters( result )
        }
        else {
            setactiveBillableFilter(true)
            filters_value.push({"billable": true })
            handleFilter( filters_value )
            setFilters( filters_value )
        }
    }

    //for the filter "Nonbillable"
    const handleNonBillableFilter = () => {
        var filters_value = filters
        // this making the filter inactive if it is active now
        // or making the filter active if it is inactive now
        if(activeNonBillableFilter) {
            setactiveNonBillableFilter(false)
            var result = filters_value.filter(item => item.billable !== false);
            handleFilter( result )
            setFilters( result )
        }
        else {
            setactiveNonBillableFilter(true)
            filters_value.push({"billable": false })
            handleFilter( filters_value )
            setFilters( filters_value )
        }
    }

    // *********************************************************************** //


    return (
        <div>
            <div class=" px-4 sm:px-8">
                <nav>
                    <div class="">
                        <div class="relative flex items-center justify-between h-16">
                            <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div
                                    class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"  
                                    onClick={() => handleBillableFilter()}
                                >
                                    <div class={`rounded-full text-sm px-3 py-1 ${activeBillableFilter ? "bg-blue-500 text-white": ""}`}>
                                        Billable
                                    </div>
                                </div>
                                <div
                                    class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"  
                                    onClick={() => handleNonBillableFilter()}
                                >
                                    <div class={`rounded-full text-sm px-3 py-1 ${activeNonBillableFilter ? "bg-blue-500 text-white": ""}`}>
                                        Non Billable
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
                                                            onClick={() => handleSorting("humanize_starting_time")}
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Starting Time
                                                        </th>
                                                        <th
                                                            onClick={() => handleSorting("humanize_stopping_time")}
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Stopping Time
                                                        </th>
                                                        <th
                                                            onClick={() => handleSorting("Timervalue")}
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                           Total Time Worked
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Worked By
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
                                                onClick={() => handleSorting("humanize_starting_time")}
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Starting Time
                                            </th>
                                            <th
                                                onClick={() => handleSorting("humanize_stopping_time")}
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Stopping Time
                                            </th>
                                            <th
                                                onClick={() => handleSorting("Timervalue")}
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Total time worked
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th
                                                onClick={() => handleSorting("workByName")}
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Worked By
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
                                                                        {item.humanize_starting_time}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                {item.humanize_stopping_time}
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                {item.humanize_timerValue}
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {
                                                                item.billable?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Billable</span>
                                                                </span>
                                                                :
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Non-billable</span>
                                                                </span>
                                                            }
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                {item.workByName}
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
                                <Pagination pageChanger={handlePageChange} totalRows={totalRecords} activePage={page} class="z-50"/>
                            </div>
                        </div>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default CaseTimers