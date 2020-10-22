import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ProfileNav from "./Profile_nav";
import _ from "lodash";
import luhn from "luhn";
import {PulseLoader} from "react-spinners";
import BasicInformationIcon from "../../images/profile_setup_basic_information-1.png";
import { UpdateUserBasicProfile } from "../actions/UserProfileSetupAction";

const ProfileSetupBasic = (props) => {
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [personalNumber, setPersonalNumber] = useState("")
    const [registrationNumber, setRegistrationNumber] = useState("")
    const [formErrorMsg, setFormErrorMsg] = useState("")
    const [userType, setUserType] = useState("NR")
    const dispatch = useDispatch()
    const response = useSelector(state => state.updateBasicProfileResponse)

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
            setUserType(res.data['user_type'])
        })
        .catch((error) => {
            props.history.push("/user/login")
        })
    }, [])

    useEffect(() => {
        console.log(userType)
    }, [userType])

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleAddressChange = (e) => {
        setAddress(e.target.value)
    }

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value)
    }

    const handlePersonalNumberChange = (e) => {
        setPersonalNumber(e.target.value)
    }

    const handleRegistrationNumberChange = (e) => {
        setRegistrationNumber(e.target.value)
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

    const handleStepOneSubmit = () => {
        if(userType == "SPCA" || userType=="CCA"){
            if(!_.isEmpty(name) && !_.isEmpty(address) && !_.isEmpty(phoneNumber) && !_.isEmpty(registrationNumber)){
                setFormErrorMsg("")
                var data = {
                    "name": name,
                    "address": address,
                    "phone_number": phoneNumber,
                    "registration_number": registrationNumber
                }
                dispatch(UpdateUserBasicProfile(data))
            }
            else {
                setFormErrorMsg("Please fill up all the required fields.")
            }
        }
        else {
            if(!_.isEmpty(name) && !_.isEmpty(address) && !_.isEmpty(personalNumber) ){
                if(personalNumber.length == 10){
                    if(luhn.validate(personalNumber)){
                        setFormErrorMsg("")
                        var data = {
                            "name": name,
                            "address": address,
                            "phone_number": phoneNumber,
                            "registration_number": registrationNumber
                        }
                        dispatch(UpdateUserBasicProfile(data))
                    }
                    else {
                        setFormErrorMsg("Not a valid personal number")
                    }
                }
                else{
                    setFormErrorMsg("Not a valid personal number")
                }
            }
            else {
                
                setFormErrorMsg("Please fill up all the required fields.")
            }
        }
    }

    const showData = () => {
        if(!_.isEmpty(response.data)) {
            return props.history.push("/user/home")
        }
        if(response.loading){
            return (
                <button 
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    disabled
                >
                    Loading ...
                </button>
            )
        }
        return (
            <button 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                onClick={() => handleStepOneSubmit()}
            >
                Continue
            </button>
        )

    }

    return (
        <div>
            {
                userType == "NR" ?
                    <div class="flex h-screen">
                        <div class="m-auto">
                            <PulseLoader
                                size={10}
                                color={"#6DADE3"}
                                loading={true}
                            />
                        </div>
                    </div>
                :
                    <div>
                        {showServerError()}
                        <div>
                            <ProfileNav />
                        </div>
                        {
                            userType == "SPCA" || userType == "CCA" ?
                                    <div class="container mx-auto w-auto py-4">
                                            <form>
                                                <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                                                    <div class="flex mb-4">
                                                        <div class="w-1/6  h-15">
                                                        </div>
                                                        <div class="w-4/6  h-15">
                                                            <h1 class="text-3xl my-5" style={{textAlign: "center"}}>Welcome! Quickly setup your company profile to get started.</h1>
                                                            <p class="text-1xl mt-5 mb-10 text-gray-500 text-s italic" style={{textAlign: "center"}}>Fill up your company information</p>
                                                        </div>
                                                        <div class="w-1/6  h-15"></div>
                                                    </div>
                                                    <div class="flex mb-4">
                                                        <div class="w-2/6  h-15">
                                                        </div>
                                                        <div class="w-2/6  h-15">
                                                            {
                                                                formErrorMsg == "" ?
                                                                ""
                                                                :
                                                                    <div>
                                                                        <div class="bg-red-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                                                            <p>{formErrorMsg}</p>
                                                                        </div>
                                                                    </div>
                                                            }
                                                        </div>
                                                        <div class="w-2/6  h-15"></div>
                                                    </div>
                                                    <div class="flex mb-4">
                                                        <div class="w-2/6 ">
                                                            <img src={BasicInformationIcon} alt="Select user type" />
                                                        </div>
                                                        <div class="w-2/6">
                                                            <label class="block text-gray-700 text-sm mb-2" for="name">
                                                                Company Name
                                                            </label>
                                                            <input 
                                                                class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                id="name" 
                                                                type="text" 
                                                                placeholder="Company name" 
                                                                onChange={e => handleNameChange(e)}
                                                                style={{ width: "80%" }}
                                                            />
                                                            <label class="block text-gray-700 text-sm mb-2" for="address">
                                                                Address
                                                            </label>
                                                            <input 
                                                                class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                id="address" 
                                                                type="text" 
                                                                placeholder="Company address" 
                                                                onChange={e => handleAddressChange(e)}
                                                                style={{ width: "80%" }}
                                                            />
                                                        </div>
                                                        <div class="w-2/6 ">
                                                            <label class="block text-gray-700 text-sm mb-2" for="phone_number">
                                                                Phone Number
                                                            </label>
                                                                <input 
                                                                    class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="phone_number" 
                                                                    type="text" 
                                                                    placeholder="Phone number" 
                                                                    onChange={e => handlePhoneNumberChange(e)}
                                                                    style={{ width: "80%" }}
                                                                />
                                                                <label class="block text-gray-700 text-sm mb-2" for="registration_number">
                                                                    Registration Number
                                                                </label>
                                                                <input 
                                                                    class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="registration_number" 
                                                                    type="text" 
                                                                    placeholder="Registration number" 
                                                                    onChange={e => handleRegistrationNumberChange(e)}
                                                                    style={{ width: "80%" }}
                                                                />
                                                            <div class="flex justify-end" style={{marginRight: "20%"}}>
                                                                {showData()}
                                                            </div>
                                                        </div>
                                                        <div class="w-1/6 ">
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                </div>
                            :
                            <div class="container mx-auto w-auto py-4">
                                            <form>
                                                <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                                                    <div class="flex mb-4">
                                                        <div class="w-1/6  h-15">
                                                        </div>
                                                        <div class="w-4/6  h-15">
                                                            <h1 class="text-3xl my-5" style={{textAlign: "center"}}>Welcome! Quickly setup your profile to get started.</h1>
                                                            <p class="text-1xl mt-5 mb-10 text-gray-500 text-s italic" style={{textAlign: "center"}}>Fill up your personal information</p>
                                                        </div>
                                                        <div class="w-1/6  h-15"></div>
                                                    </div>
                                                    <div class="flex mb-4">
                                                        <div class="w-2/6  h-15">
                                                        </div>
                                                        <div class="w-2/6  h-15">
                                                            {
                                                                formErrorMsg == "" ?
                                                                ""
                                                                :
                                                                    <div>
                                                                        <div class="bg-red-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                                                            <p>{formErrorMsg}</p>
                                                                        </div>
                                                                    </div>
                                                            }
                                                        </div>
                                                        <div class="w-2/6  h-15"></div>
                                                    </div>
                                                    <div class="flex mb-4">
                                                        <div class="w-2/6 ">
                                                            <img src={BasicInformationIcon} alt="Select user type" />
                                                        </div>
                                                        <div class="w-2/6">
                                                            <label class="block text-gray-700 text-sm mb-2" for="name">
                                                                Name
                                                            </label>
                                                            <input 
                                                                class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                id="name" 
                                                                type="text" 
                                                                placeholder="Company name" 
                                                                onChange={e => handleNameChange(e)}
                                                                style={{ width: "80%" }}
                                                            />
                                                            <label class="block text-gray-700 text-sm mb-2" for="address">
                                                                Address
                                                            </label>
                                                            <input 
                                                                class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                id="address" 
                                                                type="text" 
                                                                placeholder="Company address" 
                                                                onChange={e => handleAddressChange(e)}
                                                                style={{ width: "80%" }}
                                                            />
                                                        </div>
                                                        <div class="w-2/6 ">
                                                        <label class="block text-gray-700 text-sm mb-2" for="phone_number">
                                                                Personal Number
                                                            </label>
                                                                <input 
                                                                    class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="phone_number" 
                                                                    type="text" 
                                                                    placeholder="Phone number" 
                                                                    onChange={e => handlePersonalNumberChange(e)}
                                                                    style={{ width: "80%" }}
                                                                />
                                                                <label class="block text-gray-700 text-sm mb-2" for="registration_number">
                                                                    Registration Number
                                                                </label>
                                                                <input 
                                                                    class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="registration_number" 
                                                                    type="text" 
                                                                    placeholder="Registration number" 
                                                                    onChange={e => handleRegistrationNumberChange(e)}
                                                                    style={{ width: "80%" }}
                                                                />
                                                            <div class="flex justify-end" style={{marginRight: "5%"}}>
                                                                {showData()}
                                                            </div>
                                                        </div>
                                                        <div class="w-1/6 ">
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                </div>
                        }
                    </div>
            }
        </div>
    )
}

export default ProfileSetupBasic