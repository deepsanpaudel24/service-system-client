import React, {useState, useEffect, useLayoutEffect} from "react";
import {GrStripe} from "react-icons/gr";
import {HiInformationCircle} from "react-icons/hi";
import axios from "axios";
import SubscriptionCheckout from "../payments/Subscription_Checkout";
import ClientFillForm from "../client_intake_form/ClientFillForm";
import {
    FaTachometerAlt,
    FaGem,
    FaUsers,
    FaRegListAlt,
    FaServicestack,
    FaTasks,
    FaWpforms,
  } from "react-icons/fa";

const Dashboard = () => {
    const [UserDetails, setUserDetails] = useState([])
    const [expiryDate, setExpiryDate] = useState()
    const [remainingDays, setRemainingDays] = useState()
    //dashboard stats state
    const [ total_no_cases, setTotal_no_cases] = useState(0)
    const [ total_no_employees, setTotal_no_employees] = useState(0)
    const [ total_no_closed_cases, setTotal_no_closed_cases] = useState(0)
    
    useLayoutEffect(() => {
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
            setUserDetails(res.data)
            var exp_date = new Date(res.data['expiryDate'])
            setExpiryDate(exp_date)
            var current_date = new Date();
            var diff = Math.abs(exp_date - current_date)
            var diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24)); 
            setRemainingDays(diffDays)
        })
        .catch((error) => {

        })

        const config2 = {
            method: 'get',
            url: '/api/v1/client-dashboard/stats',
        }
        axios(config2)
        .then((res) => {
            setTotal_no_cases(res.data['total_no_cases'])
            setTotal_no_employees(res.data['total_no_employees'])
            setTotal_no_closed_cases(res.data['total_no_closed_cases'])
        })
        .catch((error) => {
            console.log(error.response)
        })
    }, [])

    useEffect(() => {
        
    }, [UserDetails])

    return(
        <div>

            {/* alert box to show for the subsription of the service system if the expiry date is less than a week */}
            {
                remainingDays < 8 ? 
                <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-600 p-4 my-3" role="alert">
                    <div class="flex">
                        <p class=" text-2xl mr-1"><HiInformationCircle /></p>
                        <p>Your account will expire on <b>{UserDetails['expiryDate']}. </b> You need to get subscription for uninterrupted service.</p>
                    </div>
                    <div >
                        <SubscriptionCheckout />
                    </div>
                </div>
                :
                ""
            }
            <div class="my-3">
                <ClientFillForm />
            </div>
            <div class="my-3">
                <div class="flex flex-wrap mb-2">
                    <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pr-2">
                        <div class="bg-green-100 border-l-4 border-green-500 text-green-600 rounded shadow p-2">
                            <div class="flex flex-row items-center">
                                <div class="flex pl-1 pr-1"><span class="text-green-400 text-3xl">< FaGem/></span></div>
                                <div class="flex-1 text-right">
                                    <h5 class="">Total Cases</h5>
                                    <h3 class="text-3xl">{total_no_cases}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pl-2">
                        <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-600 rounded shadow p-2">
                            <div class="flex flex-row items-center">
                                <div class="flex-shrink pl-1 pr-4"><span class="text-blue-400 text-3xl">< FaUsers/></span></div>
                                <div class="flex-1 text-right">
                                    <h5 class="">Total Employees</h5>
                                    <h3 class="text-3xl">{total_no_employees} <span class="text-blue-400"><i class="fas fa-caret-up"></i></span></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pr-2 xl:pr-3 xl:pl-1">
                        <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-600 rounded shadow p-2">
                            <div class="flex flex-row items-center">
                                <div class="flex-shrink pl-1 pr-4"><span class="text-orange-400 text-3xl">< FaServicestack/></span></div>
                                <div class="flex-1 text-right pr-1">
                                    <h5 class="">Closed Cases </h5>
                                    <h3 class="text-3xl">{total_no_closed_cases} <span class="text-orange-400"><i class="fas fa-caret-up"></i></span></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard