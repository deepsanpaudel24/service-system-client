import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import _ from "lodash";
import { Link } from "react-router-dom";
import EmpAvatar from "../../../images/emp_avatar.jpg";
import { AddPeopleResponseReset } from "../../actions/people_mangement/AddPeople";

const PeopleDetails = (props) => {
    const [peopleDetails, setPeopleDetails] = useState([])
    const [peopleDetailsLoading, setPeopleDetailsLoading] = useState(true)
    const [services, setServices] = useState([])
    const [activeTab, setActiveTab] = useState("cases")
    const dispatch = useDispatch()
    const response = useSelector(state => state.addEmployeeResponse)

    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')

        const config = {
            method: 'get',
            url: '/api/v1/peoples/' + urlvalues[3],
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
          }
        axios(config)
        .then((res) => {
            setPeopleDetails(res.data)
            setPeopleDetailsLoading(false)
        })
        .catch((error) => {
            console.log(error.response)
        })
        
        const config2 = {
            method: 'get',
            url: '/api/v1/services/' + urlvalues[3],
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
          }
        axios(config2)
        .then((res2) => {
            setServices(res2.data)
        })
        .catch((error2) => {
            console.log(error2.response)
        })
      }, [])
  
    useEffect(() => {
        
    }, [peopleDetails])

    const activeCasetab = () => {
        setActiveTab("cases")
    }

    const activeServicetab = () => {
        setActiveTab("services")
    }

    const handleAdd = () => {
        dispatch(AddPeopleResponseReset())
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        return (
          props.history.push("/sadmin/employee/roles/"+ urlvalues[3])
        )
      }

    return (
        <div>
            <div class="px-4 sm:px-8">
                {
                    peopleDetailsLoading ? 
                    <div class="animate-pulse flex space-x-4">
                        <div class="w-4/5">
                            <div class="flex"> 
                                <img style={{height: '7em'}} class="rounded-full" src={EmpAvatar} alt="" />
                            </div>
                        </div>
                        <div class="w-1/5 flex justify-end">
                            <button class="focus:outline-none" onClick={() => handleAdd()}>
                                <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">Manage Roles</div>
                            </button>
                        </div>
                    </div>
                    :
                    <div class="flex">
                        <div class="w-4/5">
                            <div class="flex"> 
                                <img style={{height: '7em'}} class="rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80" alt="" />
                                <div class="ml-5 y-5" style={{marginTop: "1.5em", marginLeft: "2em"}}>
                                    <h1 class="text-2xl font-bold">
                                        {_.isEmpty(peopleDetails.name)? "-": peopleDetails.name}
                                    </h1>
                                    <h1 class="text-1xl my-1">{_.isEmpty(peopleDetails.email)? "-": peopleDetails.email}</h1>
                                    <p class="flex mt-8 text-base text-gray-600">
                                        TOTAL CASES <p class="ml-3 mr-10 text-base text-black">3</p>
                                        USER SINCE<p class="ml-3 mr-10 text-base text-black">{_.isEmpty(peopleDetails.createdDate)? "-": peopleDetails.createdDate}</p>
                                        STATUS {peopleDetails.is_verified ? <p class="ml-3 text-base text-green-600">ACTIVE</p> : <p class="ml-3 text-base text-red-600">UNVERIFIED</p>} 
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="w-1/5 flex justify-end">
                            <button class="focus:outline-none" onClick={() => handleAdd()}>
                                <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">Manage Roles</div>
                            </button>
                        </div>
                    </div>
                }
                <div class="pt-8 pb-5">
                    {
                        peopleDetails.user_type == "SPCA" || peopleDetails.user_type == "SPS" ?
                            activeTab == "cases" ? 
                                <ul class="flex border-b">
                                    <li class="-mb-px mr-1">
                                        <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeCasetab()}>Cases</button>
                                    </li>
                                    <li class="mr-1">
                                        <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeServicetab()}>Services</button>
                                    </li>
                                </ul>
                            :
                                <ul class="flex border-b">
                                    <li class="mr-1">
                                        <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeCasetab()}>Cases</button>
                                    </li>
                                    <li class="-mb-px mr-1">
                                        <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeServicetab()}>Services</button>
                                    </li>
                                </ul>
                        :
                            <ul class="flex border-b">
                                <li class="-mb-px mr-1">
                                    <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeCasetab()}>Cases</button>
                                </li>
                            </ul>
                    }
                </div>
                {
                    activeTab == "cases" ? 
                    // Cases div opens here
                    <div>
                    {
                        peopleDetailsLoading ? 
                            <div class="animate-pulse flex space-x-4">
                                <div class="flex-1 space-y-4 py-1">
                                    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                                        <div class="min-w-full shadow rounded-lg overflow-hidden mt-3">
                                            <table class="min-w-full leading-normal">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Cases
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Client
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Role
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Assigned on
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Time spent
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
                            <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                <table class="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Cases
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Client
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Assigned on
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Time spent
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="px-2 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div class="flex items-center">
                                                    <div class="ml-3">
                                                        <Link to="/user/employee/details">
                                                            <p class="text-blue-700 whitespace-no-wrap">
                                                                Case title here
                                                            </p>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    Hari prasad
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    ongoing
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <span
                                                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                    <span aria-hidden
                                                        class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                    <span class="relative">Collaborator</span>
                                                </span>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    2020-09-10
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    3 hrs 23 mins
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-blue-700 whitespace-no-wrap">
                                                    <a href="#">Details | </a>
                                                    <button class="focus:outline-none" >Delete</button>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        }
                    </div>
                    // cases div closes here
                    :
                    // Services div opens here
                    <div>
                    {
                        peopleDetailsLoading ? 
                            <div class="animate-pulse flex space-x-4">
                                <div class="flex-1 space-y-4 py-1">
                                    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                                        <div class="min-w-full shadow rounded-lg overflow-hidden mt-3">
                                            <table class="min-w-full leading-normal">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Title
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Rate
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Average Time Taken
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Created on
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Commission rate
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
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Titile
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Rate
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Average Time
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Created on
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Commission Rate
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            services.map((item, index) => {
                                                return(
                                                    <tr>
                                                        <td class="px-2 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <div class="flex items-center">
                                                                <div class="ml-3">
                                                                    <Link to="/user/employee/details">
                                                                        <p class="text-blue-700 whitespace-no-wrap">
                                                                            {item.title}
                                                                        </p>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                {item.rate} / {item.rateType}
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                40 Hours
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <span
                                                                class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                <span aria-hidden
                                                                    class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                                <span class="relative">Active</span>
                                                            </span>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                2020-09-10
                                                            </p>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-blue-700 whitespace-no-wrap">
                                                                <a href="#">5% | </a>
                                                                <button class="focus:outline-none" >Edit</button>
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
                    // services div closes here
                }
            </div>
        </div>
    )
}

export default PeopleDetails