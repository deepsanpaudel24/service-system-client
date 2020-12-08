import React, {useEffect, useState} from "react";
// for stripe integration of checkout
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51HrMHgE8BAcK1TWiL8xfQSyyt0GlCx5CWI5CXENgG0hLvieH2FXrhUOhoMiSJE5BmsKjCcITF3JRbNR6FyCwfOGo00p6rdZvPO');

const SubscriptionCheckout = (props) => {

    const handleStripeCheckout = async (type) => {
        // Get Stripe.js instance
        const stripe = await stripePromise;

        // Call your backend to create the Checkout Session
        const response = await axios.post('/api/v1/create-subscription-checkout-session/' + type);
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
        <div class="flex">
          <button class="focus:outline-none mt-3 mx-1" onClick={() => handleStripeCheckout("annual")}>
            <div
              class="flex w-auto px-3 py-2 flex items-center justify-center bg-orange-500 text-white shadow-md hover:shadow-lg"
            >
              <span><p class="font-bold">Get Annual Subscription</p></span>
            </div>
          </button>
          <p class="mx-3 mt-5 text-orange-700 underline cursor-pointer" onClick={() => handleStripeCheckout("monthly")} > Subscribe for a month? </p>
        </div>
    )
}

export default SubscriptionCheckout