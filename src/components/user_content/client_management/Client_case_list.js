import React , {useState, useEffect, useLayoutEffect} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import _ from "lodash";
import { CreateClientCaseResponseReset } from "../../actions/case_management/NewCaseRequestAction";

const ClientCases = (props) => {
    const [cases, setCases] = useState([])
    const [tableLoading, setTableLoading] = useState(true)
    const [newCaseRequestConfirm, setNewCaseRequestConfirm] = useState(false)

    const dispatch = useDispatch()
    const response = useSelector(state => state.CreateClientCaseResponse)

    const string = document.location.pathname;
    const urlvalues = string.toString().split("/");
    
    useLayoutEffect(() => {
        var string = document.location.pathname;
        var urlvalues = string.toString().split("/");

        const config = {
            method: 'get',
            url: '/api/v1/sp-client-cases/' + urlvalues[3],
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

        if(!_.isEmpty(response.data)){
            setNewCaseRequestConfirm(true)
            dispatch(CreateClientCaseResponseReset())
        }
    }, [])

    useEffect(() => {
        
    }, [cases])


    return (
        <div>
            <div>
            <div class="flex min-w-full">
                    <div class="w-1/5"></div>
                    <div class="w-3/5"></div>
                    <div class="w-1/5 flex justify-end">
                        <Link to={`/user/client/create-case/${urlvalues[3]}`} class="focus:outline-none">
                            <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">Add Case For Client</div>
                        </Link>
                    </div>
                </div>
                <div class="py-8">
                    { 
                        newCaseRequestConfirm ?
                        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                            <p class="font-bold">Successfully added new case for the client</p>
                        </div>
                        :
                        ""
                    }
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
                                                            Case Tags
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
                                                Case Tags
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
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm" style={{maxWidth: '15em', minWidth: '22em'}}>
                                                            <div class="flex items-center">
                                                                <div class="ml-3">
                                                                    <p class="text-blue-700 ">
                                                                    <Link to={`/user/case/${item._id.$oid}`}>{item.title}</Link>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm" style={{maxWidth: '12em'}}>
                                                            {
                                                                item.status == "Requested" ?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-gray-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-gray-300 opacity-50 rounded-full"></span>
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
                                                                    class="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-blue-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Proposal Received</span>
                                                                </span>
                                                                :
                                                                item.status == "Contract-Waiting" ? 
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-indigo-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-indigo-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Waiting Contract Paper</span>
                                                                </span>
                                                                :
                                                                item.status == "Contract-Sent" ?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-indigo-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-indigo-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Contract Paper Received</span>
                                                                </span>
                                                                :
                                                                item.status == "Contract-Replied" ?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-indigo-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-indigo-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Signed Contract Paper Sent</span>
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
                                                            <div class="flex"> 
                                                                {item.caseTags.map((item, index) => 
                                                                    index > 1 ? 
                                                                        "" 
                                                                        :
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
                                                                }
                                                            </div>
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

export default ClientCases