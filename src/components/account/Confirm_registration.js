import React, {useState, useEffect, useLayoutEffect} from "react";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import VerifyFail from "../../images/verify_fail.png";
import {Link} from "react-router-dom"

const ConfirmRegistration = (props) => {

    const [notVerified, setNotVerified] = useState(false)
    const [verified, setVerified] = useState(false)

    useEffect(() => {
        // Send the token to the backend and check if the token is valid
        // If the token is valid, then push the user to the login page
        // If not give the message that the token is not valid.

        var string = document.location.pathname;
        var urlvalues = string.toString().split("/");
        const config = {
            method: "get",
            url: "/api/user/email/confirm/" + urlvalues[2]
        }
        axios(config)
        .then((res) => {
            setVerified(true)
        })
        .catch((error) => {
            setNotVerified(true)
        })
    })

    return(
        <div>
            {
                notVerified ? 
                <div class="flex h-screen">
                    <div class="m-auto" style={{"justifyContent": "center" }}>
                        <p class="mx-3 text-gray-700 text-md">Sorry, your email could not be verified</p>
                    </div>
                </div>
                :
                verified?
                <div class="flex h-screen">
                    <div class="m-auto" style={{"justifyContent": "center" }}>
                        <p class="mx-3 text-gray-700 text-md">Your email was verified. You can <Link to="/user/login" ><span class="text-blue-700 underline">login</span></Link> in now.</p>
                    </div>
                </div>
                :
                <div class="flex h-screen">
                    <div class="m-auto" style={{"justifyContent": "center" }}>
                        <span style={{"marginLeft": "-2em"}}>Email Verification</span>
                        <PulseLoader size={10} color={"#6DADE3"} loading={true} class="ml-3"/>
                    </div>
                </div>
            }
        </div>
    )
}

export default ConfirmRegistration