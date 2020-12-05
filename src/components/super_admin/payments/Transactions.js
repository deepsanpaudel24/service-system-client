import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import _, { filter } from "lodash";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { TransactionsListStorageDispatcher, TransactionsListStorageResponseReset } from "../../actions/payment_module/TransactionsListStorage";
import Pagination from "../Pagination";

const SATransactions = (props) => {
    const [transactions, setTransactions] = useState([])
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
    const [activeVerfiedFilter, setActiveVerifiedFilter] = useState(false)
    const [activeUnverfiedFilter, setActiveUnverifiedFilter] = useState(false)
    const [activeReceivedFilter, setActiveReceivedFilter] = useState(false)
    const [activeSentFilter, setActiveSentFilter] = useState(false)

    const dispatch = useDispatch()
    const response2 = useSelector(state => state.TransactionsCaseListResponse)

    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/sa-transactions/'+ page,
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
          }
        if(response2.data.hasOwnProperty(1)){
            var empList = response2.data[1]
            setTransactions(empList)
            setTableLoading(false)
            setTotalRecords(response2.data['total_records'])
        }
        else {
            axios(config)
            .then((res) => {
                    setTransactions(res.data['transactions'])
                    setTableLoading(false)
                    setTotalRecords(res.data['total_records'])
                    var page = res.data['page']
                    dispatch(TransactionsListStorageDispatcher({[page]: res.data['transactions'], 'total_records': res.data['total_records']}))
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
      }, [])
  
    useEffect(() => {
        
    }, [transactions])

    const SortingRequest = (value) => {
        // send reset dispatch request to redux
        dispatch(TransactionsListStorageResponseReset())
        setPage(1)
        setTableLoading(true)
        var defaultPage = 1
        const config = {
            method: 'post',
            url: '/api/v1/sa-transactions/'+ defaultPage,
            data: {
                "keyword": searchKeyword,
                "filters": filters,
                "sorting": value
            }
        }
        axios(config)
        .then((res) => {
            setTransactions(res.data['transactions'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['transactions']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(TransactionsListStorageDispatcher(reduxResponse))
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
            url: '/api/v1/sa-transactions/'+ value,
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
            setTransactions(empList)
        }
        else {
            axios(config)
            .then((res) => {
                setTransactions(res.data['transactions'])
                setTableLoading(false)
                setTotalRecords(res.data['total_records'])
                var reduxResponse = response2.data
                var page = res.data['page']
                reduxResponse[page]= res.data['transactions']
                reduxResponse['total_records'] = res.data['total_records']
                dispatch(TransactionsListStorageDispatcher(reduxResponse))
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
    }
    
    const regex = /^\.com$/;
    // For search bar action 
    const handleSearch = (e) => {
        var search_keyword;
        if (!regex.test(e.target.value)) {
            setSearchKeyword(e.target.value);
            search_keyword = e.target.value
        } 
        else {
            setSearchKeyword("");
            search_keyword = ""
        }
        // send reset dispatch request to redux
        dispatch(TransactionsListStorageResponseReset())
        setPage(1)
        setSearchKeyword(e.target.value)
        setTableLoading(true)
        var defaultPage = 1
        setSortingKey("")
        setSortingValue(null)
        const config = {
            method: 'post',
            url: '/api/v1/sa-transactions/'+ defaultPage,
            data: {
                "keyword": search_keyword,
                "filters": filters,
                "sorting": {
                    "sortingKey": "",
                    "sortingValue": ""
                }
            }
        }
        axios(config)
        .then((res) => {
            setTransactions(res.data['transactions'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['transactions']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(TransactionsListStorageDispatcher(reduxResponse))
        })
        .catch((error) => {
            console.log("response error of search", error.response)
        })
    }

    // For filters 
    // have a funtion that makes the axios request and retrieve the filtered data 
    const handleFilter = (data) => {
        // send reset dispatch request to redux
        dispatch(TransactionsListStorageResponseReset())
        setPage(1)
        setTableLoading(true)
        setSortingKey("")
        setSortingValue(null)
        var defaultPage = 1
        const config = {
            method: 'post',
            url: '/api/v1/sa-transactions/'+ defaultPage,
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
            setTransactions(res.data['transactions'])
            setTableLoading(false)
            setTotalRecords(res.data['total_records'])
            var reduxResponse = []
            var page = res.data['page']
            reduxResponse[page]= res.data['transactions']
            reduxResponse['total_records'] = res.data['total_records']
            dispatch(TransactionsListStorageDispatcher(reduxResponse))
        })
        .catch((error) => {
            console.log("response error of search", error.response)
        })
    }

    //for the filter "cases"
    const handleCasesFilter = () => {
        var filters_value = filters
        if(activeVerfiedFilter) {
            setActiveVerifiedFilter(false)
            var result = filters_value.filter(item => item.mode !== "payment");
            handleFilter( result )
            setFilters( result )
        }
        else {
            setActiveVerifiedFilter(true)
            filters_value.push({"mode": "payment" })
            handleFilter( filters_value )
            setFilters( filters_value )
        }
    }

    //for the filter "subscrtiption"
    const handleSubscriptionFilter = () => {
        var filters_value = filters
        if(activeUnverfiedFilter) {
            setActiveUnverifiedFilter(false)
            var result = filters_value.filter(item => item.mode !== "subscription");
            handleFilter( result )
            setFilters( result )
        }
        else {
            setActiveUnverifiedFilter(true)
            filters_value.push({"mode": "subscription" })
            handleFilter( filters_value )
            setFilters( filters_value )
        }
    }

    //for the filter "Received"
    const handleReceivedFilter = () => {
        var filters_value = filters
        if(activeReceivedFilter) {
            setActiveReceivedFilter(false)
            var result = filters_value.filter(item => item.received !== true);
            handleFilter( result )
            setFilters( result )
        }
        else {
            setActiveReceivedFilter(true)
            filters_value.push({"received": true })
            handleFilter( filters_value )
            setFilters( filters_value )
        }
    }

    //for the filter "Sent"
    const handleSentFilter = () => {
        var filters_value = filters
        if(activeSentFilter) {
            setActiveSentFilter(false)
            var result = filters_value.filter(item => item.received !== false);
            handleFilter( result )
            setFilters( result )
        }
        else {
            setActiveSentFilter(true)
            filters_value.push({"received": false })
            handleFilter( filters_value )
            setFilters( filters_value )
        }
    }


    // *********************************************************************** //



    return (
        <div>
            <div class=" px-4 sm:px-8">
                <div class="flex">
                    <div class="w-1/5"><p class="text-3xl my-3" style={{textAlign: "left"}}>Transactions</p></div>
                    <div class="w-3/5"></div>
                    <div class="w-1/5"></div>
                </div>
                <nav>
                    <div class="">
                        <div class="relative flex items-center justify-between h-16">
                            <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div
                                    class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"  
                                    onClick={() => handleCasesFilter()}
                                >
                                    <div class={`rounded-full text-sm px-3 py-1 ${activeVerfiedFilter ? "bg-blue-500 text-white": ""}`}>
                                        Case
                                    </div>
                                </div>
                                <div
                                    class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"  
                                    onClick={() => handleSubscriptionFilter()}
                                >
                                    <div class={`rounded-full text-sm px-3 py-1 ${activeUnverfiedFilter ? "bg-blue-500 text-white": ""}`}>
                                        Subscription
                                    </div>
                                </div>
                                <div
                                    class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"  
                                    onClick={() => handleReceivedFilter()}
                                >
                                    <div class={`rounded-full text-sm px-3 py-1 ${activeReceivedFilter ? "bg-blue-500 text-white": ""}`}>
                                        Received
                                    </div>
                                </div>
                                <div
                                    class="flex text-xs inline-flex items-center leading-sm mt-4 mr-4 bg-white border text-blue-700 rounded-full cursor-pointer"  
                                    onClick={() => handleSentFilter()}
                                >
                                    <div class={`rounded-full text-sm px-3 py-1 ${activeSentFilter ? "bg-blue-500 text-white": ""}`}>
                                        Sent
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
                <div class="py-3">
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
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                            onClick={() => handleSorting("email")}
                                                        >
                                                            Date
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                            onClick={() => handleSorting("total_cases")}
                                                        >
                                                            Paid For
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                            onClick={() => handleSorting("createdDate")}
                                                        >
                                                            Amount
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                            onClick={() => handleSorting("received")}
                                                        >
                                                            Payment
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Status
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
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                onClick={() => handleSorting("date")}
                                            >
                                                Date
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                            >
                                                Paid For
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                onClick={() => handleSorting("amount")}
                                            >
                                                Amount
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                onClick={() => handleSorting("received")}
                                            >
                                                Payment
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            transactions.map((item, index) => {
                                                return(
                                                    <tr>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                {item.payment_date}
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                {
                                                                    item.mode == "subscription" ? 
                                                                    <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-orange-200 opacity-50 rounded-full"></span>
                                                                        <span class="relative">Subscription</span>
                                                                    </span>
                                                                    :
                                                                    <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-blue-200 opacity-50 rounded-full"></span>
                                                                        <span class="relative">Case</span>
                                                                    </span>
                                                                }
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                {item.paid_amount} / {item.currency}
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                {
                                                                    item.received ? 
                                                                    <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-teal-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-teal-200 opacity-50 rounded-full"></span>
                                                                        <span class="relative">Received</span>
                                                                    </span>
                                                                    :
                                                                    <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-indigo-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-indigo-200 opacity-50 rounded-full"></span>
                                                                        <span class="relative">Sent</span>
                                                                    </span>
                                                                }
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {
                                                                item.status == "completed" ?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Completed</span>
                                                                </span>
                                                                :
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-blue-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Pending</span>
                                                                </span>
                                                            }
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

export default SATransactions