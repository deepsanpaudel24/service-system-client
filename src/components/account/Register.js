import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import _ from "lodash"
import { RegisterUser } from "../actions/AccountAction"
import NavAccount from "./Nav"
import validator from "validator"
import PasswordStrengthBar from "react-password-strength-bar"

const Register = (props) => {
    //create state
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const[confirmPassword, setConfirmPassword] = useState("")
    const[confirmPasswordValid, setConfirmPasswordValid] = useState(false)
    const[emailError, setEmailError] = useState("")
    const[passwordError, setPasswordError] = useState("")
    const[mailSent, setmailSent] = useState(false)
    const dispatch = useDispatch()
    const response = useSelector(state => state.resgiterResponse)

    const handleEmailChange = e => {
        setEmail(e.target.value)
        if(validator.isEmail(email)){
            setEmailError("")
        }
    }

    const handlePasswordChange = e => {
        setPassword(e.target.value)
        if(!password.length < 7){
            setPasswordError("")
        }
    }

    const handleConfirmPassword = e => {
        setConfirmPassword(e.target.value)
        setConfirmPasswordValid("")
    }

    var data = {
        "email": email,
        "password": password
    }

    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");


    const dataValidator = () => {
        if(email == ""){
            setEmailError("Please enter your email.")
        }
        else if(!validator.isEmail(email)){
            setEmailError("The email address is not valid.")
        }
        else if (!strongRegex.test(password)) {
            setPasswordError("Password must meet all the criteria.")
        }
        else if(confirmPassword == ""){
            setConfirmPasswordValid("Please confirm the password.")
        }
        else if(confirmPassword !== password){
            setConfirmPasswordValid("Does not match with the password above. please try again.")
        }
        else {
            dispatch(RegisterUser(data))
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

    const showMessage = () => {
        if(!_.isEmpty(response.data)) {
             return props.history.push("/user/login")
            
        }
    }

    const showData = () => {
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
                onClick={() => dataValidator()}
            >
                Sign up
            </button>
        )

    }
    return (
        <div>
            <div>
                <NavAccount />
            </div>
            <div class="container mx-auto w-full max-w-sm py-4">
                <form>
                    <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                        {showServerError()}
                        {showMessage()}
                        <p class="text-3xl my-3" style={{textAlign: "center"}}>Sign Up</p>
                        <div class="mb-6">
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
                                            placeholder="email" 
                                            onChange={e => handleEmailChange(e)}
                                        />
                                    </div>
                                    :
                                    <div>
                                        <input 
                                            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="email" 
                                            type="text" 
                                            placeholder="email" 
                                            onChange={e => handleEmailChange(e)}
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
                                password == "" && passwordError == "" ?
                                    <div>
                                        <p class="text-gray-500 text-xs italic">Hint: You are required to use a sufficiently strong password. Password must be more than 7 characters, atleast one special character and numbers and letter in Upper case.</p>
                                        <input 
                                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="password" 
                                            type="password" 
                                            placeholder="******************"
                                            onChange= {e => handlePasswordChange(e)}
                                        />
                                    </div>
                                :
                                    passwordError == "" ?
                                        <div>
                                            <p class="text-gray-500 text-xs italic">Hint: You are required to use a sufficiently strong password. Password must be more than 7 characters, atleast one special character and numbers and letter in Upper case.</p>
                                            <input 
                                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                                                id="password" 
                                                type="password" 
                                                placeholder="******************"
                                                onChange= {e => handlePasswordChange(e)}
                                            />
                                            <PasswordStrengthBar password={password} />
                                        </div>
                                        :
                                        <div>
                                            <p class="text-gray-500 text-xs italic">Hint: You are required to use a sufficiently strong password. Password must be more than 7 characters, atleast one special character and numbers and letter in Upper case.</p>
                                            <input 
                                                class="shadow appearance-none border border-orange-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                                                id="password" 
                                                type="password" 
                                                placeholder="******************"
                                                onChange= {e => handlePasswordChange(e)}
                                            />
                                            <p class="text-red-500 text-xs italic">{passwordError}</p>
                                            <PasswordStrengthBar password={password} />
                                        </div>

                            }
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                Confirm Password
                            </label>
                            {
                                confirmPasswordValid == "" ?
                                    <div>
                                        <input 
                                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="password" 
                                            type="password" 
                                            placeholder="******************"
                                            onChange= {e => handleConfirmPassword(e)}
                                        />
                                    </div>
                                :
                                    <div>
                                        <input 
                                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="password" 
                                            type="password" 
                                            placeholder="******************"
                                            onChange= {e => handleConfirmPassword(e)}
                                        />
                                        <p class="text-red-500 text-xs italic">{confirmPasswordValid}</p>
                                    </div>
                            }
                        </div>
                        <div class="flex justify-between" style={{ justifyContent: "center"}}>
                            {showData()}
                        </div>
                    </div>
                </form>
                <p class="text-center text-gray-500 text-xs">
                    &copy;2020 service system. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default Register