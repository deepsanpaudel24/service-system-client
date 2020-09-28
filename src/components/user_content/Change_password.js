import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import PasswordStrengthBar from "react-password-strength-bar"
import {ChangePasswordDispatcher} from "../actions/ChangePasswordAction"

const ChangePassword =  () => {
     //create state
    const[currentPassword, setCurrentPassword] = useState("")
    const[password, setPassword] = useState("")
    const[confirmPassword, setConfirmPassword] = useState("")
    const[confirmPasswordValid, setConfirmPasswordValid] = useState(false)
    const[currentPasswordError, setCurrentPasswordError] = useState("")
    const[passwordError, setPasswordError] = useState("")
    const dispatch = useDispatch()
    const response = useSelector(state => state.changePasswordResponse)
 
    const handleCurrentPasswordChange = e => {
        setCurrentPassword(e.target.value)
        setCurrentPasswordError("")
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
    
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");


    const dataValidator = () => {
        if(currentPassword == ""){
            setCurrentPasswordError("Please enter your current password.")
        }
        else if(!strongRegex.test(password)) {
             setPasswordError("Password must meet all the criteria.")
         }
         else if(confirmPassword == ""){
             setConfirmPasswordValid("Please confirm the password.")
         }
         else if(confirmPassword !== password){
             setConfirmPasswordValid("Does not match with the password above. please try again.")
         }
         else {
            var data ={
                "current_password": currentPassword,
                "password": password
            }
            dispatch(ChangePasswordDispatcher(data))
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

    const changePasswordLogout = () => {
        if(!_.isEmpty(response.data)){
          window.location.reload(true)
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
                Change
            </button>
        )

    }

    return (
        <div>
            {changePasswordLogout()}
            <div class="flex mb-4">
                <div class="w-1/4"></div>
                <div class="w-2/5">
                    <form>
                        <div>
                            {showServerError()}
                            <p class="text-3xl my-3" style={{textAlign: "center"}}>Change Password</p>
                            <div class="border-t border-gray-200"></div>
                            <div class="mt-6 mb-3" >
                                <label class="block text-gray-700 text-sm mb-2" for="password">
                                    Current Password
                                </label>
                                {
                                    currentPasswordError == "" ?
                                        <div>
                                            <input 
                                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                                                id="old_password" 
                                                type="Password" 
                                                placeholder="*****************" 
                                                onChange={e => handleCurrentPasswordChange(e)}
                                            />
                                        </div>
                                    :
                                    <div>
                                        <input 
                                            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="old_password" 
                                            type="password" 
                                            placeholder="****************" 
                                            onChange={e => handleCurrentPasswordChange(e)}
                                        />
                                        <p class="text-red-500 text-xs italic">{currentPasswordError}</p>
                                    </div>
                                }
                            </div>
                            <div class="mb-3">
                                <label class="block text-gray-700 text-sm mb-2" for="password">
                                    New Password
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
                            <div class="mb-3">
                                <label class="block text-gray-700 text-sm mb-2" for="password">
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
                </div>
            </div>
        </div>
    )
}

export default ChangePassword