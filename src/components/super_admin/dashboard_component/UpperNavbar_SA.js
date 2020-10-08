import React, {useState} from "react";
import { Link } from "react-router-dom";
import LogoutUser from "../../actions/UserLogoutAction";
import { useDispatch, useSelector } from 'react-redux';
import _ from "lodash";
import SAContent from "./Content_SA";

const SANavbar = () => {
    const [showOptions, setShowOptions] = useState(false)
    // const [logout, setLogout] = useState(false)
    const dispatch = useDispatch()
    const logoutResponse = useSelector(state => state.logoutUserResponse)


    const handleLogout = () => {
        dispatch(LogoutUser())
    }

    const LogoutUserResponse = (props) => {
      if(!_.isEmpty(logoutResponse.data)){
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.reload(true)
      }
    }

    const handleShowOptions = () => {
        if(showOptions){
            setShowOptions(false)
        }
        else {
            setShowOptions(true)
        }
    }

    return(
        <div>
            {LogoutUserResponse()}
            <nav style={{backgroundColor: "#273238"}}>
            <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div class="relative flex items-center justify-between h-16">
                <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                    <div class="hidden sm:block sm:ml-6">
                    <div class="flex">
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium leading-5 text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Dashboard</a>
                        <a href="#" class="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Team</a>
                        <a href="#" class="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Projects</a>
                        <a href="#" class="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Calendar</a>
                    </div>
                    </div>
                </div>
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <button class="p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out" aria-label="Notifications">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    </button>
                    <div class="ml-3 relative">
                    <div>
                        <button onClick={() => handleShowOptions()} class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out" id="user-menu" aria-label="User menu" aria-haspopup="true">
                        <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                        </button>
                    </div>
                    {
                        showOptions ? 
                        <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg">
                            <div class="rounded-md bg-white shadow-xs">
                                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    <a href="#" class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Profile</a>
                                    <Link to="/sadmin/change-password" onClick={() => handleShowOptions()} class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Change password</Link>
                                    <a href="#" class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Account settings</a>
                                    <div class="border-t border-gray-200"></div>
                                    <button type="submit" onClick={() => handleLogout()} class="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                        :
                        ""
                    }
                    </div>
                </div>
                </div>
            </div>
            </nav>
            <div class="container max-w-full py-4">
                <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mx-4">
                    <SAContent />
                </div>
            </div>
        </div>
    )
}

export default SANavbar