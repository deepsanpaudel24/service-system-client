import React, { useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { Link } from "react-router-dom"
import LogoutUser from "../actions/UserLogoutAction"


const ProfileNav = (props) => {
    const [showMenuOptions, setShowMenuOptions] = useState(false)
    const dispatch = useDispatch()
    const logoutResponse = useSelector(state => state.logoutUserResponse)

    const handleLogout = () => {
      dispatch(LogoutUser())
    }

    const handleShowMenuOptions = () => {
        if(showMenuOptions){
            setShowMenuOptions(false)
        }
        else{
            setShowMenuOptions(true)
        }
    }

    const LogoutUserResponse = (props) => {
      if(!_.isEmpty(logoutResponse.data)){
        window.location.reload(true)
      }
    }
    return (
        <div>
            <div>
                {LogoutUserResponse()}
                    <nav class="flex items-center justify-between flex-wrap bg- p-6 bg-white">
                        <div class="flex items-center flex-shrink-0 text-black mr-6">
                            <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg>
                            <Link to={"/"}>
                                <span class="font-semibold text-xl tracking-tight text-black">Service System Platform</span>
                            </Link>
                        </div>
                        <div class="block lg:hidden">
                            <button class="flex items-center px-3 py-2 border rounded text-orange-200 border-orange-400 hover:text-black hover:border-black">
                            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                            </button>
                        </div>
                        <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                            <div class="text-sm lg:flex-grow">
                                
                            </div>
                            <div class="flex mb-4">
                                <div class="relative inline-block text-left">
                                    <div>
                                        <span class="rounded-md shadow-sm">
                                        <button type="button" onClick={() => handleShowMenuOptions()} class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                            Options
                                            <svg class="-mr-1 ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                        </span>
                                    </div>
                                    {
                                        showMenuOptions ? 
                                        <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg">
                                            <div class="rounded-md bg-white shadow-xs">
                                                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                    <a href="#" class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Profile</a>
                                                    <a href="#" class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Change password</a>
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
                    </nav>
            </div>
        </div>
    )
}

export default ProfileNav