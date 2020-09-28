import React , {useState, useEffect, useLayoutEffect} from "react";
import {Link} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";

const ViewCasesClient = (props) => {
    const [cases, setCases] = useState([])
    const [tableLoading, setTableLoading] = useState(true)
    
    useLayoutEffect(() => {
      const config = {
          method: 'get',
          url: '/api/v1/client-cases',
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
            <div class="container mx-auto px-4 sm:px-8">
                <div class="flex">
                    <div class="w-1/5"><p class="text-3xl my-3" style={{textAlign: "left"}}>Cases</p></div>
                    <div class="w-1/5"></div>
                    <div class="w-1/5"></div>
                    <div class="w-1/5"></div>
                    <div class="w-1/5">
                        <button class="focus:outline-none" onClick={() => handleAdd()}>
                            <div class="rounded-full h-16 w-16 flex items-center justify-center bg-white text-blue-500 shadow-md text-4xl hover:shadow-lg">+</div>
                        </button>
                    </div>
                </div>
                <div class="py-8">
                    {
                        tableLoading ? 
                            <div class="flex h-screen">
                                <div class="m-auto">
                                    <PulseLoader
                                        size={10}
                                        color={"#6DADE3"}
                                        loading={true}
                                    />
                                </div>
                            </div>
                        :
                        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                            <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                <table class="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Type
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
                                                                    <p class="text-gray-900">
                                                                        {item.title}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {
                                                                item.type == "law" ?
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-orange-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Law</span>
                                                                </span>
                                                                :
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">Account</span>
                                                                </span>
                                                            }
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {
                                                                item.fee == "" ? 
                                                                <p>- </p>
                                                                :
                                                                <p>${item.fee}</p>
                                                            }
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
                                                                <span
                                                                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                    <span aria-hidden
                                                                        class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                                    <span class="relative">On-progress</span>
                                                                </span>
                                                            }
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

export default ViewCasesClient