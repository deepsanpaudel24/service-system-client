import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import ProfileNav from "./Profile_nav";
import _, { isEmpty } from "lodash";
import {PulseLoader} from "react-spinners";
import CreatableSelect from 'react-select/creatable';
import DetailedInformationIcon from "../../images/setup_profile_detailed.png";
import { UpdateUserDetailedProfile } from "../actions/UserProfileSetupAction";

 
const ProfileSetupDetailed = (props) => {
    const [serviceType, setServiceType] = useState("both");
    const [serviceCategories, setServiceCategories] = useState("");
    const [formErrorMsg, setFormErrorMsg] = useState("");
    const [userType, setUserType] = useState("NR");
    const dispatch = useDispatch();
    const response = useSelector(state => state.updateDetailedProfileResponse);

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
        
    }, [userType])

    const handleSericeType = (e) => {
        setServiceType(e.target.value)
    }

    const handleServiceCategories = e => {
        var values = []
        if(isEmpty(e)){
            //
        }
        else {
            e.map((item, index) => {
                values.push(item.value)
            })
            setServiceCategories(values.toString())
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

    const handleStepTwoSubmit = () => {
        if(!_.isEmpty(serviceType) && !_.isEmpty(serviceCategories) ){
            setFormErrorMsg("")
            var data = {
                "service_type": serviceType,
                "service_categories": serviceCategories
            }
            dispatch(UpdateUserDetailedProfile(data))
        }
        else {
            setFormErrorMsg("Please fill up all the required fields.")
        }
    }

    const showData = () => {
        if(!_.isEmpty(response.data)) {
            if(response.data['user_type'] == "SPCA" || response.data['user_type'] == "CCA"){
                return props.history.push("/user/setup/profile/basic")
            }
            else if(response.data['user_type'] == "SPS" || response.data['user_type'] == "CS"){
                return props.history.push("/user/setup/profile/basic")
            }
        }
        if(response.loading){
            return (
                <button 
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-5 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    disabled
                >
                    Loading ...
                </button>
            )
        }
        return (
            <button 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-5 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                onClick={() => handleStepTwoSubmit()}
            >
                Continue
            </button>
        )

    }
    
    const options = [
        {label:'React', value:'react'},
        {label:'Angular', value: 'angular'}
    ]

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
                    <div class="container mx-auto w-auto py-4">
                            <form>
                                <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                                    <div class="flex mb-4">
                                        <div class="w-1/6  h-15">
                                        </div>
                                        <div class="w-4/6  h-15">
                                            <h1 class="text-3xl my-5" style={{textAlign: "center"}}>This information will help you later.</h1>
                                            <p class="text-1xl mt-5 mb-10 text-gray-500 text-s italic" style={{textAlign: "center"}}>Fill up your detailed information</p>
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
                                        <div class="w-1/6"></div>
                                        <div class="w-2/6 ">
                                            <img src={DetailedInformationIcon} alt="Select user type" />
                                        </div>
                                        <div class="w-2/6">
                                            <div class="flex justify-between" >
                                                <form>
                                                    <div class="flex items-center mr-4 mb-1">
                                                        <label class="block text-black text-md mb-2" for="name">
                                                            Service Type:
                                                        </label>
                                                    </div>
                                                    <div class="flex items-center mr-4 mb-4">
                                                        <input id="radio1" type="radio" name="radio" class="hidden" value="law" onClick={(e) => {handleSericeType(e)}}  />
                                                        <label for="radio1" class="flex items-center cursor-pointer mr-4">
                                                            <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                                                            <p class="text-gray-800">Law</p>
                                                        </label>
                                                        <input id="radio2" type="radio" name="radio" class="hidden" value="account" onClick={(e) => {handleSericeType(e)}}  />
                                                        <label for="radio2" class="flex items-center cursor-pointer mr-4">
                                                            <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                                                            <p class="text-gray-800">Account</p>
                                                        </label>
                                                        <input id="radio3" type="radio" name="radio" class="hidden" value="both" onClick={(e) => {handleSericeType(e)}}  />
                                                        <label for="radio3" class="flex items-center cursor-pointer mr-4">
                                                            <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                                                            <p class="text-gray-800">Both</p>
                                                        </label>
                                                    </div>
                                                    <p class="text-gray-500 text-xs italic">Hint: You can type your service categories in the form field if they are not listed in dropdown options</p>
                                                    <div class="flex items-center mr-4 mt-2 mb-1">
                                                        <label class="block text-black text-md mb-2" for="name">
                                                            Service categories:
                                                        </label>
                                                    </div>
                                                    <CreatableSelect
                                                        isMulti
                                                        onChange={(e) => handleServiceCategories(e)}
                                                        options={options}
                                                    />
                                                </form>
                                            </div>
                                            <div class="flex justify-end" >
                                                {showData()}
                                            </div>
                                        </div>
                                        <div class="w-1/6"></div>
                                    </div>
                                </div>
                            </form>
                    </div>
                </div>
            }
        </div>
    )
}

export default ProfileSetupDetailed