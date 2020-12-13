import React, {useState} from "react"
import { useDispatch, useSelector } from 'react-redux'
import _ from "lodash"
import validator from "validator"
import NavAccount from "./Nav"
import ForgotPasswordIcon  from "../../images/forgot_password.png"

import {ResetPassword} from "../actions/AccountAction"
import { withTranslation } from "react-i18next";

import { PulseLoader } from "react-spinners";


const ForgotPassword = ({t}) => {
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [showEmailBatch, setShowEmailBatch] = useState(true)
    const dispatch = useDispatch()
    const response = useSelector(state => state.forgotPasswordResponse)

    const handleEmailChange = e => {
        setEmail(e.target.value)
        setShowEmailBatch(false)
        if(validator.isEmail(email)){
            setEmailError("")
        }
    }

    const handleForgotPassword = () => {
        if(email == ""){
            setEmailError("Please enter your email.")
        }
        else if(!validator.isEmail(email)){
            setEmailError("The email address is not valid.")
        }
        else {
            var data = {
                "email": email
            }
            dispatch(ResetPassword(data))
        }
    }

    const showData = () => {
        
        if(response.loading){
            return (
                <PulseLoader size={10} color={"#6DADE3"} loading={true} />
            )
        }
        return (
            <button 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                onClick={() => handleForgotPassword()}
            >
                {t("submit")}
            </button>
        )

    }

    const showEmailConfirmationMessage = () => {
        if(!_.isEmpty(response.emailConfirmationMessage)){
            return (
                <div class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                    <p>{response.emailConfirmationMessage}</p>
                </div>
            )
        }
    }

    return (
        <div>
            <div>
                <NavAccount />
            </div>
            <div class="container mx-auto w-full max-w-sm py-4">
                <form>
                    <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                        {showEmailConfirmationMessage()}
                        <p class="text-3xl my-5" style={{textAlign: "center"}}>{t("forgot_password")}</p>
                        <p class="text-gray-500 text-xs italic">{t("recover_email_info")}</p>
                        <div class="flex mb-4">
                            <div class="w-1/5  h-15"></div>
                            <div class="w-3/5 h-15">
                                <img src={ForgotPasswordIcon} alt="Forgot Password Icon" />
                            </div>
                            <div class="w-1/5 h-15"></div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                            {t("email")}
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
                        <div class="flex justify-between my-2" style={{ justifyContent: "center"}} >
                            {showData()}
                        </div>
                    </div>
                </form>
                <p class="text-center text-gray-500 text-xs">
                        &copy;{t("copyright")}
                </p>
            </div>
        </div>
    )

}

export default withTranslation() (ForgotPassword);