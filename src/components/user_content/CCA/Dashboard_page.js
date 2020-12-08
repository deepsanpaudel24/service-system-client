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
        </div>
    )
}

export default Dashboard