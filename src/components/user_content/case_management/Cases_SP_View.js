import React , {useState, useEffect, useLayoutEffect} from "react";
import {Link} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";

const ViewCasesSP = (props) => {
    const [cases, setCases] = useState([])
    const [tableLoading, setTableLoading] = useState(true)
    
    useLayoutEffect(() => {
      const config = {
          method: 'get',
          url: '/api/v1/cases-sp',
          headers: { 
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
          }
        }
        axios(config)
        .then((res) => {
            setCases(res.data)
            setTableLoading(false)
        })
        .catch((error) => {
            setTableLoading(false)
        })
    }, [])

    useEffect(() => {
        
    }, [cases])

    const handleAdd = () => {
        return (
          props.history.push("/user/create-case-request")
        )
      }

    return (
        <div>
            <div class="px-4 sm:px-8">
                <div class="flex">
                    <div class="w-1/5"><p class="text-3xl my-3" style={{textAlign: "left"}}>Cases</p></div>
                </div>
                <div class="py-4">
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
                                                            Fee
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Requested On
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
                            <div class="flex">
                                <div class="w-3/5">
                                    <div
                                        class="text-xs inline-flex items-center font-bold leading-sm uppercase mt-4 mr-4 bg-white border text-blue-700 rounded-full"
                                    >
                                        <button class="rounded-full text-sm px-3 py-1 focus:outline-none focus:bg-blue-500 focus:text-white">
                                            Forwarded
                                        </button>
                                    </div>
                                    <div
                                        class="text-xs inline-flex items-center font-bold leading-sm uppercase mt-4 mr-4 bg-white border text-blue-700 rounded-full"
                                    >
                                        <button class="rounded-full text-sm px-3 py-1 focus:outline-none focus:bg-blue-500 focus:text-white">
                                            On-progress
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="inline-block min-w-full shadow rounded-lg overflow-hidden mt-4">
                                <table class="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Fee
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Requested On
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            cases.map((item, index) => {
                                                return(
                                                    <tr>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm" style={{maxWidth: '14em'}}>
                                                            <div class="flex items-center">
                                                                <div class="ml-3">
                                                                    <p class="text-gray-900 ">
                                                                        {item.title}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                {
                                                                    item.fee ? 
                                                                    <p>${item.fee}</p>
                                                                    :
                                                                    <p> - </p>
                                                                }
                                                            </p>
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
                                                                    <span class="relative">Received</span>
                                                                </span>
                                                                :
                                                                item.status == "Proposal-Forwarded" ?
                                                                    item.proposalStatus && item.proposalStatus == "Declined" ?
                                                                        <span
                                                                            class="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                                                            <span aria-hidden
                                                                                class="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                                                                            <span class="relative">Proposal Declined</span>
                                                                        </span>
                                                                     :
                                                                     <span
                                                                        class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                        <span aria-hidden
                                                                            class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                                        <span class="relative">Proposal Forwarded</span>
                                                                    </span>
                                                                :
                                                                item.status == "On-progress" ?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">On-progress</span>
                                                                </span>
                                                                :
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Proposal Declined</span>
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
                                                               <Link to={`/user/case/${item._id.$oid}`}>View Details</Link> 
                                                            </p>
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

export default ViewCasesSP