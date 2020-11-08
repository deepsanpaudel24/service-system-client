import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ProfileNav from "./Profile_nav";
import _ from "lodash";
import luhn from "luhn";
import {PulseLoader} from "react-spinners";
import BasicInformationIcon from "../../images/profile_setup_basic_information-1.png";
import { UpdateUserBasicProfile, UpdateUserDetailedProfile } from "../actions/UserProfileSetupAction";

const ProfileSetupPreferences = (props) => {
    const [currencyPreferences, setCurrencyPreferences] = useState("ymd")
    const [datePreferences, setDatePreferences] = useState("usd")
    const [fileToSend, setFileToSend] = useState([]);
    const [introType, setIntroType] = useState("file")
    const [introDesc, setIntroDesc] = useState("")
    const [formErrorMsg, setFormErrorMsg] = useState("")
    const [userType, setUserType] = useState("NR")
    const dispatch = useDispatch()
    const response = useSelector(state => state.updateDetailedProfileResponse)

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

    const handleCurrencyPreferences = e => {
        setCurrencyPreferences(e.target.value)
    }

    const handleDatePreferences = e => {
        setDatePreferences(e.target.value)
    }

    const handleDescChange = (e) => {
        setIntroDesc(e.target.value)
    }

    // allowed file types
    const fileTypes = [
        "video/3gpp",
        "video/3gpp2",
        "video/3gp2",
        "video/mpeg",
        "video/mp4",
        "video/ogg",
        "video/webm",
        "video/quicktime",
        "image/jpg",
        "image/jpeg",
        "image/png",
        "text/plain",
        "text/csv",
        "application/msword",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    //Validate files
    const validateFile = (file) => {
        return fileTypes.includes(file.type);
    };

    const handleFileUpload = (e) => {
        var targetFiles = e.target.files
        var validateFilesList = []
        for (let file of targetFiles) {
            if (validateFile(file)) {
                validateFilesList.push(file)
            } else {
            console.log("File Not valid....");
            }
        }
        setFileToSend(validateFilesList)
    }

    const handleTextIntroType = () => {
        setIntroType("text")
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

    const handleProfileDataSubmit = () => {
        if(userType == "SPCA" || userType=="CCA"){
            var data = {
                "service_type": localStorage.getItem('service_type'),
                "service_categories": localStorage.getItem('service_categories'),
                "name": localStorage.getItem('name'),
                "address": localStorage.getItem('address'),
                "phone_number": localStorage.getItem('phone_number'),
                "registration_number": localStorage.getItem('registration_number'),
                "currency_preferences": currencyPreferences,
                "date_preferences": datePreferences
            }
            dispatch(UpdateUserDetailedProfile(data))
        }
        else{
            var data = {
                "service_type": localStorage.getItem('service_type'),
                "service_categories": localStorage.getItem('service_categories'),
                "name": localStorage.getItem('name'),
                "address": localStorage.getItem('address'),
                "phone_number": localStorage.getItem('phone_number'),
                "personal_number": localStorage.getItem('personal_number'),
                "currency_preferences": currencyPreferences,
                "date_preferences": datePreferences
            }
            dispatch(UpdateUserDetailedProfile(data))
        }

        var formData = new FormData();
        for (let file of fileToSend) {
                formData.append(file.name, file);
            }
        if(formData.length !== 0 ){
            const config = {
                method: 'put',
                url: '/api/v1/user/update/intro',
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    },
                data: formData
            }
            axios(config)
            .then((res) => {
                console.log(res.data)
            })
            .catch((error) => {
                console.log(error.response)
            })
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
                onClick={() => handleProfileDataSubmit()}
            >
                Submit
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
                            <div class="container mx-auto w-auto py-4">
                                    <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                                        <div class="flex mb-4">
                                            <div class="w-1/6  h-15">
                                            </div>
                                            <div class="w-4/6  h-15">
                                                <h1 class="text-3xl my-5" style={{textAlign: "center"}}>Preferences you select here will be used to display information to you.</h1>
                                                <p class="text-1xl mt-5 mb-10 text-gray-500 text-s italic" style={{textAlign: "center"}}>Fill up your preferences</p>
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
                                                    Currency
                                                </label>
                                                <select
                                                    class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    style={{ width: "80%" }}
                                                    onChange={e => handleCurrencyPreferences(e)}
                                                >
                                                    <option value="usd">USD</option>
                                                    <option value="pound">POUND</option>
                                                    <option value="euro">EURO</option>
                                                </select>
                                                <label class="block text-gray-700 text-sm mb-2" for="name">
                                                    Date Format
                                                </label>
                                                <select
                                                    class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    style={{ width: "80%" }}
                                                    onChange={e => handleDatePreferences(e)}
                                                >
                                                    <option value="ymd">YYYY-MM-DD</option>
                                                    <option value="dmy">DD-MM-YYYY</option>
                                                    <option value="mdy">MM-DD-YYYY</option>
                                                </select>
                                            </div>
                                            <div class="w-2/6 ">
                                                <label class="block text-gray-700 text-sm mb-2" for="intro">
                                                    Introduction (optional)
                                                </label>
                                                {
                                                    introType == "file" ? 
                                                    <div>
                                                        <input 
                                                            class="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                            id="budget" 
                                                            type="file"
                                                            multiple
                                                            onChange={e => handleFileUpload(e)}
                                                            accept="image/png, image/jpeg,.pdf,.doc,.docx,.xml,.txt,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        />
                                                        <button class="text-sm text-blue-500 mx-4 focus:outline-none" style={{marginBottom: "4rem"}} onClick={() => handleTextIntroType()}> Write a text? </button>
                                                    </div>
                                                    :
                                                    <div>
                                                        <textarea 
                                                            class="shadow appearance-none border rounded w-full mb-3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                            id="title" 
                                                            type="text"
                                                            style={{minHeight: "8em", width: "80%"}}
                                                            onChange= {(e) => handleDescChange(e)}
                                                        />
                                                    </div>
                                                }
                                                <div class="flex justify-end" style={{marginRight: "20%"}}>
                                                    {showData()}
                                                </div>
                                            </div>
                                            <div class="w-1/6 ">
                                            </div>
                                        </div>
                                    </div>
                            </div>
                    </div>
            }
        </div>
    )
}

export default ProfileSetupPreferences