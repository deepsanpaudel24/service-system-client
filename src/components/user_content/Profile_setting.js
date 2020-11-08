import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import _ from "lodash";
import EmpAvatar from "../../images/emp_avatar.jpg";
import {FaEdit} from "react-icons/fa";
import {CgCloseR} from "react-icons/cg";
import { ProfileSettingDispatcher } from "../actions/ProfileDetailsAction";

const ProfileSetting = (props) => {
    const [showNameField, setShowNameField] = useState(false)
    const [profileDetailsLoading, setProfileDetailsLoading] = useState(true)
    const [haveGoogleCredentials, setHaveGoogleCredentials] = useState(false)
    const [profileDetails, setProfileDetails] = useState([])
    const [activeTab, setActiveTab] = useState("basic_info")

    const dispatch = useDispatch()
    const response = useSelector(state => state.ProfileDetailsResponse)

    useLayoutEffect(() => {
        if(_.isEmpty(response.data)){ 
            const config = {
                method: 'get',
                url: '/api/v1/user/profile-details',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                  }
            }
            axios(config)
            .then((res) => {
                var data = res.data
                dispatch(ProfileSettingDispatcher(data))
                setProfileDetails(res.data)
                setProfileDetailsLoading(false)
            })
            .catch((error) => {
                
            })
        }
        else {
            setProfileDetails(response.data)
            setProfileDetailsLoading(false)
        }
        // To check if the user has linked google account 
        var config2 = {
            method: "get",
            url: "/api/v1/google-credentials-details",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            }
          }
        axios(config2)
        .then((res) => {
            setHaveGoogleCredentials(true)
        })
        .catch((error) => {
            setHaveGoogleCredentials(false)
        })
    }, [])

    useEffect(() => {
        console.log("Profile details", response.data)
    }, [profileDetails])

    // To open google consent for user authorization 
    const handleLinkGoogleAccount = () => {
        var config = {
            method: "get",
            url: "/api/v1/authorize",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
              }
        }
        axios(config)
        .then((res) => {
            window.open(res.data['auth_uri'], "_self");
        })
        .catch((error) => {
        })
    }

    // To revoke google account 
    const handleRevokeGoogleAccount = () => {
        //send revoke request 
    }

    const activeBasicInfoTab = () => {
        setActiveTab("basic_info")
    }

    const activeBillingInfoTab = () => {
        setActiveTab("billing_info")
    }

    const handleShowNameField = (value) => {
        if(value) {
            setShowNameField(true)
        }
        else{
            setShowNameField(false)
        }
    }

    return (
        <div>
            <div class="px-4 sm:px-8">
                {
                    profileDetailsLoading ? 
                    <div class="animate-pulse flex space-x-4">
                        <div class="w-4/5">
                            <div class="flex"> 
                                <img style={{height: '7em'}} class="rounded-full" src={EmpAvatar} alt="" />
                            </div>
                        </div>
                        <div class="w-1/5 flex justify-end">
                        </div>
                    </div>
                    :
                    <div class="flex">
                        <div class="w-4/5">
                            <div class="flex"> 
                                <img style={{height: '7em'}} class="rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80" alt="" />
                                <div class="ml-5 y-5" style={{marginTop: "1.5em", marginLeft: "2em"}}>
                                    {
                                        showNameField ? 
                                        <div>
                                            <input 
                                                class="shadow appearance-none border rounded w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                id="label" 
                                                type="text"
                                            />
                                            <button class="focus:outline-none ml-3" onClick={() => handleShowNameField(false)}>
                                                <p class="text-red-400 mx-6 text-lg"><CgCloseR /></p>
                                            </button>
                                        </div>
                                        :
                                        <div class="flex">
                                            <h1 class="text-2xl font-bold">
                                                {profileDetails['name']}
                                            </h1>
                                            <button class="focus:outline-none ml-3" onClick={() => handleShowNameField(true)}>
                                                <p class="text-blue-400 mx-6 my-3"><FaEdit /></p>
                                            </button>
                                        </div>
                                    } 
                                    <h1 class="text-1xl my-1">{profileDetails['email']}</h1>
                                    <p class="flex mt-8 text-base text-gray-600">
                                        ADDRESS <p class="ml-6 text-base text-black">{profileDetails['address']}</p> 
                                        <button class="focus:outline-none ml-3 mr-10 ">
                                            <p class="text-blue-400 mx-6"><FaEdit /></p>
                                        </button>
                                        JOINED ON<p class="ml-6 text-base text-black">{profileDetails['createdDate']}</p>
                                        <span class="focus:outline-none ml-3 mr-10 ">
                                            <p class="text-blue-400 mx-6"></p>
                                        </span>
                                        CONTACT NUMBER <p class="ml-6 text-base text-black">{profileDetails['phone_number']}</p>
                                        <button class="focus:outline-none ml-3 mr-10 ">
                                            <p class="text-blue-400 mx-6"><FaEdit /></p>
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="w-1/5 flex justify-end">
                        </div>
                    </div>
                }
                <div class="py-8">
                    <div class="pt-8 pb-5">
                        {
                            activeTab == "basic_info" ? 
                                <ul class="flex border-b">
                                    <li class="-mb-px mr-1">
                                        <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeBasicInfoTab()}>Basic Information</button>
                                    </li>
                                    <li class="mr-1">
                                        <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeBillingInfoTab()}>Billing Information</button>
                                    </li>
                                </ul>
                            :
                                <ul class="flex border-b">
                                    <li class="mr-1">
                                        <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeBasicInfoTab()}>Basic Information</button>
                                    </li>
                                    <li class="-mb-px mr-1">
                                        <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeBillingInfoTab()}>Billing Information</button>
                                    </li>
                                </ul>
                        }
                    </div>
                    <div>
                        {
                            activeTab == "basic_info" ? 
                                <div class="flex my-3">
                                    <div class="w-3/5">
                                        <div class="flex"> 
                                            <div style={{marginLeft: "0.5rem"}}>
                                                <div class="mb-10">
                                                    <div class="flex items-center">
                                                        <div class="text-sm ">
                                                            <p class="text-base text-gray-600">
                                                                SERVICE CATEGORIES &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                {
                                                                    !_.isEmpty(profileDetails['service_categories']) ? 
                                                                        profileDetails['service_categories'].map((item) => {
                                                                            return(
                                                                                <span
                                                                                    class="relative inline-block px-3 py-1 mx-4 font-semibold text-gray-900 leading-tight"
                                                                                >
                                                                                    <span
                                                                                    aria-hidden
                                                                                    class="absolute inset-0 bg-gray-300 opacity-50"
                                                                                    ></span>
                                                                                    <span class="relative">{item}</span>
                                                                                </span>
                                                                            )
                                                                        })
                                                                    :
                                                                    ""
                                                                }
                                                                <button class="focus:outline-none ml-3 my-4">
                                                                    <p class="text-blue-400 mx-6"><FaEdit /></p>
                                                                </button>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mt-10 mb-10">
                                                    <p class="flex items-center mt-4 text-base text-gray-600">
                                                        {
                                                            !_.isEmpty(profileDetails['registration_number']) ? 
                                                            <span class="flex">
                                                                REGISTRATION NUMBER <p class="ml-8 text-base text-black">{profileDetails['registration_number']}</p>
                                                                <button class="focus:outline-none ml-3 mr-10 ">
                                                                    <p class="text-blue-400 mx-6"><FaEdit /></p>
                                                                </button>
                                                            </span>
                                                            :
                                                            ""
                                                        }
                                                        {
                                                            !_.isEmpty(profileDetails['personal_number']) ? 
                                                            <span class="flex">
                                                                <p class="ml-10">PERSONAL NUMBER</p> <p class="ml-8 text-base text-black">{profileDetails['personal_number']}</p>
                                                                <button class="focus:outline-none ml-3 mr-10 ">
                                                                    <p class="text-blue-400 mx-6"><FaEdit /></p>
                                                                </button>
                                                            </span>
                                                            :
                                                            ""
                                                        }
                                                    </p>
                                                </div>
                                                <div class="mt-10 mb-10">
                                                    <p class="flex mt-4 text-base text-gray-600">
                                                        DATE FORMAT <p class="ml-8 text-base text-black">{!_.isEmpty(profileDetails['date_preferences']) ? profileDetails['date_preferences'] : "Not set"}</p>
                                                        <button class="focus:outline-none ml-3 mr-10 ">
                                                            <p class="text-blue-400 mx-6"><FaEdit /></p>
                                                        </button>
                                                        <p class="ml-10">CURRENCY</p> <p class="ml-8 text-base text-black">{!_.isEmpty(profileDetails['currency_preferences']) ? profileDetails['currency_preferences'] : "Not set"}</p>
                                                        <button class="focus:outline-none ml-3 mr-10 ">
                                                            <p class="text-blue-400 mx-6"><FaEdit /></p>
                                                        </button>
                                                    </p>
                                                </div>
                                                <div class="mt-10 mb-10">
                                                    {
                                                        haveGoogleCredentials ? 
                                                        <p class="flex mt-4 text-base text-gray-600">
                                                            LINKED WITH GOOGLE ACCOUNT <button class="ml-8 mr-10 text-base text-blue-500" onClick = {() => handleRevokeGoogleAccount()}>REVOKE?</button>
                                                        </p>
                                                        :
                                                        <p class="flex mt-4 text-base text-gray-600">
                                                            NOT LINKED WITH GOOGLE ACCOUNT <button class="ml-8 mr-10 text-base text-blue-500" onClick={() => handleLinkGoogleAccount()}>LINK?</button>
                                                        </p>
                                                    }
                                                </div>
                                                <div class="mt-10 mb-10">
                                                    <p class="flex mt-4 text-base text-gray-600">
                                                        INTRODUCTION <p class="ml-8 mr-10 text-base text-black">TEXT / VIDEO</p>
                                                    </p>
                                                </div>
                                            </div>
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
    )
}

export default ProfileSetting