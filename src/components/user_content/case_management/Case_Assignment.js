import React, {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Link } from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import {CaseAssignmentDispatcher} from "../../actions/case_management/CaseAssignmentAction"

const CaseAssignment = () => {
    const [employees, setEmployees] = useState([])
    const [caseAssignmentList, setCaseAssignmentList] = useState([])
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const dispatch = useDispatch()
    const response = useSelector(state => state.CaseAssignmentResponse)

    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'get',
            url: '/api/v1/user/employee/list',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        axios(config)
        .then((res) => {
            setEmployees(res.data)
        })
        .catch((error) => {
            console.log(error.response)
        })
        
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
                                    Total Cases
                                </th>
                                <th
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
                <div class="my-4">
                    {showData()}
                </div>
            </div>
        </div>
    )
}

export default CaseAssignment