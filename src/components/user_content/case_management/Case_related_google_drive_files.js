import React, {useState, useLayoutEffect, useEffect} from "react";
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import docsIcon from "../../../images/google_docs_icon.png";
import slidesIcon from "../../../images/google_slides_icon.png";
import spreadsheetIcon from "../../../images/google_sheets_icon.png";
import folderEmptyIcon from "../../../images/folder_empty.png";
import {PulseLoader} from "react-spinners";
import {Link} from "react-router-dom";

const GoogleDriveRelatedFiles = (props) => {
    const [googleFileCreateLoading, setGoogleFileCreateLoading] = useState(false)
    const [googleAccountLinked, setGoogleAccountLinked] = useState(false)
    const [fileName, setFileName] = useState("")
    const [googleFiles, setGoogleFiles] = useState([])
    const [googleFilesLoading, setGoogleFilesLoading] = useState(true)
    const {caseTitle} = props
    const {userName} = props

    var formFileName = ""

    // To check if the user has google credentials already saved 
    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        var config = {
            method: "get",
            url: "/api/v1/google-credentials-details",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            }
          }
          axios(config)
          .then((res) => {
            setGoogleAccountLinked(true)
            var config3 = {
                method: "get",
                url: "/api/v1/google-fetch-files/" + caseTitle.slice(0,25) +  "-" + urlvalues[3],
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("access_token"),
                }
              }
            axios(config3)
            .then((resp) => {
                setGoogleFiles(resp.data['files'])
                setGoogleFilesLoading(false)
                console.log('response from google-fetch-files list', resp.data['files'])
                console.log('response from google-fetch-files', resp.data['files'][0]['id'])
                
            })
            .catch((error) => {
                console.log("error from google-fetch-files", error.response)
                setGoogleFilesLoading(false)
            })
          })
          .catch((error) => {
            setGoogleAccountLinked(false)
            setGoogleFilesLoading(false)
          })
            
      }, []);
    
    useEffect(() => {}, [googleAccountLinked]);    
    
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

    const handleFilename = (e) => {
        formFileName = e.target.value
    }

    const handleCreateFile = (fileType) => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        setGoogleFileCreateLoading(true)
        setFileName(formFileName)
        var data = {
            "folder_name": caseTitle.slice(0,25) +  "-" + urlvalues[3],
            "file_type": fileType,
            "file_name": formFileName
        }
        var config = {
            method: "post",
            url: "/api/v1/google-create-file",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
              },
            data : data
        }
        axios(config)
        .then((res) => {
            setGoogleFileCreateLoading(false)
            window.open(res.data['redirect_to'],"_self");
        })
        .catch((error) => {
            setGoogleFileCreateLoading(false)
            console.log(error.response)
        })
    }

    // Modal box action listener
    const OpenModalCreateGoogleFile = (type) => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg">
                    {
                        type == "document" ?
                            <div class="flex px-4">
                                <img class="w-12 h-12"
                                    src={docsIcon}
                                    alt="" 
                                />
                                <h1 class="text-3xl text-blue-600 px-4">Create {type}</h1>
                            </div>
                        :
                        type == "presentation" ?
                            <div class="flex px-4">
                                <img class="w-10 h-12"
                                    src={slidesIcon}
                                    alt="" 
                                />
                                <h1 class="text-3xl text-orange-600 px-4">Create {type}</h1>
                            </div>
                        :
                            <div class="flex px-4">
                                <img class="w-10 h-12"
                                    src={spreadsheetIcon}
                                    alt="" 
                                />
                                <h1 class="text-3xl text-green-600 px-4">Create {type}</h1>
                            </div>
                    }
                    <hr class="border-gray-300 my-4" />
                    <div class= "px-4">
                        <div class={`flex items-center ${type == "document" ? "bg-blue-100": type == "presentation"? "bg-orange-100" : "bg-green-100"} text-black px-4 py-3 mb-3`} role="alert">
                            <div class="flex">
                                <div class="py-1">
                                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                                </div>
                                <div>
                                    <p class="font-bold text-md text-gray-800">You are about to create google {type}.</p>
                                    <p class="text-sm text-gray-800">
                                        Once a google {type} is created, you will be able to access it on your google drive inside the folder name <b>{userName}-{caseTitle.slice(0,15)}</b>.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="items-center text-black px-4 py-3 mb-3" role="alert">
                            <div class="mb-2">
                                <p class="text-sm text-gray-900">Please insert file name</p>
                            </div>
                            <input 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="file_title" 
                                    type="text"
                                    onChange={(e) => handleFilename(e)}
                                />
                        </div>
                        <div class="flex justify-end mx-3">
                            <button 
                                onClick={onClose} 
                                class="focus:outline-none inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-gray-600 hover:text-black hover:bg-gray-200 mt-4 lg:mt-0"
                            >
                                Cancel
                            </button>
                            {
                                type == "document"  ?
                                    <button
                                        onClick={() => {
                                            handleCreateFile("document")
                                            onClose();
                                        }}
                                        class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-blue-600 border-blue-600 hover:border-transparent hover:text-white hover:bg-blue-600 mt-4 lg:mt-0"
                                    >
                                        Create
                                    </button>
                                :
                                type == "presentation" ?
                                    <button
                                        onClick={() => {
                                            handleCreateFile("presentation")
                                            onClose();
                                        }}
                                        class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-orange-600 border-orange-600 hover:border-transparent hover:text-white hover:bg-orange-400 mt-4 lg:mt-0"
                                    >
                                        Create
                                    </button>
                                :
                                    <button
                                        onClick={() => {
                                            handleCreateFile("spreadsheet")
                                            onClose();
                                        }}
                                        class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-green-700 border-green-700 hover:border-transparent hover:text-white hover:bg-green-600 mt-4 lg:mt-0"
                                    >
                                        Create
                                    </button>
                            }
                        </div>
                  </div>
                </div>
              )
            },
            title: 'Confirm to submit'
        })
    }

    return(
        <div>
            {
                googleAccountLinked ? 
                <div>
                    {
                        googleFileCreateLoading ? 
                        <div class="">
                            <PulseLoader
                                size={10}
                                color={"#6DADE3"}
                                loading={true}
                            />
                        </div>
                        :
                        <div class="flex my-2">
                            <button class="bg-blue-500 text-white px-3 py-2 mx-2 focus:outline-none" onClick={() => OpenModalCreateGoogleFile("document")}>Create Google Docs</button>
                            <button class="bg-orange-400 text-white px-3 py-2 mx-2 focus:outline-none" onClick={() => OpenModalCreateGoogleFile("presentation")}>Create Google Slides</button>
                            <button class="bg-green-600 text-white px-3 py-2 mx-2 focus:outline-none" onClick={() => OpenModalCreateGoogleFile("spreadsheet")}>Create Google Sheets</button>
                        </div>
                    }
                    <div class="flex gap-6 mt-8 flex-wrap">
                        {
                            googleFiles.length >= 1 ?
                                googleFiles.map((item, index) => {
                                    return(
                                        <div
                                            class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
                                            style={{ maxWidth: "15rem" }}
                                            >
                                            <div
                                                class="inline-flex overflow-hidden"
                                                style={{ height: "10rem", width: "10rem" }}
                                            >
                                                {
                                                    item.mimeType == "application/vnd.google-apps.document" ?
                                                        <img
                                                            src={docsIcon}
                                                            alt="google docs icon"
                                                            class="h-full w-full"
                                                            style={{ opacity: "0.5" }}
                                                        />
                                                    :
                                                    item.mimeType == "application/vnd.google-apps.presentation" ?
                                                        <img
                                                            src={slidesIcon}
                                                            alt="google slide icon"
                                                            style={{ marginLeft: "0.9rem", opacity: "0.5", width: "8rem" }}
                                                        />
                                                    :
                                                        <img
                                                            src={spreadsheetIcon}
                                                            alt="google spreadsheet icon"
                                                            style={{ marginLeft: "0.9rem", opacity: "0.5", width: "8rem" }}
                                                        />
                                                }
                                            </div>
                                            <div class="flex mt-4">
                                                <div class="w-6/6">
                                                    {
                                                        item.mimeType == "application/vnd.google-apps.document" ?
                                                            <a href={`https://docs.google.com/document/d/${item.id}/edit`} target="blank"><p class="text-md text-blue-500 font-medium mt-2">{item.name}</p></a>
                                                        :
                                                        item.mimeType == "application/vnd.google-apps.presentation" ?
                                                            <a href={`https://docs.google.com/presentation/d/${item.id}/edit`} target="blank"><p class="text-md text-blue-500 font-medium mt-2">{item.name}</p></a>
                                                        :
                                                            <a href={`https://docs.google.com/spreadsheets/d/${item.id}/edit#gid=0`} target="blank"><p class="text-md text-blue-500 font-medium mt-2">{item.name}</p></a>
                                                    }
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            :
                            <div>
                                {
                                    googleFilesLoading ? 
                                    <div class="mx-3">
                                            <PulseLoader
                                                size={15}
                                                color={"#6DADE3"}
                                                loading={true}
                                            />
                                    </div>
                                    :
                                    <div>
                                        <p class="mx-3">No files found on google drive for this case</p>
                                        <img src={folderEmptyIcon} style={{height: "90%", width: "50%"}}/>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
                :
                <Link to="/user/profile-setting">
                    <div class="flex">
                        <p class="text-gray-600 border-b border-dashed">Click here ! To link with your google account from the profile setting page.</p>
                    </div>
                </Link>
            }
        </div>
    )
}

export default GoogleDriveRelatedFiles