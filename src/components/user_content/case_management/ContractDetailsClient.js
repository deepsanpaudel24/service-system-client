import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";
import { ContractDetailsStorageDispatcher } from "../../actions/contract_management/ContractDetailsStorageAction";
import pdfLogo from "../../../images/pdf-Icon.png";
import docxLogo from "../../../images/docx-Icon.png";
import dataFileLogo from "../../../images/dataFile-Icon.png";
import imageLogo from "../../../images/image-Icon.png";
import { MdFileDownload } from "react-icons/md";
import folderEmptyIcon from "../../../images/folder_empty.png";

const ContractDetailsClient = (props) => {
    const [ServerDomain, setServerDomain] = useState("http://127.0.0.1:5000/")
    const [paperDetails, SetPaperDetails] = useState([])
    const [activeTab, setActiveTab] = useState("tab1")
    const [pageLoading, setPageLoading] = useState(true)
    const [fileUploaderLoading, setFileUploaderLoading] = useState(false)
    const [fileUploaderConfirm, setFileUploaderConfirm] = useState("")    
    const [fileToSend, setFileToSend] = useState([]);

    const dispatch = useDispatch()
    const response = useSelector(state => state.ContractDetailsStorageResponse)
    
    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'get',
            url: '/api/v1/contract/' + urlvalues[3],
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }
        if(_.isEmpty(response.data) ){
            axios(config)
            .then((res) => {
                SetPaperDetails(res.data)
                dispatch(ContractDetailsStorageDispatcher(res.data))
                setPageLoading(false)
            })
            .catch((error) => {
                setPageLoading(false)
            })  
        }
        else {
            if(response.data['_id'].$oid == urlvalues[3]) {
                SetPaperDetails(response.data)
                setPageLoading(false)
            }
            else {
                axios(config)
                .then((res) => {
                    SetPaperDetails(res.data)
                    dispatch(ContractDetailsStorageDispatcher(res.data))
                    setPageLoading(false)
                })
                .catch((error) => {
                    setPageLoading(false)
                })  
            }        
        }
    }, [])

    useEffect(() => {

    }, [paperDetails])

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

    const submitFileUpload = () => {
        // send the put request to contracts collection in the database with the Id
        // then update the collection with the attributes signed files 
        setFileUploaderLoading(true)
        var string = document.location.pathname;
        var urlvalues = string.toString().split("/");
        if(_.isEmpty(fileToSend)){
            console.log("Please Upload the required files")
        }
        else {
            //send the case request to backend.
            var formData = new FormData();
            for (let file of fileToSend) {
                formData.append(file.name, file);
              }
            const config = {
                method: 'put',
                url: '/api/v1/contract/' + urlvalues[3],
                headers: { 
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                data: formData
            }
            axios(config)
            .then((res) => {
                setFileUploaderLoading(false)
                setFileUploaderConfirm("Files uploaded sucessfully")
            })
            .catch((error) => {
                setFileUploaderLoading(false)
                setFileUploaderConfirm("Files uploaded failed")
            })  
        }
    }

    const activeTabOne = () => {
        setActiveTab("tab1")
    }

    const activeTabTwo = () => {
        setActiveTab("tab2")
    }


    return (
        <div>
            <div class="px-4 sm:px-8">
                {
                    pageLoading ? 
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
                        <div class="max-w-sm w-full lg:max-w-full lg:flex">
                            <div class="border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                                <div class="mb-8">
                                    <div class="flex">
                                        <div class="w-5/5">
                                            <p class="text-4xl my-3" style={{ textAlign: "left" }}>
                                                {paperDetails['title']}
                                            </p>
                                        </div>
                                    </div>
                                    <p class="flex my-3 text-base text-gray-600">
                                        CONTRACT SENT ON
                                        <p class="ml-3 mr-10 text-base text-black">
                                            {paperDetails['uploadDate']}
                                        </p>
                                    </p>
                                    <p
                                        class="text-gray-700 text-base mt-3"
                                        style={{ marginTop: "3rem", "textAlign": "justify", "text-justify": "inter-word" }}
                                    >
                                        {paperDetails['desc']}
                                    </p>
                                </div>
                                {
                                    activeTab == "tab1" ?
                                        <div class="pt-8 pb-5">
                                            <ul class="flex border-b">
                                                <li class="-mb-px mr-1">
                                                    <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeTabOne()}>Contract Papers</button>
                                                </li>
                                                <li class="mr-1">
                                                    <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeTabTwo()}>Upload Signed Paper</button>
                                                </li>
                                            </ul>
                                        </div>
                                    :
                                        <div class="pt-8 pb-5">
                                            <ul class="flex border-b">
                                                <li class="mr-1">
                                                    <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeTabOne()}>Contract Papers</button>
                                                </li>
                                                <li class="-mb-px mr-1">
                                                    <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeTabTwo()}>Upload Signed Paper</button>
                                                </li>
                                            </ul>
                                        </div>
                                }
                                {
                                activeTab == "tab1" ? 
                                <div>
                                    <p class="my-4">You can download the documents below and upload the signed ones.</p>
                                    <div class="flex gap-6 mt-3">
                                        {
                                        paperDetails.files.map((item) => {
                                            var filename = item.split("/").slice(-1)[0]
                                            if(filename.length < 12){
                                            var display_name = filename
                                            }
                                            else {
                                            var display_name = filename.slice(0,12) + " ..."
                                            }
                                            var extension = filename.split(".").slice(-1)[0].toLowerCase()
                                            if(extension == "pdf"){
                                            return(
                                                <div
                                                class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
                                                style={{ maxWidth: "15rem" }}
                                                >
                                                <div
                                                    class="inline-flex overflow-hidden"
                                                    style={{ height: "10rem", width: "10rem" }}
                                                >
                                                    <img
                                                    src={pdfLogo}
                                                    alt=""
                                                    class="h-full w-full"
                                                    style={{ opacity: "0.5" }}
                                                    />
                                                </div>
                                                <div class="flex mt-4">
                                                    <div class="w-5/6">
                                                    <a href={ServerDomain + item} target="blank"><p class="text-md font-medium mt-2">{display_name} </p></a>
                                                    </div>
                                                    <div class="w-1/6">
                                                    <button class="focus:outline-none">
                                                        <div class="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center bg-white text-gray-700 text-xl hover:bg-gray-200 hover:text-gray-600">
                                                        <MdFileDownload />
                                                        </div>
                                                    </button>
                                                    </div>
                                                </div>
                                                </div>
                                            )
                                            }
                                            else if(["msword", "doc", "docx" ,"vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(extension)){
                                            return(
                                                <div
                                                class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
                                                style={{ maxWidth: "15rem" }}
                                                >
                                                <div
                                                    class="inline-flex overflow-hidden"
                                                    style={{ height: "10rem", width: "10rem" }}
                                                >
                                                    <img
                                                    src={docxLogo}
                                                    alt=""
                                                    class="h-full w-full"
                                                    style={{ opacity: "0.5" }}
                                                    />
                                                </div>
                                                <div class="flex mt-4">
                                                    <div class="w-5/6">
                                                    <a href={ServerDomain + item} target="blank"><p class="text-md font-medium mt-2">{display_name}</p></a>
                                                    </div>
                                                    <div class="w-1/6">
                                                    <button class="focus:outline-none">
                                                        <div class="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center bg-white text-gray-700 text-xl hover:bg-gray-200 hover:text-gray-600">
                                                        <MdFileDownload />
                                                        </div>
                                                    </button>
                                                    </div>
                                                </div>
                                                </div>
                                            )
                                            }
                                            else if(["jpeg", "png", "jpg", "gif"].includes(extension)){
                                            return(
                                                <div
                                                class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
                                                style={{ maxWidth: "15rem" }}
                                                >
                                                <div
                                                    class="inline-flex overflow-hidden"
                                                    style={{ height: "10rem", width: "10rem" }}
                                                >
                                                    <img
                                                    src={imageLogo}
                                                    alt=""
                                                    class="h-full w-full"
                                                    style={{ opacity: "0.5" }}
                                                    />
                                                </div>
                                                <div class="flex mt-4">
                                                    <div class="w-5/6">
                                                    <a href={ServerDomain + item} target="blank"><p class="text-md font-medium mt-2">{display_name} </p></a>
                                                    </div>
                                                    <div class="w-1/6">
                                                    <button class="focus:outline-none">
                                                        <div class="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center bg-white text-gray-700 text-xl hover:bg-gray-200 hover:text-gray-600">
                                                        <MdFileDownload />
                                                        </div>
                                                    </button>
                                                    </div>
                                                </div>
                                                </div>
                                            )
                                            }
                                            else if(["csv", "xml", "xls", "xlsm", "xlsx"].includes(extension)){
                                            return(
                                                <div
                                                class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
                                                style={{ maxWidth: "15rem" }}
                                                >
                                                <div
                                                    class="inline-flex overflow-hidden"
                                                    style={{ height: "10rem", width: "10rem" }}
                                                >
                                                    <img
                                                    src={dataFileLogo}
                                                    alt=""
                                                    class="h-full w-full"
                                                    style={{ opacity: "0.5" }}
                                                    />
                                                </div>
                                                <div class="flex mt-4">
                                                    <div class="w-5/6">
                                                    <a href={ServerDomain + item} target="blank"><p class="text-md font-medium mt-2">{display_name} </p></a>
                                                    </div>
                                                    <div class="w-1/6">
                                                    <button class="focus:outline-none">
                                                        <div class="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center bg-white text-gray-700 text-xl hover:bg-gray-200 hover:text-gray-600">
                                                        <MdFileDownload />
                                                        </div>
                                                    </button>
                                                    </div>
                                                </div>
                                                </div>
                                            )
                                            }
                                        })
                                        }
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        {
                                            fileUploaderLoading ? 
                                            <div>
                                                <PulseLoader
                                                    size={10}
                                                    color={"#6DADE3"}
                                                    loading={true}
                                                />
                                            </div>
                                            :
                                            <div>
                                                <input 
                                                    class="rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="budget" 
                                                    type="file"
                                                    multiple
                                                    onChange={e => handleFileUpload(e)}
                                                    accept="image/png, image/jpeg,.pdf,.doc,.docx,.xml,.txt,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                />
                                                <button 
                                                    class="hover:bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                                                    type="button" 
                                                    style={{backgroundColor: "#3490ff"}}
                                                    onClick={() => submitFileUpload()}
                                                >
                                                    Upload
                                                </button>
                                            </div>
                                        }
                                        {
                                            paperDetails.hasOwnProperty('signedFiles') ? 
                                            <div>
                                                <p class="my-5">Service provider can now view your signed documents.</p>
                                                <div class="flex gap-6 mt-3">
                                                {
                                                paperDetails.signedFiles.map((item) => {
                                                    var filename = item.split("/").slice(-1)[0]
                                                    if(filename.length < 12){
                                                    var display_name = filename
                                                    }
                                                    else {
                                                    var display_name = filename.slice(0,12) + " ..."
                                                    }
                                                    var extension = filename.split(".").slice(-1)[0].toLowerCase()
                                                    if(extension == "pdf"){
                                                    return(
                                                        <div
                                                        class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
                                                        style={{ maxWidth: "15rem" }}
                                                        >
                                                        <div
                                                            class="inline-flex overflow-hidden"
                                                            style={{ height: "10rem", width: "10rem" }}
                                                        >
                                                            <img
                                                            src={pdfLogo}
                                                            alt=""
                                                            class="h-full w-full"
                                                            style={{ opacity: "0.5" }}
                                                            />
                                                        </div>
                                                        <div class="flex mt-4">
                                                            <div class="w-5/6">
                                                            <a href={ServerDomain + item} target="blank"><p class="text-md font-medium mt-2">{display_name} </p></a>
                                                            </div>
                                                            <div class="w-1/6">
                                                            <button class="focus:outline-none">
                                                                <div class="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center bg-white text-gray-700 text-xl hover:bg-gray-200 hover:text-gray-600">
                                                                <MdFileDownload />
                                                                </div>
                                                            </button>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    )
                                                    }
                                                    else if(["msword", "doc", "docx" ,"vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(extension)){
                                                    return(
                                                        <div
                                                        class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
                                                        style={{ maxWidth: "15rem" }}
                                                        >
                                                        <div
                                                            class="inline-flex overflow-hidden"
                                                            style={{ height: "10rem", width: "10rem" }}
                                                        >
                                                            <img
                                                            src={docxLogo}
                                                            alt=""
                                                            class="h-full w-full"
                                                            style={{ opacity: "0.5" }}
                                                            />
                                                        </div>
                                                        <div class="flex mt-4">
                                                            <div class="w-5/6">
                                                            <a href={ServerDomain + item} target="blank"><p class="text-md font-medium mt-2">{display_name}</p></a>
                                                            </div>
                                                            <div class="w-1/6">
                                                            <button class="focus:outline-none">
                                                                <div class="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center bg-white text-gray-700 text-xl hover:bg-gray-200 hover:text-gray-600">
                                                                <MdFileDownload />
                                                                </div>
                                                            </button>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    )
                                                    }
                                                    else if(["jpeg", "png", "jpg", "gif"].includes(extension)){
                                                    return(
                                                        <div
                                                        class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
                                                        style={{ maxWidth: "15rem" }}
                                                        >
                                                        <div
                                                            class="inline-flex overflow-hidden"
                                                            style={{ height: "10rem", width: "10rem" }}
                                                        >
                                                            <img
                                                            src={imageLogo}
                                                            alt=""
                                                            class="h-full w-full"
                                                            style={{ opacity: "0.5" }}
                                                            />
                                                        </div>
                                                        <div class="flex mt-4">
                                                            <div class="w-5/6">
                                                            <a href={ServerDomain + item} target="blank"><p class="text-md font-medium mt-2">{display_name} </p></a>
                                                            </div>
                                                            <div class="w-1/6">
                                                            <button class="focus:outline-none">
                                                                <div class="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center bg-white text-gray-700 text-xl hover:bg-gray-200 hover:text-gray-600">
                                                                <MdFileDownload />
                                                                </div>
                                                            </button>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    )
                                                    }
                                                    else if(["csv", "xml", "xls", "xlsm", "xlsx"].includes(extension)){
                                                    return(
                                                        <div
                                                        class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
                                                        style={{ maxWidth: "15rem" }}
                                                        >
                                                        <div
                                                            class="inline-flex overflow-hidden"
                                                            style={{ height: "10rem", width: "10rem" }}
                                                        >
                                                            <img
                                                            src={dataFileLogo}
                                                            alt=""
                                                            class="h-full w-full"
                                                            style={{ opacity: "0.5" }}
                                                            />
                                                        </div>
                                                        <div class="flex mt-4">
                                                            <div class="w-5/6">
                                                            <a href={ServerDomain + item} target="blank"><p class="text-md font-medium mt-2">{display_name} </p></a>
                                                            </div>
                                                            <div class="w-1/6">
                                                            <button class="focus:outline-none">
                                                                <div class="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center bg-white text-gray-700 text-xl hover:bg-gray-200 hover:text-gray-600">
                                                                <MdFileDownload />
                                                                </div>
                                                            </button>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    )
                                                    }
                                                })
                                                }
                                                </div>
                                            </div>
                                            :
                                            <div class="mt-6">
                                                <p class="mx-3">No signed papers has been uploded yet. </p>
                                                <img src={folderEmptyIcon} style={{height: "90%", width: "50%"}}/>
                                            </div>
                                        }
                                        
                                        
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default ContractDetailsClient