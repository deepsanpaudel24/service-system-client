import React , {useState, useEffect, useLayoutEffect} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import { Link } from "react-router-dom";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AddClientResponseReset } from "../../actions/client_management/AddClientAction";

const Clients = (props) => {
    const [clients, setClients] = useState([])
    const [tableLoading, setTableLoading] = useState(false)
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/service-providers/list',
          }
          axios(config)
          .then((res) => {
              setClients(res.data)
              setTableLoading(false)
          })
          .catch((error) => {
              console.log(error.response)
          })
      }, [])
  
    useEffect(() => {
        
    }, [clients])

    const handleAdd = () => {
        dispatch(AddClientResponseReset())
        return (
            props.history.push("/sadmin/people/add")
        )
    }

    return (
        <div>
            <div class=" px-4 sm:px-8">
                <div class="flex">
                    <div class="w-1/5"><p class="text-3xl my-3" style={{textAlign: "left"}}>Peoples</p></div>
                    <div class="w-3/5"></div>
                    <div class="w-1/5 flex justify-end">
                        <button class="focus:outline-none" onClick={() => handleAdd()}>
                            <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">Add Peoples</div>
                        </button>
                    </div>
                </div>
                <div class="py-8">
                    {
                        tableLoading ? 
                        <div class="animate-pulse flex space-x-4">
                        <div class="flex-1 space-y-4 py-1">
                            <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                                <div class="flex">
                                    <div class="w-3/5">
                                        <div
                                            class="text-sm inline-flex items-center font-bold leading-sm uppercase mt-4 mr-4 pr-3 bg-white border text-blue-700 rounded-full"
                                            style={{minWidth: "10em"}}
                                        >
                                            <div class="h-4 bg-gray-400 rounded w-3/4 ml-2"></div>
                                            <div class="space-y-2">
                                                <div class="h-4 bg-gray-400 rounded"></div>
                                                <div class="h-4 bg-gray-400 rounded w-5/6"></div>
                                            </div>
                                        </div>
                                        <div
                                            class="text-sm inline-flex items-center font-bold leading-sm uppercase mt-4 mr-4 pr-3 bg-white border text-blue-700 rounded-full"
                                            style={{minWidth: "10em"}}
                                        >
                                            <div class="h-4 bg-gray-400 rounded w-3/4 ml-2"></div>
                                            <div class="space-y-2">
                                                <div class="h-4 bg-gray-400 rounded"></div>
                                                <div class="h-4 bg-gray-400 rounded w-5/6"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-1/5">
                                    </div>
                                    <div class="w-1/5">
                                        <div class="relative mr-6 my-2">
                                            <div class="bg-purple-white focus:outline-none shadow rounded border-0 p-3">
                                                <div class="h-4 bg-gray-400 rounded w-3/4 ml-2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="min-w-full shadow rounded-lg overflow-hidden mt-3">
                                    <table class="min-w-full leading-normal">
                                        <thead>
                                            <tr>
                                                <th
                                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th
                                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th
                                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Total Cases
                                                </th>
                                                <th
                                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    User Since
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

                            
                            {/* Tags code , take from here */}
                            <div class="flex">
                                <div class="w-3/5">
                                    <div
                                        class="text-sm inline-flex items-center font-bold leading-sm uppercase mt-4 mr-4 pr-3 bg-white border text-blue-700 rounded-full"
                                    >
                                        <button class="rounded-full px-3 py-1 focus:outline-none focus:bg-blue-500 focus:text-white">
                                            Client Admins
                                        </button>
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            width="100%" height="100%" fill="none" 
                                            viewBox="0 0 24 24" stroke="currentColor" 
                                            stroke-width="2" stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            class="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-5 h-5 ml-2"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </div>
                                    <div
                                        class="text-sm inline-flex items-center font-bold leading-sm uppercase mt-4 mr-4 pr-3 bg-white border text-blue-700 rounded-full"
                                    >
                                        <button class="rounded-full px-3 py-1 focus:outline-none focus:bg-blue-500 focus:text-white">
                                            Client Employees
                                        </button>
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            width="100%" height="100%" fill="none" 
                                            viewBox="0 0 24 24" stroke="currentColor" 
                                            stroke-width="2" stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            class="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-5 h-5 ml-2"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </div>
                                    <div
                                        class="text-sm inline-flex items-center font-bold leading-sm uppercase mt-4 mr-4 pr-3 bg-white border text-blue-700 rounded-full"
                                    >
                                        <button class="rounded-full px-3 py-1 focus:outline-none focus:bg-blue-500 focus:text-white">
                                            Law Admins
                                        </button>
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            width="100%" height="100%" fill="none" 
                                            viewBox="0 0 24 24" stroke="currentColor" 
                                            stroke-width="2" stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            class="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-5 h-5 ml-2"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </div>
                                    <div
                                        class="text-sm inline-flex items-center font-bold leading-sm uppercase mt-4 mr-4 pr-3 bg-white border text-blue-700 rounded-full"
                                    >
                                        <button class="rounded-full px-3 py-1 focus:outline-none focus:bg-blue-500 focus:text-white">
                                            Law Employees
                                        </button>
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            width="100%" height="100%" fill="none" 
                                            viewBox="0 0 24 24" stroke="currentColor" 
                                            stroke-width="2" stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            class="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-5 h-5 ml-2"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </div>
                                    <div
                                        class="text-sm inline-flex items-center font-bold leading-sm uppercase mt-4 mr-4 pr-3 bg-white border text-blue-700 rounded-full"
                                    >
                                        <button class="rounded-full px-3 py-1 focus:outline-none focus:bg-blue-500 focus:text-white">
                                            Finance Admins
                                        </button>
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            width="100%" height="100%" fill="none" 
                                            viewBox="0 0 24 24" stroke="currentColor" 
                                            stroke-width="2" stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            class="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-5 h-5 ml-2"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </div>
                                    <div
                                        class="text-sm inline-flex items-center font-bold leading-sm uppercase mt-4 mr-4 pr-3 bg-white border text-blue-700 rounded-full"
                                    >
                                        <button class="rounded-full px-3 py-1 focus:outline-none focus:bg-blue-500 focus:text-white">
                                            Finance Employees
                                        </button>
                                        <svg xmlns="http://www.w3.org/2000/svg" 
                                            width="100%" height="100%" fill="none" 
                                            viewBox="0 0 24 24" stroke="currentColor" 
                                            stroke-width="2" stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            class="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-5 h-5 ml-2"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </div>
                                </div>
                                <div class="w-1/5">
                                </div>
                                <div class="w-1/5">
                                        {/* place the search bar here */}
                                </div>
                            </div>
                            {/* Tags code ends */}

                            <div class="inline-block min-w-full shadow rounded-lg overflow-hidden mt-4">
                                <table class="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Cases
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                user Since
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
                                            clients.map((item, index) => {
                                                return(
                                                    <tr>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <div class="flex items-center">
                                                                <div class="flex-shrink-0 w-10 h-10">
                                                                    <Link to={`/user/client/${item._id.$oid}`}>
                                                                        <img class="w-full h-full rounded-full"
                                                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                                                            alt="" />
                                                                    </Link>
                                                                </div>
                                                                <Link to={`/user/client/${item._id.$oid}`}>
                                                                    <div class="ml-3">
                                                                        <p class="text-blue-700 whitespace-no-wrap">
                                                                            {item.email}
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                3
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                {item.createdDate}
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {
                                                                item.is_verified ?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Verified</span>
                                                                </span>
                                                                :
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Unverfied</span>
                                                                </span>
                                                            }
                                                        </td>
                                                        
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-blue-700 whitespace-no-wrap">
                                                                <Link to={`/user/client/${item._id.$oid}`}>Details </Link></p>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default Clients