import React , {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import validator from "validator";
import { AddEmployeeDispatcher } from "../../actions/employee_management/AddEmployeeAction";

const AddEmployee = (props) => {
    const[email, setEmail] = useState("")
    const[emailError, setEmailError] = useState("")
    const dispatch = useDispatch()
    const response = useSelector(state => state.addEmployeeResponse)

    const handleEmailChange = e => {
        setEmail(e.target.value)
        if(validator.isEmail(email)){
            setEmailError("")
        }
    }

    const dataValidator = () => {
        if(email == ""){
            setEmailError("Please enter email address.")
        }
        else if(!validator.isEmail(email)){
            setEmailError("The email address is not valid.")
        }
        else {
            var data = {
                "email": email
            }
            dispatch(AddEmployeeDispatcher(data))
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

    const confirmEmployeeRegister = () => {
        if(!_.isEmpty(response.data)){
           return(
            <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                <p class="font-bold">Employee added successfully</p>
            </div>
           )
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
                class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                style={{backgroundColor: "#3490ff"}}
                onClick={() => dataValidator()}
            >
                Add
            </button>
        )

    }
    
    return (
        <div class="flex mb-4">
            <div class="w-1/4"></div>
            <div class="w-2/5">
                <form>
                    <p class="text-3xl my-3" style={{textAlign: "center"}}>Add Employee</p>
                    <div class="border-t border-gray-200"></div>
                    {showServerError()}
                    {confirmEmployeeRegister()}
                    <div class="mt-6 mb-3" >
                        <label class="block text-gray-700 text-sm mb-2" for="password">
                            Employee Email
                        </label>
                        {
                            emailError == "" ? 
                                <div>
                                    <input 
                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="employee_email" 
                                        type="text"
                                        onChange={(e) => handleEmailChange(e)} 
                                    />
                                </div>
                            :
                                <div>
                                    <input 
                                        class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="employee_email" 
                                        type="text"
                                        onChange={(e) => handleEmailChange(e)} 
                                    />
                                    <p class="text-red-500 text-xs italic">{emailError}</p>
                                </div>
                        }
                    </div>
                    <div class="flex justify-between" style={{ justifyContent: "center"}}>
                        {showData()}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddEmployee