import React , {useState, useEffect, useLayoutEffect} from "react";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";

const ViewEmployees = (props) => {
    const [employees, setEmployees] = useState([])
    const [tableLoading, setTableLoading] = useState(true)

    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/user/employee/list',
          }
          axios(config)
          .then((res) => {
              console.log(res.data)
              setEmployees(res.data)
              setTableLoading(false)
          })
          .catch((error) => {
              console.log(error.response)
          })
      }, [])
  
      useEffect(() => {
          
      }, [employees])

    const handleAdd = () => {
        return (
          props.history.push("/user/add-employee")
        )
      }

    return (
        <div>
            <div class="container mx-auto px-4 sm:px-8">
                <div class="flex">
                    <div class="w-1/5"><p class="text-3xl my-3" style={{textAlign: "left"}}>Employees</p></div>
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
                                                Email
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Project
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Created
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
                                            employees.map((item, index) => {
                                                return(
                                                    <tr>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <div class="flex items-center">
                                                                <div class="flex-shrink-0 w-10 h-10">
                                                                    <img class="w-full h-full rounded-full"
                                                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                                                        alt="" />
                                                                </div>
                                                                <div class="ml-3">
                                                                    <p class="text-gray-900 whitespace-no-wrap">
                                                                        {item.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">Not assigned</p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                Jan 21, 2020
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {
                                                                item.is_verfied ?
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
                                                               <a href="#">View Details</a> 
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

export default ViewEmployees