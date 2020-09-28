import React, { useState, useEffect, useLayoutEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import {Form, Input, Button} from 'antd'
import ProfileNav from "./Profile_nav"
import axios from "axios"
import _ from "lodash"
import BillingInformationIcon from "../../images/payment_details.png"

import { UpdateUserBillingProfile } from "../actions/UserProfileSetupAction"
 

const ProfileSetupBilling = (props) => {
    const [cardNumber, setCardNumber] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [cvc, setCvc] = useState("")
    const [formErrorMsg, setFormErrorMsg] = useState("")
    const [userType, setUserType] = useState("NR")
    const dispatch = useDispatch()
    const response = useSelector(state => state.updateBillingProfileResponse)

    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/user/validity',
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
       // any function that should be done after the userType is updated can be done here
    }, [userType])

    const handleCardNumberChange = (e) => {
        setCardNumber(e.target.value)
    }
    const handleExpiryDateChange = (e) => {
        setExpiryDate(e.target.value)
    }
    const handleCvcChange = (e) => {
        setCvc(e.target.value)
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

    const handleBillingInfoSubmit = () => {
        if(!_.isEmpty(cardNumber) && !_.isEmpty(expiryDate) && !_.isEmpty(cvc)){
            setFormErrorMsg("")
            var data = {
                "card_number": cardNumber,
                "expiry_date": expiryDate,
                "cvc": cvc
            }
            dispatch(UpdateUserBillingProfile(data))
        }
        else {
            setFormErrorMsg("Please fill up all the required fields.")
        }
    }

    const handleSkipBilling = () => {
        return props.history.push("/user/home")
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
                onClick={() => handleBillingInfoSubmit()}
            >
                Submit
            </button>
        )
    }


    return (
        <div>
            {
                userType == "NR" ?
                ""
                :
                <div>
                    {showServerError()}
                    <div>
                        <ProfileNav />
                    </div>
                    <div>
                        <div class="container mx-auto w-auto py-4">
                        <form>
                            <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                                <div class="flex mb-4">
                                    <div class="w-1/6  h-15">
                                    </div>
                                    <div class="w-4/6  h-15">
                                        <h1 class="text-3xl my-5" style={{textAlign: "center"}}>We are almost done! </h1>
                                        <p class="text-1xl mt-5 mb-10 text-gray-500 text-s italic" style={{textAlign: "center"}}>Fill up your billing information</p>
                                    </div>
                                    <div class="w-1/6  h-15">
                                    </div>
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
                                        <img src={BillingInformationIcon} alt="Select user type" />
                                    </div>
                                    <div class="w-2/6">
                                        <Form layout="vertical" style={{ marginLeft: "15%", width: "80%"}}>
                                            <Form.Item label="Card Number" >
                                                <Input onChange={ (e) => handleCardNumberChange(e) } />
                                            </Form.Item>
                                            <Form.Item label="Expiry Date" >
                                                <Input onChange={ (e) => handleExpiryDateChange(e)} />
                                            </Form.Item>
                                        </Form>
                                    </div>
                                    <div class="w-2/6 ">
                                        <Form layout="vertical" style={{ marginLeft: "15%", width: "80%"}}>
                                            <Form.Item label="CVC" >
                                                <Input onChange={ (e) => handleCvcChange(e) } />
                                            </Form.Item>
                                        </Form>
                                        <div class="flex justify-between my-8" >

                                        </div>
                                        <div class="flex justify-end" style={{marginRight: "5%"}}>
                                            <button 
                                                class="text-black border-blue text-underline py-2 px-4 rounded focus:outline-none " 
                                                type="button" 
                                                onClick= {() => handleSkipBilling()}
                                            >
                                                Skip
                                            </button>
                                            {showData()}
                                        </div>
                                    </div>
                                    <div class="w-1/6 ">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            }
        </div>
    )
}

export default ProfileSetupBilling