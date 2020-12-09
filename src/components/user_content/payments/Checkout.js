import React, {useEffect, useState} from "react";
import {GrStripe} from "react-icons/gr";
// for stripe integration of checkout
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51HrMHgE8BAcK1TWiL8xfQSyyt0GlCx5CWI5CXENgG0hLvieH2FXrhUOhoMiSJE5BmsKjCcITF3JRbNR6FyCwfOGo00p6rdZvPO');

const StripeCheckout = (props) => {

    const {caseId, caseTitle, clientId, clientName, serviceProviderId, serviceProvidername, caseStatus} = props

    const handleStripeCheckout = async (event) => {
        // Get Stripe.js instance
        const stripe = await stripePromise;
        
        const data = {
          'caseId': caseId,
          'caseTitle': caseTitle,
          'clientId': clientId,
          'clientName': clientName,
          'serviceProviderId': serviceProviderId,
          'serviceProvidername': serviceProvidername,
          'caseStatus': caseStatus
        }
        // Call your backend to create the Checkout Session
        const response = await axios.post('/api/v1/create-checkout-session', data);
        const stripe_session_id = response.data['id'];

        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
          sessionId: stripe_session_id,
        });
    
        if (result.error) {
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer
          // using `result.error.message`.
        }
      };

    return(
        <button class="focus:outline-none">
            <div
            class="flex h-12 w-auto px-5 py-5 flex items-center justify-center bg-indigo-600 text-white shadow-md hover:shadow-lg"
            onClick={() => handleStripeCheckout()}
            >
            <span><p class="font-bold">Pay Now</p></span>
            <span class="ml-2"><p class="text-xl"><GrStripe /></p></span>
            </div>
        </button>
    )
}

export default StripeCheckout