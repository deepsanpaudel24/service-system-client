import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";
import pdfLogo from "../../../images/pdf-Icon.png";
import docxLogo from "../../../images/docx-Icon.png";
import dataFileLogo from "../../../images/dataFile-Icon.png";
import imageLogo from "../../../images/image-Icon.png";
import VideoPlayer from "../video_player/VideoPlayer";
import { MdFileDownload } from "react-icons/md";

const ViewCaseDetailsClient = (props) => {
    const [ServerDomain, setServerDomain] = useState("http://127.0.0.1:5000/")
    const [caseDetails, setCaseDetails] = useState([])
    const [caseTags, setCaseTags] = useState([])
    const [pageLoading, setPageLoaoding] = useState(true)
    const [propsals, setPropsals] = useState("")
    const [activeTab, setActiveTab] = useState("documents")
    const dispatch = useDispatch()
    const response = useSelector(state => state.NewCaseRequestResponse)
    
    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'get',
            url: '/api/v1/case/' + urlvalues[3],
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        axios(config)
        .then((res) => {
            setCaseDetails(res.data['case_details'])
            setPageLoaoding(false)
            var tagslist = res.data['case_details']['caseTags'].toString().split(',')
            setCaseTags(tagslist)
        })
        .catch((error) => {
            setPageLoaoding(false)
        })
    }, [])

    useEffect(() => {
        
    }, [caseDetails])

    const activateDocsTab = () => {
        setActiveTab("documents")
    }
    
    const handleViewContract = () => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        return(
            props.history.push("/user/contract/" + urlvalues[3])
        )
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
                                <div class="w-4/5">
                                    <p class="text-4xl my-3" style={{ textAlign: "left" }}>
                                        {caseDetails.title}
                                    </p>
                                </div>
                                <div class="w-1/5 flex justify-end">
                                    {
                                        caseDetails.status == "Contract-Sent" || caseDetails.status == "Contract-Replied" ? (
                                            <button class="focus:outline-none">
                                              <div
                                                class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg"
                                                onClick={() => handleViewContract()}
                                              >
                                                View Contract Paper
                                              </div>
                                            </button>
                                          )
                                          :
                                          ""
                                    }
                                </div>
                            </div>
                            {caseDetails.status == "On-progress" ? (
                                <p class="flex my-3 text-base text-gray-600">
                                    FEE{" "}
                                    <p class="ml-3 mr-10 text-base text-black">
                                    ${caseDetails.rate}/ {caseDetails.rateType}
                                    </p>
                                    CASE REQUESTED ON
                                    <p class="ml-3 mr-10 text-base text-black">
                                    {caseDetails.requestedDate}
                                    </p>
                                    STATUS{" "}
                                    {caseDetails.status == "Forwarded" ? (
                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                        FORWARDED
                                    </p>
                                    ) : caseDetails.status == "Requested" ? (
                                        <p class="ml-3 mr-10 text-base text-blue-600">
                                            CASE REQUESTED
                                        </p>
                                    ) : caseDetails.status == "Proposal-Forwarded" ? (
                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                        PROPOSAL RECEIVED
                                    </p>
                                    ) : caseDetails.status == "Contract-Sent" ? (
                                        <p class="ml-3 mr-10 text-base text-blue-600">
                                          CONTRACT PAPER RECEIVED
                                        </p>
                                    ) : caseDetails.status == "Contract-Waiting" ? (
                                        <p class="ml-3 mr-10 text-base text-blue-600">
                                            WAITING CONTRACT PAPER
                                        </p>
                                    ) : caseDetails.status == "Contract-Replied" ? (
                                        <p class="ml-3 mr-10 text-base text-blue-600">
                                            SIGNED CONTRACT PAPER SENT
                                        </p>
                                    ) : (
                                    <p class="ml-3 mr-10 text-base text-green-600">
                                        ON-PROGRESS
                                    </p>
                                    )}
                                </p>
                            ) : (
                                <p class="flex my-3 text-base text-gray-600">
                                PROPOSED BUDGET{" "}
                                <p class="ml-3 mr-10 text-base text-black">
                                    ${caseDetails.budgetClient}
                                </p>
                                CASE REQUESTED ON
                                <p class="ml-3 mr-10 text-base text-black">
                                    {caseDetails.requestedDate}
                                </p>
                                STATUS{" "}
                                {caseDetails.status == "Forwarded" ? (
                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                    FORWARDED
                                    </p>
                                ): caseDetails.status == "Requested" ? (
                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                    CASE REQUESTED
                                    </p>
                                ): caseDetails.status == "Proposal-Forwarded" ? (
                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                    PROPOSAL RECEIVED
                                    </p>
                                ) : caseDetails.status == "Contract-Waiting" ? (
                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                        WAITING CONTRACT PAPER
                                    </p>
                                ) : caseDetails.status == "Contract-Sent" ? (
                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                      CONTRACT PAPER RECEIVED
                                    </p>
                                ) : caseDetails.status == "Contract-Replied" ? (
                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                        SIGNED CONTRACT PAPER SENT
                                    </p>
                                ) : (
                                    <p class="ml-3 mr-10 text-base text-green-600">
                                    ON-PROGRESS
                                    </p>
                                )}
                                </p>
                            )}
                            <p
                                class="text-gray-700 text-base mt-3"
                                style={{ marginTop: "3rem", "textAlign": "justify", "text-justify": "inter-word" }}
                            >
                                {caseDetails.desc}
                            </p>
                            </div>
                            <div class="flex items-center">
                                <div class="text-sm ">
                                    <p>
                                    Tags: &nbsp;&nbsp;
                                    {caseTags.map((item, index) => {
                                        return (
                                        <span
                                            key={index}
                                            class="relative inline-block px-3 py-1 my-4 mx-2 font-semibold text-gray-900 leading-tight"
                                        >
                                            <span
                                            aria-hidden
                                            class="absolute inset-0 bg-gray-300 opacity-50"
                                            ></span>
                                            <span class="relative">{item}</span>
                                        </span>
                                        );
                                    })}
                                    </p>
                                </div>
                            </div>
                            <div class="text-lg my-3">
                                <p class="text-blue-600 leading-none"><Link to={`/user/case/proposals/${caseDetails._id.$oid}`}>View Proposals for this case</Link></p>
                            </div>
                            <div class="pt-8 pb-5">
                                {
                                activeTab == "documents" ? 
                                    <ul class="flex border-b">
                                        <li class="-mb-px mr-1">
                                            <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activateDocsTab()}>Case Documents</button>
                                        </li>
                                    </ul>
                                :
                                    <ul class="flex border-b">
                                        <li class="mr-1">
                                            <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateDocsTab()}>Case Documents</button>
                                        </li>
                                    </ul>
                                }
                            </div>
                            {
                            activeTab == "documents" ?
                            <div class="flex gap-6 mt-3">
                                {
                                caseDetails.files.map((item) => {
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
                            :
                            <div class="mt-5" style={{ height: "25rem", width: "38rem" }}>
                                <VideoPlayer />
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

export default ViewCaseDetailsClient