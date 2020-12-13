import React , {useState, useEffect, useLayoutEffect} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import _ from "lodash";
import { AddCustomTaskResponseReset } from "../../actions/custom_task/AddCustomTaskAction";
import { CustomTaskListStorageDispatcher, CustomTaskListStorageResponseReset } from "../../actions/custom_task/CustomTaskListStorage";
import Pagination from "../Pagination";

const Tasks = (props) => {
    const [tasks, setTasks] = useState([])
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

    const [showAddedAlert, setShowAddedAlert] = useState(false)

    const dispatch = useDispatch()
    const response2 = useSelector(state => state.CustomTaskListStorageResponse)
    const response = useSelector(state => state.AddCustomTaskResponse)
    
    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/tasks/'+ page,
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
          }
        if(!_.isEmpty(response.data)){
            dispatch(AddCustomTaskResponseReset())
            setShowAddedAlert(true)
            axios(config)
            .then((res) => {
                    setTasks(res.data['tasks'])
                    setTableLoading(false)
                    setTotalRecords(res.data['total_records'])
                    var page = res.data['page']
                    dispatch(CustomTaskListStorageDispatcher({[page]: res.data['tasks'], 'total_records': res.data['total_records']}))
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
        else if(response2.data.hasOwnProperty(1)){
            var taskList = response2.data[1]
            setTasks(taskList)
            setTableLoading(false)
            setTotalRecords(response2.data['total_records'])
        }
        else {
            axios(config)
            .then((res) => {
                    setTasks(res.data['tasks'])
                    setTableLoading(false)
                    setTotalRecords(res.data['total_records'])
                    var page = res.data['page']
                    dispatch(CustomTaskListStorageDispatcher({[page]: res.data['tasks'], 'total_records': res.data['total_records']}))
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
    }, [])
  
    useEffect(() => {
        
    }, [tasks])

    // For pagination Component
    const handlePageChange = (value) => {
        setPage(value)
        const config = {
            method: 'post',
            url: '/api/v1/tasks/'+ value,
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
            setTasks(serviceList)
        }
        else {
            axios(config)
            .then((res) => {
                setTasks(res.data['tasks'])
                setTableLoading(false)
                setTotalRecords(res.data['total_records'])
                var reduxResponse = response2.data
                var page = res.data['page']
                reduxResponse[page]= res.data['tasks']
                reduxResponse['total_records'] = res.data['total_records']
                dispatch(CustomTaskListStorageDispatcher(reduxResponse))
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
    }

    const SortingRequest = (value) => {
        // send reset dispatch request to redux
        dispatch(CustomTaskListStorageResponseReset())
        setPage(1)
        setTableLoading(true)
        var defaultPage = 1
        const config = {
            method: 'post',
            url: '/api/v1/tasks/'+ defaultPage,
            data: {
                "keyword": searchKeyword,
                "filters": filters,
                "sorting": value
            }
        }
        axios(config)
        .then((res) => {
            setTasks(res.data['tasks'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['tasks']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(CustomTaskListStorageDispatcher(reduxResponse))
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

    // For search bar action 
    const handleSearch = (e) => {
        // send reset dispatch request to redux
        dispatch(CustomTaskListStorageResponseReset())
        setPage(1)
        setSearchKeyword(e.target.value)
        setTableLoading(true)
        var defaultPage = 1
        setSortingKey("")
        setSortingValue(null)
        const config = {
            method: 'post',
            url: '/api/v1/tasks/'+ defaultPage,
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
            setTasks(res.data['tasks'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['tasks']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(CustomTaskListStorageDispatcher(reduxResponse))
        })
        .catch((error) => {
            console.log("response error of search", error.response)
        })
    }

    // For filters 
    // have a funtion that makes the axios request and retrieve the filtered data 
    const handleFilter = (data) => {
        // send reset dispatch request to redux
        dispatch(CustomTaskListStorageResponseReset())
        setPage(1)
        setTableLoading(true)
        setSortingKey("")
        setSortingValue(null)
        var defaultPage = 1
        const config = {
            method: 'post',
            url: '/api/v1/tasks/'+ defaultPage,
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
            setTasks(res.data['tasks'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['tasks']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(CustomTaskListStorageDispatcher(reduxResponse))
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

    const handleAdd = () => {
        dispatch(AddCustomTaskResponseReset())
        return (
          props.history.push("/user/create-task")
        )
    }

    return (
        <div>
            <div class="px-4">
                <div class="flex min-w-full">
                    <div class="w-1/5"><p class="text-3xl my-3" style={{textAlign: "left"}}>Tasks</p></div>
                    <div class="w-3/5"></div>
                    <div class="w-1/5 flex justify-end">
                        <button class="focus:outline-none" onClick={() => handleAdd()}>
                            <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">Add Task</div>
                        </button>
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
                {
                    showAddedAlert ?
                    <div
                        class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-4"
                        role="alert"
                    >
                        <p class="font-bold">Custom task added sucessfully</p>
                    </div>
                    :
                    "" 
                }
                <div class="py-8">
                    {
                        tableLoading ? 
                            <div class="animate-pulse flex space-x-4">
                                <div class="flex-1 space-y-4 py-1">
                                    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                                        <div class="min-w-full shadow rounded-lg overflow-hidden">
                                            <table class="min-w-full leading-normal">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Title
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Created On
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
                            <div class="min-w-full shadow rounded-lg overflow-hidden">
                                <table class="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                onClick={() => handleSorting("title")}
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th
                                                onClick={() => handleSorting("requestedDate")}
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Created On
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            tasks.map((item, index) => {
                                                return(
                                                    <tr>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm" style={{maxWidth: '14em'}}>
                                                            <div class="flex items-center">
                                                                <div class="ml-3">
                                                                    <Link to={`/user/tasks/${item._id.$oid}`}>
                                                                        <p class="text-blue-700">
                                                                            {item.title}
                                                                        </p>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {
                                                                item.status == "Requested" ?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-blue-300 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Requested</span>
                                                                </span>
                                                                :
                                                                item.status == "Forwarded" ?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-blue-300 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Forwarded</span>
                                                                </span>
                                                                :
                                                                item.status == "Proposal-Forwarded" ?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Proposal Forwarded</span>
                                                                </span>
                                                                :
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">On-progress</span>
                                                                </span>
                                                            }
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900">
                                                                {item.requestedDate}
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-blue-700 whitespace-no-wrap">
                                                               <Link to={`/user/tasks/${item._id.$oid}`}>View Details</Link> 
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

export default Tasks