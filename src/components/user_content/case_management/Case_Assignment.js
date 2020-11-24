import React, {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Link } from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import {CaseAssignmentDispatcher} from "../../actions/case_management/CaseAssignmentAction";
import Pagination from "../Pagination";
import { EmployeesListStorageDispatcher, EmployeesListStorageResponseReset } from "../../actions/employee_management/EmployeesListStorage";

const CaseAssignment = () => {
    const [employees, setEmployees] = useState([])
    const [tableLoading, setTableLoading] = useState(true)
    const [caseAssignmentList, setCaseAssignmentList] = useState([])
    const [buttonDisabled, setButtonDisabled] = useState(true)

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
    const [activeVerfiedFilter, setActiveVerifiedFilter] = useState(false)
    const [activeUnverfiedFilter, setActiveUnverifiedFilter] = useState(false)

    const dispatch = useDispatch()
    const response = useSelector(state => state.CaseAssignmentResponse)
    const response2 = useSelector(state => state.EmployeeListStorageResponse)

    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'get',
            url: '/api/v1/user/employee/list/'+ page,
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
          }
        if(response2.data.hasOwnProperty(1)){
            var empList = response2.data[1]
            setEmployees(empList)
            setTableLoading(false)
            setTotalRecords(response2.data['total_records'])
        }
        else {
            axios(config)
            .then((res) => {
                    setEmployees(res.data['employees'])
                    setTableLoading(false)
                    setTotalRecords(res.data['total_records'])
                    var page = res.data['page']
                    dispatch(EmployeesListStorageDispatcher({[page]: res.data['employees'], 'total_records': res.data['total_records']}))
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
        
        const config2 = {
            method: 'get',
            url: '/api/v1/case-sp/' + urlvalues[3],
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        } 
        axios(config2)
        .then((res) => {
            console.log(res.data['assigned_employee_list'])
            var array= []
            res.data['assigned_employee_list'].map((item, index) => {
                array.push(item.$oid)
            })
            setCaseAssignmentList(array)
        })
        .catch((error) => {
            console.log(error.response)
        })
      }, [])
  
    useEffect(() => {
        
    }, [employees])


    const SortingRequest = (value) => {
        // send reset dispatch request to redux
        dispatch(EmployeesListStorageResponseReset())
        setPage(1)
        setTableLoading(true)
        var defaultPage = 1
        const config = {
            method: 'post',
            url: '/api/v1/user/employee/list/'+ defaultPage,
            data: {
                "keyword": searchKeyword,
                "filters": filters,
                "sorting": value
            }
        }
        axios(config)
        .then((res) => {
            setEmployees(res.data['employees'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['employees']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(EmployeesListStorageDispatcher(reduxResponse))
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
            url: '/api/v1/user/employee/list/'+ value,
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
            var empList = response2.data[value]
            setEmployees(empList)
        }
        else {
            axios(config)
            .then((res) => {
                setEmployees(res.data['employees'])
                setTableLoading(false)
                setTotalRecords(res.data['total_records'])
                var reduxResponse = response2.data
                var page = res.data['page']
                reduxResponse[page]= res.data['employees']
                reduxResponse['total_records'] = res.data['total_records']
                dispatch(EmployeesListStorageDispatcher(reduxResponse))
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
    }

    // For search bar action 
    const handleSearch = (e) => {
        // send reset dispatch request to redux
        dispatch(EmployeesListStorageResponseReset())
        setPage(1)
        setSearchKeyword(e.target.value)
        setTableLoading(true)
        var defaultPage = 1
        setSortingKey("")
        setSortingValue(null)
        const config = {
            method: 'post',
            url: '/api/v1/user/employee/list/'+ defaultPage,
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
            setEmployees(res.data['employees'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['employees']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(EmployeesListStorageDispatcher(reduxResponse))
        })
        .catch((error) => {
            console.log("response error of search", error.response)
        })
    }

    // For filters 
    // have a funtion that makes the axios request and retrieve the filtered data 
    const handleFilter = (data) => {
        // send reset dispatch request to redux
        dispatch(EmployeesListStorageResponseReset())
        setPage(1)
        setTableLoading(true)
        setSortingKey("")
        setSortingValue(null)
        var defaultPage = 1
        const config = {
            method: 'post',
            url: '/api/v1/user/employee/list/'+ defaultPage,
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
            setEmployees(res.data['employees'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['employees']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(EmployeesListStorageDispatcher(reduxResponse))
        })
        .catch((error) => {
            console.log("response error of search", error.response)
        })
    }

    //for the filter "verified"
    const handleVerfiedFilter = () => {
        var filters_value = filters
        // this making the filter inactive if it is active now
        // or making the filter active if it is inactive now
        if(activeVerfiedFilter) {
            setActiveVerifiedFilter(false)
            var result = filters_value.filter(item => item.is_verified == false);
            handleFilter( result )
            setFilters( result )
        }
        else {
            setActiveVerifiedFilter(true)
            filters_value.push({"is_verified": true })
            handleFilter( filters_value )
            setFilters( filters_value )
        }
    }

    //for the filter "Unverified"
    const handleUnverfiedFilter = () => {
        var filters_value = filters
        // this making the filter inactive if it is active now
        // or making the filter active if it is inactive now
        if(activeUnverfiedFilter) {
            setActiveUnverifiedFilter(false)
            var result = filters_value.filter(item => item.is_verified == true);
            handleFilter( result )
            setFilters( result )
        }
        else {
            setActiveUnverifiedFilter(true)
            filters_value.push({"is_verified": false })
            handleFilter( filters_value )
            setFilters( filters_value )
        }
    }


    // *********************************************************************** //

    const handleCaseAssignment = (e, id) => {
        setButtonDisabled(false)
        if(e.target.checked){
            // add to the array i.e. caseAssignmentList
            setCaseAssignmentList([...caseAssignmentList, id])
        }
        else {
            // remove the employee with id == id from the caseAssignmentList
            var filteredEmployeeList = caseAssignmentList.filter((item) => item !== id);
            setCaseAssignmentList(filteredEmployeeList)
        }
    }

    const handleAssignCase = () => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        var data = {
            "assigned_employee_list": caseAssignmentList
        }
        dispatch(CaseAssignmentDispatcher(data, urlvalues[3]))
        setButtonDisabled(true)
    }

    const showData = () => {
        if(response.loading){
            return (
                <div class="">
                    <PulseLoader
                        size={10}
                        color={"#6DADE3"}
                        loading={true}
                    />
                </div>
            )
        }
        if(buttonDisabled) {
            return (
                <button class="bg-blue-600 text-white font-bold py-2 px-3 opacity-50 cursor-not-allowed">
                    Assign Case
                </button>
            )
        }
        return (
            <button class="bg-blue-600 text-white px-3 py-2 mb-2 foucs:outline-none" onClick={() => handleAssignCase()}>
                Assign Case
            </button>
        )
    }

    return(
        <div>
            <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                <nav>
                    <div class="">
                        <div class="relative flex items-center justify-between h-16">
                            <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div
                                    class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"  
                                    onClick={() => handleVerfiedFilter()}
                                >
                                    <div class={`rounded-full text-sm px-3 py-1 ${activeVerfiedFilter ? "bg-blue-500 text-white": ""}`}>
                                        Verified
                                    </div>
                                </div>
                                <div
                                    class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"  
                                    onClick={() => handleUnverfiedFilter()}
                                >
                                    <div class={`rounded-full text-sm px-3 py-1 ${activeUnverfiedFilter ? "bg-blue-500 text-white": ""}`}>
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
                <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table class="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th
                                    onClick={() => handleSorting("email")}
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th
                                    onClick={() => handleSorting("cases")}
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Total Cases
                                </th>
                                <th
                                    onClick={() => handleSorting("user_since")}
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    User Since
                                </th>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Role
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                employees.map((item, index) => {
                                    return(
                                        <tr>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div class="flex items-center">
                                                    <div class="mx-3">
                                                        <input class="mr-2 leading-tight" type="checkbox" onChange={e => handleCaseAssignment(e, item._id.$oid)} checked={ caseAssignmentList.includes(item._id.$oid) ? true : false}/>
                                                    </div>
                                                    <div class="flex-shrink-0 w-10 h-10">
                                                        <Link to={`/user/employee/${item._id.$oid}`}>
                                                            <img class="w-full h-full rounded-full"
                                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                                                alt="" />
                                                        </Link>
                                                    </div>
                                                    <div class="ml-3">
                                                        <Link to={`/user/employee/${item._id.$oid}`}>
                                                            {
                                                                item.hasOwnProperty("name") ?
                                                                    <p class="text-blue-700 whitespace-no-wrap">
                                                                        {item.name}
                                                                    </p>
                                                                :
                                                                    <p class="text-blue-700 whitespace-no-wrap">
                                                                        {item.email}
                                                                    </p>
                                                            }
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    0
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    {item.createdDate}
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {
                                                    item.collaborator ?
                                                    <span
                                                        class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                        <span aria-hidden
                                                            class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                        <span class="relative">Collaborator</span>
                                                    </span>
                                                    :
                                                    item.reviewer ?
                                                    <span
                                                        class="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                                        <span aria-hidden
                                                            class="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                                                        <span class="relative">Reviewer</span>
                                                    </span>
                                                    :
                                                    <p>-</p>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <nav>
                    <div class="">
                        <div class="relative flex items-center justify-between h-16">
                            <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                {showData()}
                            </div>
                            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <Pagination pageChanger={handlePageChange} totalRows={totalRecords} activePage={page}/>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default CaseAssignment