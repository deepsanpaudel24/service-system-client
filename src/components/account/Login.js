import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
//import axios from "../Axios";
import _ from "lodash";
import {PulseLoader} from "react-spinners";
import validator from "validator";
import NavAccount from "./Nav";
import { LoginUser } from "../actions/AccountAction";

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [showEmailBatch, setShowEmailBatch] = useState(true)
    const [showResetPasswordConfirm, setShowResetPasswordConfirm] = useState(true)
    const [showLoginForm, setShowLoginForm] = useState(false)
    const dispatch = useDispatch()
    const response = useSelector(state => state.loginResponse)
    const emailConfirmationResponse = useSelector(state => state.resgiterResponse)
    const resetPasswordResponse = useSelector(state => state.resetPasswordResponse)

    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/user/validity',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        axios(config) 
        .then((res) => {
            console.log(res.data)
                if(res.data['user_type'] == "SA" || res.data['user_type'] == "SAe"){
                    return props.history.push("/sadmin/home")
                }
                else if(res.data['user_type'] == "UVU"){
                    return props.history.push("/user/setup/user-type")
                }
                else if(!res.data['profile_detailed_completion']){
                    return props.history.push("/user/setup/profile/details")
                }
                else if(!res.data['profile_basic_completion']){
                    return props.history.push("/user/setup/profile/basic")
                }
                else {
                    return props.history.push("/user/home")
                }
        })
        .catch((error) => {
            console.log("error from login catch", error.response)
            setShowLoginForm(true)
        })
    }, [])

    useEffect(() => {
        
    }, [showLoginForm])

    
    const handleEmailChange = e => {
        setEmail(e.target.value)
        setShowEmailBatch(false)
        setShowResetPasswordConfirm(false)
        if(validator.isEmail(email)){
            setEmailError("")
        }
    }

    const handlePassword = e => {
        setPassword(e.target.value)
        setPasswordError("")
        setShowEmailBatch(false)
        setShowResetPasswordConfirm(false)
    }

    const handleRememberMeChange = e => {
        setRememberMe(e.target.checked)
        setShowEmailBatch(false)
        setShowResetPasswordConfirm(false)
    }

    const HandleLoginUser = () => {
        if(email == ""){
            setEmailError("Please enter your email.")
        }
        else if(!validator.isEmail(email)){
            setEmailError("The email address is not valid.")
        }
        else if(password == ""){
            setPasswordError("Please fill up your password.")
        }
        else {
            var data = {
                "email": email,
                "password":password,
                "rememberMe": rememberMe
            }
            dispatch(LoginUser(data))
        }
    }

    const showServerError = () => {
        if(!_.isEmpty(response.serverErrorMsg)){
            return (
                <div class="bg-red-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                    <p class="font-bold">Be Warned</p>
                    <p>{response.serverErrorMsg}</p>
                </div>
            )
        }
    }

    const showEmailConfirmationMessage = () => {
        if(!_.isEmpty(emailConfirmationResponse.emailConfirmationMessage)){
            return (
                <div class="bg-blue-100 border-t-4 border-blue-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                    <div class="flex">
                        <div class="py-1"><svg class="fill-current h-4 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                        <div>
                        <p class="font-bold">{emailConfirmationResponse.emailConfirmationMessage}</p>
                        {/* <p class="text-left text-sm italic">You did not get email?<a href="#"> Resend</a></p> */}
                        </div>
                    </div>
                </div>
            )
        }
    }

    const showResetConfirmationMessage = () => {
        if(!_.isEmpty(resetPasswordResponse.loginConfirmationMessage)){
            return (
                <div class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                    <p>{resetPasswordResponse.loginConfirmationMessage}</p>
                </div>
            )
        }
    }


    const showData = () => {
        if(!_.isEmpty(response.data)) {
            if(response.data['login']){
                console.log(response.data)
                if(!response.data['logout']){
                    if(response.data['user_type'] == "SA" || response.data['user_type'] == "SAe"){
                        return props.history.push("/sadmin/home")
                    }
                    else if(response.data['user_type'] == "UVU"){
                        return props.history.push("/user/setup/user-type")
                    }
                    else if(!response.data['profile_detailed_completion']){
                        return props.history.push("/user/setup/profile/details")
                    }
                    else if(!response.data['profile_basic_completion']){
                        return props.history.push("/user/setup/profile/basic")
                    }
                    else {
                        return props.history.push("/user/home")
                    }
                }
            }
        }
        if(response.loading){
            return (
                <div class="m-auto">
                    <PulseLoader
                        size={10}
                        color={"#6DADE3"}
                        loading={true}
                    />
                </div>
            )
        }
        return (
            <button 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                onClick={() => HandleLoginUser()}
            >
                Sign In
            </button>
        )

    }

    return (
        <div>
            {
                showLoginForm ? 
                <div>
                    <div>
                        <NavAccount />
                    </div>
                    <div class="container mx-auto w-full max-w-sm py-4 mt-3">
                        <form>
                            <div class="bg-white align-bottom shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                                {
                                    showEmailBatch == true ? 
                                        showEmailConfirmationMessage()
                                    :   
                                        ""
                                }

                                {
                                    showResetPasswordConfirm == true ?
                                        showResetConfirmationMessage()
                                    :
                                        ""
                                }
                                {showServerError()}
                                <p class="text-3xl my-5" style={{textAlign: "center"}}>Sign In</p>
                                <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                                        Email
                                    </label>
                                    {
                                        emailError == "" ?
                                            <div>
                                                <input 
                                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="email" 
                                                    type="text" 
                                                    placeholder="Email" 
                                                    onChange={ e => handleEmailChange(e)}
                                                />
                                            </div>
                                        :
                                            <div>
                                                <input 
                                                    class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="email" 
                                                    type="text" 
                                                    placeholder="Email" 
                                                    onChange={ e => handleEmailChange(e)}
                                                />
                                                <p class="text-red-500 text-xs italic">{emailError}</p>
                                            </div>
                                    }
                                </div>
                                <div class="mb-6">
                                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                        Password
                                    </label>
                                    {
                                        passwordError == "" ?
                                            <div>
                                                <input 
                                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="password" 
                                                    type="password" 
                                                    placeholder="******************"
                                                    onChange={ e => handlePassword(e)}
                                                />
                                            </div>
                                        :
                                            <div>
                                                <input 
                                                    class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="password" 
                                                    type="password" 
                                                    placeholder="******************"
                                                    onChange={ e => handlePassword(e)}
                                                />
                                                <p class="text-red-500 text-xs italic">{passwordError}</p>
                                            </div>
                                    }
                                </div>
                                <div class="md:flex md:items-center my-6">
                                    <div class="md:w-1/3"></div>
                                    <label class="md:w-2/3 block">
                                    <input class="mr-2 leading-tight" type="checkbox" checked onChange= { e => handleRememberMeChange(e)}/>
                                    <span class="text-sm">
                                        Remember me
                                    </span>
                                    </label>
                                </div>
                                <div class="flex justify-between my-6" style={{ justifyContent: "center"}} >
                                    <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/user/forgot-password">
                                        Forgot Password?
                                    </a>
                                </div>
                                <div class="flex justify-between my-2" style={{ justifyContent: "center"}} >
                                    {showData()}
                                </div>
                            </div>
                        </form>
                        <p class="text-center text-gray-500 text-xs">
                            &copy;2020 service system. All rights reserved.
                        </p>
                    </div>
                </div>
                :
                    <div class="flex h-screen">
                        <div class="m-auto">
                        <PulseLoader
                            size={10}
                            color={"#6DADE3"}
                            loading={true}
                        />
                        </div>
                    </div>

            }
        </div>
    )
}

export default Login