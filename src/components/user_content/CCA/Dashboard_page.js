import React, {useState, useEffect, useLayoutEffect} from "react";
import {GrStripe} from "react-icons/gr";
import {HiInformationCircle} from "react-icons/hi";
import axios from "axios";
import SubscriptionCheckout from "../payments/Subscription_Checkout";
import ClientFillForm from "../client_intake_form/ClientFillForm";

const Dashboard = () => {
    const [UserDetails, setUserDetails] = useState([])
    const [expiryDate, setExpiryDate] = useState()
    const [remainingDays, setRemainingDays] = useState()
    
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
    }, [])

    useEffect(() => {
        
    }, [UserDetails])

    const handleOnboardStripe = () => {
        const config = {
            method: 'post',
            url: '/api/v1/onboard'
        }
        axios(config)
        .then((res) => {
            window.location = res.data.url;
        })
        .catch((error) => {
            console.log("error", error.response);
        })
    }

    return(
        <div>
            <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
                <div class="flex">
                    <p class=" text-2xl mr-1"><HiInformationCircle /></p>
                    <p>You need to onboard on stripe through this platform inorder to receive payments from your clients.</p>
                </div>
                <div >
                    <button class="focus:outline-none mt-3 mx-1" onClick={() => handleOnboardStripe()}>
                        <div
                        class="flex w-auto px-3 py-2 flex items-center justify-center bg-indigo-600 text-white shadow-md hover:shadow-lg"
                        >
                        <span><p class="font-bold">Onboard with stripe</p></span>
                        <span class="ml-2"><p class="text-xl"><GrStripe /></p></span>
                        </div>
                    </button>
                </div>
            </div>

            {/* alert box to show for the subsription of the service system if the expiry date is less than a week */}
            {
                remainingDays < 8 ? 
                <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-600 p-4 my-3" role="alert">
                    <div class="flex">
                        <p class=" text-2xl mr-1"><HiInformationCircle /></p>
                        <p>Your account will expire on <b>{UserDetails['expiryDate']}. </b> You need to get annual subscription for uninterrupted service.</p>
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
        </div>
    )
}

export default Dashboard