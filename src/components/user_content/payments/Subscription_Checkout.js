import React, {useEffect, useState} from "react";
import {GrStripe} from "react-icons/gr";
// for stripe integration of checkout
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51HrMHgE8BAcK1TWiL8xfQSyyt0GlCx5CWI5CXENgG0hLvieH2FXrhUOhoMiSJE5BmsKjCcITF3JRbNR6FyCwfOGo00p6rdZvPO');

const SubscriptionCheckout = (props) => {

    const handleStripeCheckout = async (event) => {
        // Get Stripe.js instance
        const stripe = await stripePromise;

        // Call your backend to create the Checkout Session
        const response = await axios.post('/api/v1/create-subscription-checkout-session');
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
            <button class="focus:outline-none mt-3 mx-1" onClick={() => handleStripeCheckout()}>
                <div
                class="flex w-auto px-3 py-2 flex items-center justify-center bg-orange-500 text-white shadow-md hover:shadow-lg"
                >
                <span><p class="font-bold">Subscribe Now</p></span>
                </div>
            </button>
    )
}

export default SubscriptionCheckout