import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import _ from "lodash";
import EmpAvatar from "../../images/emp_avatar.jpg";
import {FaEdit} from "react-icons/fa";
import {VscClose} from "react-icons/vsc";
import { ProfileSettingDispatcher, ProfileSettingResponseReset } from "../actions/ProfileDetailsAction";
import { UpdateProfileIntroduction, UpdateProfileSetting } from "../actions/UpdateProfileAction";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import CreatableSelect from 'react-select/creatable';
import {PulseLoader} from "react-spinners";
import VideoPlayer from "./video_player/VideoPlayer";
import { MdFileUpload } from "react-icons/md";

const ProfileSetting = (props) => {
    // declaring a global variables
    var scToSend = ""
    var datePreferencesToSend = ""
    var currencyPreferencesToSend = ""
    const [fileNameToShow, setFileNameToShow] = useState([])  
    const [showNameField, setShowNameField] = useState(false)
    const [name, setName] = useState("")
    const [showAddressField, setShowAddressField] = useState(false)
    const [address, setAddress] = useState("")
    const [showContactField, setShowContactField] = useState(false)
    const [contact, setContact] = useState("")
    const [showRegistrationField, setShowRegistrationField] = useState(false)
    const [registrationNumber, setRegistrationNumber] = useState("")
    const [showPersonalNumberField, setShowPersonalNumberField] = useState(false)
    const [personalNumber, setPersonalNumber] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [serviceCategories, setServiceCategories] = useState([])
    const [serviceCategoriesDefaultValue, setServiceCategoriesDefaultValue] = useState([])
    const [datePreferences, setDatePreferences] = useState("")
    const [currencyPreferences, setCurrencyPreferences] = useState("")

    const [fileToSend, setFileToSend] = useState([])
    const [IntroText, setIntroText] = useState("")

    const [profileDetailsLoading, setProfileDetailsLoading] = useState(true)
    const [haveGoogleCredentials, setHaveGoogleCredentials] = useState(false)
    const [profileDetails, setProfileDetails] = useState([])
    const [activeTab, setActiveTab] = useState("basic_info")

    const [showVideoForm, setShowVideoForm] = useState(true)
    const [showIntroForm, setShowIntroForm] = useState(true)

    const dispatch = useDispatch()
    const response = useSelector(state => state.ProfileDetailsResponse)

    
    useLayoutEffect(() => {
        if(_.isEmpty(response.data)){ 
            const config = {
                method: 'get',
                url: '/api/v1/user/profile-details',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                  }
            }
            axios(config)
            .then((res) => {
                var data = res.data
                dispatch(ProfileSettingDispatcher(data))
                setProfileDetails(res.data)
                setName(res.data['name'])
                setAddress(res.data['address'])
                setContact(res.data['phone_number'])
                setRegistrationNumber(res.data['registration_number'])
                setPersonalNumber(res.data['personal_number'])
                setServiceCategories(res.data['service_categories']) 
                var array = []
                res.data['service_categories'].map((item) => 
                    array.push({"label": item, "value": item})
                )
                setServiceCategoriesDefaultValue(array)
                setCurrencyPreferences(res.data['currency_preferences'])
                setDatePreferences(res.data['date_preferences'])
                setProfileDetailsLoading(false)
                if(res.data.hasOwnProperty('intro_video')){
                    setShowVideoForm(false)
                }
                if(res.data.hasOwnProperty('intro_text')){
                    setShowIntroForm(false)
                }
            })
            .catch((error) => {
                
            })
        }
        else {
            setProfileDetails(response.data)
            setName(response.data['name'])
            setAddress(response.data['address'])
            setContact(response.data['phone_number'])
            setRegistrationNumber(response.data['registration_number'])
            setPersonalNumber(response.data['personal_number'])
            setServiceCategories(response.data['service_categories'])
            setCurrencyPreferences(response.data['currency_preferences'])
            setDatePreferences(response.data['date_preferences'])
            setProfileDetailsLoading(false)
            if(response.data.hasOwnProperty('intro_video')){
                setShowVideoForm(false)
            }
            if(response.data.hasOwnProperty('intro_text')){
                setShowIntroForm(false)
            }
        }
        // To check if the user has linked google account 
        var config2 = {
            method: "get",
            url: "/api/v1/google-credentials-details",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            }
          }
        axios(config2)
        .then((res) => {
            setHaveGoogleCredentials(true)
        })
        .catch((error) => {
            setHaveGoogleCredentials(false)
        })
    }, [])

    useEffect(() => {
        console.log("Profile details", response.data)
    }, [profileDetails])

    const handleRemoveChatFile = (name, index) => {
        var filteredFileList = []
        var fileList = fileToSend
        var NewFileNameList = fileNameToShow
    
        for (var i = 0; i < fileList.length; i++) {
          var file = fileList[i]
          if(file.name !== name){
            filteredFileList.push(file)
          } 
        }
        NewFileNameList.splice(index, 1)
        setFileToSend(filteredFileList)
        setFileNameToShow(NewFileNameList)
      }

    // To open google consent for user authorization 
    const handleLinkGoogleAccount = () => {
        var config = {
            method: "get",
            url: "/api/v1/authorize",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
              }
        }
        axios(config)
        .then((res) => {
            window.open(res.data['auth_uri'], "_self");
        })
        .catch((error) => {
        })
    }

    // To revoke google account 
    const handleRevokeGoogleAccount = () => {
        //send revoke request 
    }
    const activeBasicInfoTab = () => {
        setActiveTab("basic_info")
    }
    const activeBillingInfoTab = () => {
        setActiveTab("billing_info")
    }
    const activeIntroTab = () => {
        setActiveTab("Intro")
    }

    // Function for the profile data edit 
    /********************************************************************/
    // Function for name field
    const handleShowNameField = (value) => {
        if(value) {
            setShowNameField(true)
        }
        else{
            setShowNameField(false)
        }
    }
    const handleName = (e) => {
        setName(e.target.value)
        setShowAlert(false)
    }
    const SubmitName = (e) => {
        e.preventDefault();
        var data = {
            "name": name
        }
        dispatch(UpdateProfileSetting(data))
        setShowNameField(false)
        setShowAlert(true)
    }

    /********************************************************************/
    // Function for address field
    const handleShowAddressField = (value) => {
        if(value) {
            setShowAddressField(true)
        }
        else{
            setShowAddressField(false)
        }
    }
    const handleAddress = (e) => {
        setAddress(e.target.value)
        setShowAlert(false)
    }
    const SubmitAddress = (e) => {
        e.preventDefault();
        var data = {
            "address": address
        }
        dispatch(UpdateProfileSetting(data))
        setShowAddressField(false)
        setShowAlert(true)
    }

    /********************************************************************/
    // Function for Contact field  
    const handleShowContactField = (value) => {
        if(value) {
            setShowContactField(true)
        }
        else{
            setShowContactField(false)
        }
    }
    const handleContact = (e) => {
        setContact(e.target.value)
        setShowAlert(false)
    }
    const SubmitContact = (e) => {
        e.preventDefault();
        var data = {
            "phone_number": contact
        }
        dispatch(UpdateProfileSetting(data))
        setShowContactField(false)
        setShowAlert(true)
    }

    /********************************************************************/
    // Function for Registration field  
    const handleShowRegistration= (value) => {
        if(value) {
            setShowRegistrationField(true)
        }
        else{
            setShowRegistrationField(false)
        }
    }
    const handleRegistration = (e) => {
        setRegistrationNumber(e.target.value)
        setShowAlert(false)
    }
    const SubmitRegistration = (e) => {
        e.preventDefault();
        var data = {
            "registration_number": registrationNumber
        }
        dispatch(UpdateProfileSetting(data))
        setShowRegistrationField(false)
        setShowAlert(true)
    }

    /********************************************************************/
    // Function for Personal Number field  
    const handleShowPersonalNumber= (value) => {
        if(value) {
            setShowPersonalNumberField(true)
        }
        else{
            setShowPersonalNumberField(false)
        }
    }
    const handlePersonalNumber = (e) => {
        setPersonalNumber(e.target.value)
        setShowAlert(false)
    }
    const SubmitPersonalNumber = (e) => {
        e.preventDefault();
        var data = {
            "personal_number": personalNumber
        }
        dispatch(UpdateProfileSetting(data))
        setShowPersonalNumberField(false)
        setShowAlert(true)
    }

    /********************************************************************/
    // Function for Services Categories
    const options = [
        {label:'Law', value:'law'},
        {label:'Accounting', value: 'account'}
    ]

    const handleServiceCategoriesChange = (e) => {
        // send the tags value to handleNewCaseRequest method
        var values = []
        if(_.isEmpty(e)){
            //
        }
        else {
            e.map((item, index) => {
                values.push(item.value)
            })
            setServiceCategories([...values])
            scToSend = values.toString()
        }
    }

    const SubmitServiceCategories = () => {
        var data = {
            "service_categories": scToSend
        }
        dispatch(UpdateProfileSetting(data))
        setShowAlert(true)
    }

    // Modal box action listener
    const OpenModalServiceCategories = (type) => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg" style={{minHeight: "15rem",  minWidth: "30rem"}}>
                    <h1 class="text-3xl text-blue-600 px-4">Edit the service categories</h1>
                    <hr class="border-gray-300 my-4" />
                    <div class= "px-4">
                        <div class="items-center text-black px-4 py-3 mb-3" role="alert">
                                <label class="block text-black text-md mb-2" for="name">
                                    Case Tags:
                                </label>
                            <CreatableSelect
                                isMulti
                                defaultValue={serviceCategoriesDefaultValue}
                                options={options}
                                onChange={(e) => handleServiceCategoriesChange(e)}
                            />
                        </div>
                        <div class="flex justify-end mx-3 my-4">
                            <button 
                                onClick={onClose} 
                                class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    SubmitServiceCategories();
                                    onClose();
                                }}
                                class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
                            >
                                Update it!
                            </button>
                        </div>
                    </div>
                </div>
              )
            },
            title: 'Confirm to submit'
        })
    }

    /********************************************************************/
    // Function for Preferences
    // Modal box action listener

    const handleCurrencyPreferences = e => {
        //setCurrencyPreferences(e.target.value)
        currencyPreferencesToSend = e.target.value
    }

    const handleDatePreferences = e => {
        //setCurrencyPreferences(e.target.value)
        datePreferencesToSend = e.target.value
    }

    const submitDatePreferences = () => {
        var data = {
            "date_preferences": datePreferencesToSend
        }
        dispatch(UpdateProfileSetting(data))
        setShowAlert(true)
        setDatePreferences(datePreferencesToSend)
    }

    const submitCurrencyPreferences = () => {
        var data = {
            "currency_preferences": currencyPreferencesToSend
        }
        dispatch(UpdateProfileSetting(data))
        setShowAlert(true)
        setCurrencyPreferences(currencyPreferencesToSend)
    }

    const OpenVideoUploader = () => {
        setShowVideoForm(true)
    }

    const OpenTextUploader = () => {
        setShowIntroForm(true)
    }

    const OpenModalDatePreferences = (type) => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg" style={{minHeight: "15rem", minWidth: "30rem"}}>
                    <h1 class="text-3xl text-blue-600 px-4">Edit the preferences</h1>
                    <hr class="border-gray-300 my-4" />
                    <div class= "px-4">
                        <div class="items-center text-black px-4 py-3 mb-3" role="alert">
                                <label class="block text-black text-md mb-2" for="name">
                                    Date Preferences
                                </label>
                                <select
                                    class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    defaultValue={datePreferences}
                                    onChange={e => handleDatePreferences(e)}
                                >
                                    <option value="ymd">YYYY-MM-DD</option>
                                    <option value="dmy">DD-MM-YYYY</option>
                                    <option value="mdy">MM-DD-YYYY</option>
                                </select>
                        </div>
                        <div class="flex justify-end mx-3">
                            <button 
                                onClick={onClose} 
                                class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    submitDatePreferences();
                                    onClose();
                                }}
                                class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
                            >
                                Update it!
                            </button>
                        </div>
                    </div>
                </div>
              )
            },
            title: 'Confirm to submit'
        })
    }

    const OpenModalCurrencyPreferences = (type) => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg" style={{minHeight: "15rem", minWidth: "30rem"}}>
                    <h1 class="text-3xl text-blue-600 px-4">Edit the currency preferences</h1>
                    <hr class="border-gray-300 my-4" />
                    <div class= "px-4">
                        <div class="items-center text-black px-4 py-3 mb-3" role="alert">
                            <label class="block text-black text-md mb-2" for="name">
                                Currency Preferences
                            </label>
                            <select
                                class="shadow appearance-none border rounded w-full mb-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                defaultValue={currencyPreferences}
                                onChange={e => handleCurrencyPreferences(e)}
                            >
                                <option value="usd">USD</option>
                                <option value="pound">POUND</option>
                                <option value="euro">EURO</option>
                            </select>
                        </div>
                        <div class="flex justify-end mx-3">
                            <button 
                                onClick={onClose} 
                                class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    submitCurrencyPreferences();
                                    onClose();
                                }}
                                class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
                            >
                                Update it!
                            </button>
                        </div>
                    </div>
                </div>
              )
            },
            title: 'Confirm to submit'
        })
    }

    /********************************************************************/
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
        // loop through files
        var files = e.target.files
        var filesNameList = [] 
        for (var i = 0; i < files.length; i++) {
        // get item
        var file = files.item(i);
        filesNameList.push(file.name)
        }
        setFileNameToShow(filesNameList)
    }

    const handleIntroTextChange = (e) => {
        setIntroText(e.target.value)
    }

    const SubmitIntroduction = () => {
        // submit the dispatch action here
        var formData = new FormData();
        for (let file of fileToSend) {
            formData.append(file.name, file);
            }
        formData.append("intro_text", IntroText)
        dispatch(UpdateProfileIntroduction(formData))
        setShowAlert(true)
        const config = {
            method: 'get',
            url: '/api/v1/user/profile-details',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        axios(config)
        .then((res) => {
            var data = res.data
            dispatch(ProfileSettingDispatcher(data))
            setProfileDetails(res.data)
            setName(res.data['name'])
            setAddress(res.data['address'])
            setContact(res.data['phone_number'])
            setRegistrationNumber(res.data['registration_number'])
            setPersonalNumber(res.data['personal_number'])
            setServiceCategories(res.data['service_categories']) 
            var array = []
            res.data['service_categories'].map((item) => 
                array.push({"label": item, "value": item})
            )
            setServiceCategoriesDefaultValue(array)
            setCurrencyPreferences(res.data['currency_preferences'])
            setDatePreferences(res.data['date_preferences'])
            setProfileDetailsLoading(false)
            if(res.data.hasOwnProperty('intro_video')){
                setShowVideoForm(false)
            }
            if(res.data.hasOwnProperty('intro_text')){
                setShowIntroForm(false)
            }
        })
        .catch((error) => {
            
        })
    }

    const showData = () => {
        if(response.loading){
            return (
                <div class="">
                    <PulseLoader
                        size={10}
                        color={"#6DADE3"}
                        loading={true}
                    />
                </div>
            )
        }
        return (
            <div>
                <button 
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    onClick={() => SubmitIntroduction()}
                >
                    Submit 
                </button>
            </div>
        )

    }

    return (
        <div>
            <div class="px-4 sm:px-8">
            {
                showAlert ? 
                <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                    <p class="font-bold">Profile Details Updated successfully</p>
                </div>
                :
                ""
            }
                {
                    profileDetailsLoading ? 
                    <div class="animate-pulse flex space-x-4">
                        <div class="w-4/5">
                            <div class="flex"> 
                                <img style={{height: '7em'}} class="rounded-full" src={EmpAvatar} alt="" />
                            </div>
                        </div>
                        <div class="w-1/5 flex justify-end">
                        </div>
                    </div>
                    :
                    <div class="flex">
                        <div class="w-5/5">
                            <div class="flex"> 
                                <img style={{height: '7em'}} class="rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80" alt="" />
                                <div class="ml-5 y-5" style={{marginTop: "1.5em", marginLeft: "2em"}}>
                                    {
                                        showNameField ? 
                                        <div class="flex">
                                            <div>
                                                <form onSubmit={SubmitName}>
                                                    <input 
                                                        class="shadow appearance-none border rounded w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                        id="label" 
                                                        type="text"
                                                        defaultValue={name}
                                                        onChange={(e) => handleName(e)}
                                                    />
                                                </form>
                                            </div>
                                            <div class="mt-3">
                                                <button class="focus:outline-none" onClick={() => handleShowNameField(false)}>
                                                    <p class="text-red-400 mx-6 text-lg"><VscClose /></p>
                                                </button>
                                            </div>
                                        </div>
                                        :
                                        <div class="flex">
                                            <h1 class="text-2xl font-bold">
                                                {name}
                                            </h1>
                                            <button class="focus:outline-none ml-3" onClick={() => handleShowNameField(true)}>
                                                <p class="text-blue-400 mx-6 my-3"><FaEdit /></p>
                                            </button>
                                        </div>
                                    } 
                                    <h1 class="text-1xl my-1">{profileDetails['email']}</h1>
                                    <p class="flex mt-8 text-base text-gray-600">
                                        ADDRESS 
                                        {
                                            showAddressField ? 
                                            <form onSubmit={SubmitAddress}>
                                                <input 
                                                    class="shadow appearance-none border rounded ml-6 w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="label" 
                                                    type="text"
                                                    defaultValue={address}
                                                    onChange={(e) => handleAddress(e)}
                                                />
                                            </form>
                                            :
                                            <p class="ml-6 text-base text-black">{address}</p> 
                                        }
                                        {
                                            showAddressField ? 
                                            <button class="focus:outline-none" onClick={() => handleShowAddressField(false)}>
                                                <p class="text-red-400 mx-6 text-lg"><VscClose /></p>
                                            </button>
                                            :
                                            <button class="focus:outline-none ml-3 mr-10 " onClick={() => handleShowAddressField(true)}>
                                                <p class="text-blue-400 mx-6"><FaEdit /></p>
                                            </button>
                                        }
                                        
                                        JOINED ON<p class="ml-6 text-base text-black">{profileDetails['createdDate']}</p>
                                        <span class="focus:outline-none ml-3 mr-10 ">
                                            <p class="text-blue-400 mx-6"></p>
                                        </span>
                                        CONTACT NUMBER 
                                        {
                                            showContactField ? 
                                            <form onSubmit={SubmitContact}>
                                                <input 
                                                    class="shadow appearance-none border rounded ml-6 w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="label" 
                                                    type="text"
                                                    defaultValue={contact}
                                                    onChange={(e) => handleContact(e)}
                                                />
                                            </form>
                                            :
                                            <p class="ml-6 text-base text-black">{contact}</p> 
                                        }
                                        {
                                            showContactField ? 
                                            <button class="focus:outline-none" onClick={() => handleShowContactField(false)}>
                                                <p class="text-red-400 mx-6 text-lg"><VscClose /></p>
                                            </button>
                                            :
                                            <button class="focus:outline-none ml-3 mr-10 " onClick={() => handleShowContactField(true)}>
                                                <p class="text-blue-400 mx-6"><FaEdit /></p>
                                            </button>
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="w-1/5 flex justify-end">
                        </div>
                    </div>
                }
                <div class="py-8">
                    <div class="pt-8 pb-5">
                        {
                            activeTab == "basic_info" ? 
                                <ul class="flex border-b">
                                    <li class="-mb-px mr-1">
                                        <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeBasicInfoTab()}>Basic Information</button>
                                    </li>
                                    <li class="mr-1">
                                        <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeBillingInfoTab()}>Billing Information</button>
                                    </li>
                                    <li class="mr-1">
                                        <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeIntroTab()}>Introduction</button>
                                    </li>
                                </ul>
                            :
                            activeTab == "billing_info" ?
                                <ul class="flex border-b">
                                    <li class="mr-1">
                                        <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeBasicInfoTab()}>Basic Information</button>
                                    </li>
                                    <li class="-mb-px mr-1">
                                        <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeBillingInfoTab()}>Billing Information</button>
                                    </li>
                                    <li class="mr-1">
                                        <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeIntroTab()}>Introduction</button>
                                    </li>
                                </ul>
                            :
                                <ul class="flex border-b">
                                    <li class="mr-1">
                                        <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeBasicInfoTab()}>Basic Information</button>
                                    </li>
                                    <li class="mr-1">
                                        <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeBillingInfoTab()}>Billing Information</button>
                                    </li>
                                    <li class="-mb-px mr-1">
                                        <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeIntroTab()}>Introduction</button>
                                    </li>
                                </ul>
                        }
                    </div>
                    <div>
                        {
                            activeTab == "basic_info" ? 
                            <div style={{marginLeft: "0.5rem"}}>
                                <div class="mb-8">
                                    <div class="flex items-center">
                                        <div class="w-1/5">
                                            <p class="text-base text-gray-600">
                                                SERVICE CATEGORIES
                                            </p>
                                        </div>
                                        <div class="w-3/5">
                                            {
                                                !_.isEmpty(serviceCategories) ? 
                                                    serviceCategories.map((item) => {
                                                        return(
                                                            <span
                                                                class="relative inline-block px-3 py-1 mr-4 font-semibold text-gray-900 leading-tight"
                                                            >
                                                                <span
                                                                aria-hidden
                                                                class="absolute inset-0 bg-gray-300 opacity-50"
                                                                ></span>
                                                                <span class="relative">{item}</span>
                                                            </span>
                                                        )
                                                    })
                                                :
                                                ""
                                            }
                                            <button class="focus:outline-none my-4" onClick={() => OpenModalServiceCategories()}>
                                                <p class="text-blue-400 mx-6"><FaEdit /></p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                { !_.isEmpty(profileDetails['registration_number']) ? 
                                    <div class="mt-8 mb-8">
                                        {
                                            showRegistrationField ? 
                                            <div class="flex">
                                                <div class="w-1/5">
                                                    <p class="text-base text-gray-600">
                                                        REGISTRATION NUMBER 
                                                    </p>
                                                </div>
                                                <div>
                                                    <form onSubmit={SubmitRegistration}>
                                                        <input 
                                                            class="shadow appearance-none border rounded w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                            id="label" 
                                                            type="text"
                                                            defaultValue={registrationNumber}
                                                            onChange={(e) => handleRegistration(e)}
                                                        />
                                                    </form>
                                                </div>
                                                <div class="mt-3">
                                                    <button class="focus:outline-none" onClick={() => handleShowRegistration(false)}>
                                                        <p class="text-red-400 mx-6 text-lg"><VscClose /></p>
                                                    </button>
                                                </div>
                                            </div>
                                            :
                                            <div class="flex items-center">
                                                <div class="w-1/5">
                                                    <p class="text-base text-gray-600">
                                                        REGISTRATION NUMBER 
                                                    </p>
                                                </div>
                                                <div class="w-3/5">
                                                    {registrationNumber}
                                                    <button class="focus:outline-none ml-3 my-4" onClick={() => handleShowRegistration(true)}>
                                                        <p class="text-blue-400 mx-6"><FaEdit /></p>
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    :
                                    ""
                                }
                                { !_.isEmpty(profileDetails['personal_number']) ? 
                                    <div class="mt-8 mb-8">
                                        {
                                            showPersonalNumberField ? 
                                            <div class="flex">
                                                <div class="w-1/5">
                                                    <p class="text-base text-gray-600">
                                                        PERSONAL NUMBER 
                                                    </p>
                                                </div>
                                                <div>
                                                    <form onSubmit={SubmitPersonalNumber}>
                                                        <input 
                                                            class="shadow appearance-none border rounded w-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                            id="label" 
                                                            type="text"
                                                            defaultValue={personalNumber}
                                                            onChange={(e) => handlePersonalNumber(e)}
                                                        />
                                                    </form>
                                                </div>
                                                <div class="mt-3">
                                                    <button class="focus:outline-none" onClick={() => handleShowPersonalNumber(false)}>
                                                        <p class="text-red-400 mx-6 text-lg"><VscClose /></p>
                                                    </button>
                                                </div>
                                            </div>
                                            :
                                            <div class="flex items-center">
                                                <div class="w-1/5">
                                                    <p class="text-base text-gray-600">
                                                        PERSONAL NUMBER 
                                                    </p>
                                                </div>
                                                <div class="w-3/5">
                                                    {personalNumber}
                                                    <button class="focus:outline-none ml-3 my-4" onClick={() => handleShowPersonalNumber(true)}>
                                                        <p class="text-blue-400 mx-6"><FaEdit /></p>
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    :
                                    ""
                                }
                                <div class="mt-8 mb-8">
                                    <div class="flex items-center">
                                        <div class="w-1/5">
                                            <p class="text-base text-gray-600">
                                                DATE FORMAT 
                                            </p>
                                        </div>
                                        <div class="w-3/5">
                                            {!_.isEmpty(datePreferences) ? datePreferences == "dmy" ? "DD-MM-YYYY" : datePreferences == "mdy" ? "MM-DD-YYYY" : "YYYY-MM-DD" : "NOT SET"}
                                            <button class="focus:outline-none ml-3 my-4" onClick={() => OpenModalDatePreferences()}>
                                                <p class="text-blue-400 mx-6"><FaEdit /></p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-8 mb-8">
                                    <div class="flex items-center">
                                        <div class="w-1/5">
                                            <p class="text-base text-gray-600">
                                                CURRENCY PREFERENCES
                                            </p>
                                        </div>
                                        <div class="w-3/5">
                                            {!_.isEmpty(currencyPreferences) ? currencyPreferences == "usd" ? "USD": currencyPreferences == "pound" ? "POUND" : "EURO" : "NOT SET"}
                                            <button class="focus:outline-none ml-3 my-4" onClick={() => OpenModalCurrencyPreferences()}>
                                                <p class="text-blue-400 mx-6"><FaEdit /></p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-8 mb-8">
                                    {
                                        haveGoogleCredentials ? 
                                        <div class="flex items-center">
                                            <div class="w-1/5">
                                                <p class="text-base text-gray-600">
                                                    LINKED WITH GOOGLE
                                                </p>
                                            </div>
                                            <div class="w-3/5">
                                                <button class=" mr-10 text-base text-blue-500" onClick = {() => handleRevokeGoogleAccount()}>REVOKE?</button>
                                            </div>
                                        </div>
                                        :
                                        <div class="flex items-center">
                                            <div class="w-1/5">
                                                <p class="text-base text-gray-600">
                                                    NOT LINKED WITH GOOGLE
                                                </p>
                                            </div>
                                            <div class="w-3/5">
                                                <button class=" mr-10 text-base text-blue-500" onClick = {() => handleLinkGoogleAccount()}>LINK?</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            :
                            activeTab == "billing_info" ?
                            "billing"
                            :
                            <div class="flex mb-4">
                                <div class="w-3/5 ml-5">
                                        <div class="mt-2 mb-3" >
                                        {
                                            !showVideoForm ? 
                                            <span>
                                                <div class="flex items-center">
                                                    <div class="w-2/5">
                                                        <label class="block text-gray-700 text-sm" for="password">
                                                            Introduction Video
                                                        </label>
                                                    </div>
                                                    <div class="w-3/5">
                                                        <button class="focus:outline-none ml-3 mb-5" onClick={() => OpenVideoUploader()}>
                                                            <p class="text-blue-400 mx-6"><FaEdit /></p>
                                                        </button>
                                                    </div>
                                                </div>
                                                <VideoPlayer source={profileDetails['intro_video']} />
                                            </span>
                                            :
                                            <div>
                                                <label class="block text-gray-700 text-sm mb-1" for="password">
                                                    Introduction Video
                                                </label>
                                                <label for="allfilesMessage" style={{ cursor: "pointer" }}>
                                                    <a>
                                                        <em class="fa fa-upload"></em>{" "}
                                                        <span class="bg-gray-200 border border-gray-100 hover:bg-grey text-grey-darkest py-2 px-4 rounded inline-flex items-center">
                                                            <p class="text-lg"><MdFileUpload /></p>
                                                            <span> &nbsp;Attach Files</span>
                                                        </span>
                                                    </a>
                                                </label>
                                                <input
                                                    type="file"
                                                    name="allfilesMessage"
                                                    id="allfilesMessage"
                                                    style={{ display: "none" }}
                                                    onChange={e => handleFileUpload(e)}
                                                    multiple
                                                    accept="video/mp4,video/x-m4v,video/*"    
                                                />
                                                {
                                                    !_.isEmpty(fileNameToShow) ? 
                                                        fileNameToShow.map((item, index) => {
                                                            return(
                                                                <div class="flex mx-3 my-5">
                                                                    <div class="w-3/12">
                                                                        <p>{item}</p>
                                                                    </div>
                                                                    <div class="w-1/12">
                                                                        <p class="text-red-400 mx-6 text-lg" onClick={() => handleRemoveChatFile(item, index)}><VscClose /></p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    :
                                                    ""
                                                }
                                            </div>
                                        }
                                        </div>

                                        <div class="mt-2 mb-3" >
                                            {
                                                !showIntroForm ? 
                                                <span>
                                                    <div class="flex items-center">
                                                        <div class="w-2/5">
                                                            <label class="block text-gray-700 text-sm" for="password">
                                                                Introduction Description
                                                            </label>
                                                        </div>
                                                        <div class="w-3/5">
                                                            <button class="focus:outline-none ml-3 mb-5" onClick={() => OpenTextUploader()}>
                                                                <p class="text-blue-400 mx-6"><FaEdit /></p>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p>{profileDetails['intro_text']}</p>
                                                    </div>
                                                </span>
                                                :
                                                <span>
                                                    <label class="block text-gray-700 text-sm mb-2" for="password">
                                                        Introduction Text
                                                    </label>
                                                    <div>
                                                        <textarea 
                                                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                            id="title" 
                                                            type="text"
                                                            style={{minHeight: "12em"}}
                                                            onChange= {(e) => handleIntroTextChange(e)}
                                                        />
                                                    </div>
                                                </span>
                                            }
                                        </div>
                                        {
                                            showIntroForm || showVideoForm ?
                                            <div class="flex justify-start my-5" >
                                                {showData()}
                                            </div>
                                            :
                                            ""
                                        }
                                </div>
                            </div>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileSetting