import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import _ from "lodash";
import EmpAvatar from "../../images/emp_avatar.jpg";

const ProfileSetting = (props) => {
    const [empDetailsLoading, setEmpDetailsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("basic_info")

    const handleAdd = () => {
        //console.log("Hello")
      }

    const activeBasicInfoTab = () => {
        setActiveTab("basic_info")
    }

    const activeBillingInfoTab = () => {
        setActiveTab("billing_info")
    }

    return (
        <div>
            <div class="px-4 sm:px-8">
                {
                    empDetailsLoading ? 
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
                                    <h1 class="text-2xl font-bold">
                                        John Lenon
                                    </h1>
                                    <h1 class="text-1xl my-1">johnlenon@gmail.com</h1>
                                    <p class="flex mt-8 text-base text-gray-600">
                                        TOTAL CASES <p class="ml-3 mr-10 text-base text-black">3</p>
                                        JOINED ON<p class="ml-3 mr-10 text-base text-black">2020-10-13</p>
                                        CONTACT NUMBER <p class="ml-3 text-base text-black">9842574166</p>
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
                </div>
            </div>
        </div>
    )
}

export default ProfileSetting