import React , {useState, useEffect, useLayoutEffect} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {AddPeopleResponseReset} from "../../actions/people_mangement/AddPeople"
import { DeactivatePeopleDispatcher, DeactivatePeopleResponseReset } from "../../actions/people_mangement/DeactivatePeopleAction";

const Peoples = (props) => {
    const [peoples, setPeoples] = useState([])
    const [tableLoading, setTableLoading] = useState(false)
    const dispatch = useDispatch()
    const response = useSelector(state => state.PeopleDeactivateResponse)

    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/peoples',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
          }
          axios(config)
          .then((res) => {
                setPeoples(res.data)
                setTableLoading(false)
          })
          .catch((error) => {
                console.log(error.response)
          })
      }, [])
  
    useEffect(() => {
        
    }, [peoples])

    const showServerError = () => {
        if(!_.isEmpty(response.serverErrorMsg)){
            return (
                <div class="bg-red-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                    <p class="font-bold">Be Warned</p>
                    <p>{response.serverErrorMsg}</p>
                </div>
            )
        }
    }
  
    const confirmDeactivationPeople = () => {
        if(!_.isEmpty(response.data)){
            const config = {
                method: 'get',
                url: '/api/v1/peoples',
                headers: { 
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                  }
              }
            axios(config)
            .then((res) => {
                setPeoples(res.data)
                setTableLoading(false)
                dispatch(DeactivatePeopleResponseReset())
            })
            .catch((error) => {
                console.log(error.response)
            })
        }
    }

    const handleConfirmActivation = (id) => {
        // dispatch action to activate the item with the id parameter
        var data = {
            "deactivate": false
        }
        dispatch(DeactivatePeopleDispatcher(data, id))
    }

    const handleConfirmDeactivation = (id) => {
        var data = {
            "deactivate": true
        }
        // dispatch action to activate the item with the id parameter
        dispatch(DeactivatePeopleDispatcher(data, id))
    }

    const DeactivationStatusPopUp = (email, id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg">
                    <h1 class="text-3xl text-red-600 px-4">Deactivate People. Are you sure?</h1>
                    <hr class="border-gray-300 my-4" />
                    <div class= "px-4">
                        <div class="flex items-center bg-orange-100 text-black px-4 py-3 mb-3" role="alert">
                            <div class="flex">
                                <div class="py-1">
                                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                                </div>
                                <div>
                                    <p class="font-bold text-md text-gray-800">You are about to deactivate people account.</p>
                                    <p class="text-sm text-gray-800">
                                        Once a employee account is deactivated, immediately they will not be allowed to login to their account in the system.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center text-black px-4 py-3 mb-3" role="alert">
                            <div>
                                <p class="text-sm text-gray-900">This action will stop people from using any of the feature of the system. Please confirm the following action: </p>
                                <p class="inline-block bg-gray-100 text-black pr-3 py-1">Deactivate {email} </p>
                            </div>
                        </div>
                        <div class="flex justify-end mx-3">
                            <button 
                                onClick={onClose} 
                                class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleConfirmDeactivation(id);
                                    onClose();
                                }}
                                class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
                            >
                                Yes, Deactiate it!
                            </button>
                        </div>
                  </div>
                </div>
              )
            },
            title: 'Confirm to submit'
        })
    }

    const ActivationStatusPopUp = (email, id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg">
                    <h1 class="text-3xl text-red-600 px-4">Activate People. Are you sure?</h1>
                    <hr class="border-gray-300 my-4" />
                    <div class= "px-4">
                        <div class="flex items-center bg-orange-100 text-black px-4 py-3 mb-3" role="alert">
                            <div class="flex">
                                <div class="py-1">
                                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                                </div>
                                <div>
                                    <p class="font-bold text-md text-gray-800">You are about to activate people account.</p>
                                    <p class="text-sm text-gray-800">
                                        Once a employee account is activated, immediately they will be allowed to login to their account in the system.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center text-black px-4 py-3 mb-3" role="alert">
                            <div>
                                <p class="text-sm text-gray-900">This action will all people from using all of the feature of the system. Please confirm the following action: </p>
                                <p class="inline-block bg-gray-100 text-black pr-3 py-1">Activate {email} </p>
                            </div>
                        </div>
                        <div class="flex justify-end mx-3">
                            <button 
                                onClick={onClose} 
                                class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleConfirmActivation(id);
                                    onClose();
                                }}
                                class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
                            >
                                Yes, Activate it!
                            </button>
                        </div>
                  </div>
                </div>
              )
            },
            title: 'Confirm to submit'
        })
    }

    const handleAdd = () => {
        dispatch(AddPeopleResponseReset())
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
                    {showServerError()}
                    {confirmDeactivationPeople()}
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
                                                    Subscription Expiry
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
                                                Type
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Cases
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                User Since
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Account Expiry
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
                                            peoples.map((item, index) => {
                                                return(
                                                    <tr>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <div class="flex items-center">
                                                                <div class="flex-shrink-0 w-10 h-10">
                                                                    <Link to={`/sadmin/people/${item._id.$oid}`}>
                                                                        <img class="w-full h-full rounded-full"
                                                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                                                            alt="" />
                                                                    </Link>
                                                                </div>
                                                                <Link to={`/sadmin/people/${item._id.$oid}`}>
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
                                                                {item.user_type}
                                                            </p>
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
                                                            <p class="text-gray-900 whitespace-no-wrap">
                                                                2022-10-01
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
                                                                <Link to={`/sadmin/people/${item._id.$oid}`}>Details | </Link>
                                                                {
                                                                    item.deactivate ? 
                                                                        <button class="focus:outline-none" onClick={() => ActivationStatusPopUp(item.email, item._id.$oid)}>Activate</button>
                                                                    :
                                                                        <button class="focus:outline-none" onClick={() => DeactivationStatusPopUp(item.email, item._id.$oid)}>Deactivate</button>
                                                                }
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

export default Peoples