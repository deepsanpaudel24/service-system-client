import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import _ from "lodash";
import { Link } from "react-router-dom";
import {
  AddTimerResponseReset,
} from "../../actions/TimerAction";
import pdfLogo from "../../../images/pdf-Icon.png";
import docxLogo from "../../../images/docx-Icon.png";
import dataFileLogo from "../../../images/dataFile-Icon.png";
import imageLogo from "../../../images/image-Icon.png";
import { TimerDispatcher } from "../../actions/Timer_management/TimerAction";
import VideoPlayer from "../video_player/VideoPlayer";
import { MdFileDownload } from "react-icons/md";
import GoogleDriveRelatedFiles from "./Case_related_google_drive_files";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import CaseAssignment from "./Case_Assignment";

const ViewCaseDetailsSP = (props) => {
  const [ServerDomain, setServerDomain] = useState("http://127.0.0.1:5000/")
  const [caseDetails, setCaseDetails] = useState([]);
  const [replyStatus, setReplyStatus] = useState(false);
  const [pageLoading, setPageLoaoding] = useState(true);
  const [caseTags, setCaseTags] = useState([]);
  const [propsalDetails, setProposalDetails] = useState([]);
  
  const [totalTimeWorked, setTotalTimeWorked] = useState();
  const [startingTime, setStartingTime] = useState(null);
  const [stoppingTime, setStoppingTime] = useState(null);
  const [showIfBillable, setShowIfBillable] = useState(false);
  const [userName, setUserName] = useState("")
  const [activeTab, setActiveTab] = useState("documents")
  const dispatch = useDispatch();
  const response = useSelector((state) => state.AddTimerResponse);
  const timerResponse = useSelector((state) => state.TimerActionResponse);

  useLayoutEffect(() => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    const config = {
      method: "get",
      url: "/api/v1/case-sp/" + urlvalues[3],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then((res) => {
        setCaseDetails(res.data);
        setPageLoaoding(false);
        var tagslist = res.data["caseTags"].toString().split(",");
        setCaseTags(tagslist);
      })
      .catch((error) => {
        setPageLoaoding(false);
      });

    const config2 = {
      method: "get",
      url: "/api/v1/propsal-sp/" + urlvalues[3],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    }
    axios(config2)
    .then((res) => {
      setProposalDetails(res.data)
    })
    .catch((error) => {
      console.log(error.response)
    });
    
    var config3 = {
      method: "get",
      url: "/api/v1/user/validity",
      headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
      }
    }
    axios(config3)
    .then((res) => {
        setUserName(res.data["name"])
    })
    .catch((error) => {
        
    })

  }, []);

  useEffect(() => {}, [caseDetails]);

  const activateDocsTab = () => {
    setActiveTab("documents")
  }

  const activeIntroTab = () => {
    setActiveTab("intro")
  }

  const activeProposalTab = () => {
    setActiveTab("proposal")
  }

  const activeGDriveTab = () => {
    setActiveTab("google-drive")
  }

  const activeAssignmentTab = () => {
    setActiveTab("assignment")
  }

  const handleReply = () => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    props.history.push("/user/case/reply/" + urlvalues[3]);
  };

  // For timer details
  useEffect(() => {
    getTotalTimeWored();
  }, []);

  const getTotalTimeWored = async () => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    const config = {
      method: "get",
      url: "api/v1/total-time/" + urlvalues[3],
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    const getTotalTime = async () => {
      try {
        const resp = await axios(config);
        setTotalTimeWorked(resp.data);
        dispatch(AddTimerResponseReset());
        return resp;
      } catch (error) {
        return error;
      }
    };
    getTotalTime();
  };

  const showTimerAddedConfirm = () => {
    if (!_.isEmpty(response.data)) {
      getTotalTimeWored();
    }
  };

  const handleAskIfBillable = () => {
    setShowIfBillable(true);
  };

  const handleBillable = () => {
    setShowIfBillable(false);
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    setStartingTime(new Date().toLocaleTimeString());
    var data = {
      caseId: urlvalues[3],
      start: true,
      title: caseDetails.title,
      startingTime: new Date().toLocaleTimeString(),
      billable: true,
    };

    dispatch(TimerDispatcher(data));
  };

  const handleNonBillable = () => {
    setShowIfBillable(false);
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    setStartingTime(new Date().toLocaleTimeString());
    var data = {
      caseId: urlvalues[3],
      start: true,
      title: caseDetails.title,
      startingTime: new Date().toLocaleTimeString(),
      billable: false,
    };

    dispatch(TimerDispatcher(data));
  };

  const handleStopTimer = () => {
    setStoppingTime(new Date().toLocaleTimeString());
    var data = {
      stop: true,
    };
    dispatch(TimerDispatcher(data));
  };

  return (
    <div>
      <div class="px-4 sm:px-8">
        {pageLoading ? (
          <div class="flex h-screen">
            <div class="m-auto">
              <PulseLoader size={10} color={"#6DADE3"} loading={true} />
            </div>
          </div>
        ) : (
          <div>
            <div class="max-w-sm w-full lg:max-w-full lg:flex">
              <div class="border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                <div class="mb-8">
                  {showTimerAddedConfirm()}
                  <div class="flex">
                    <div class="w-4/5">
                      <p class="text-4xl my-3" style={{ textAlign: "left" }}>
                        {caseDetails.title}
                      </p>
                    </div>
                    <div class="w-1/5 flex justify-end">
                      {caseDetails.status == "On-progress" ? (
                        timerResponse.data["start"] ? (
                          <button class="focus:outline-none">
                            <div
                              class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg"
                              onClick={() => handleStopTimer()}
                            >
                              Stop Timer
                            </div>
                          </button>
                        ) : showIfBillable ? (
                          <div class="border border-gray-200 px-3 py-1 ">
                            <p class="mb-3">Is it a billable time?</p>
                            <button
                              class="bg-blue-600 text-white px-2 mr-2"
                              onClick={() => handleBillable()}
                            >
                              Yes
                            </button>
                            <button
                              class="bg-gray-200 text-gray-700 px-2 mx-2"
                              onClick={() => handleNonBillable()}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button class="focus:outline-none">
                            <div
                              class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg"
                              onClick={() => handleAskIfBillable()}
                            >
                              Start Timer
                            </div>
                          </button>
                        )
                      ) : caseDetails.status == "Forwarded" ? (
                        <button class="focus:outline-none">
                          <div
                            class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg"
                            onClick={() => handleReply()}
                          >
                            Make Proposal
                          </div>
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {caseDetails.status == "On-progress" ? (
                    _.isEmpty(totalTimeWorked) ? (
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
                            RECEIVED
                          </p>
                        ) : caseDetails.status == "Proposal-Forwarded" ? (
                          <p class="ml-3 mr-10 text-base text-blue-600">
                            PROPOSAL FORWARDED
                          </p>
                        ) : (
                          <p class="ml-3 mr-10 text-base text-green-600">
                            ON-PROGRESS
                          </p>
                        )}
                        TOTAL TIME WORKED
                        <p class="ml-3 text-base text-black">NOT STARTED YET</p>
                      </p>
                    ) : (
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
                            RECEIVED
                          </p>
                        ) : caseDetails.status == "Proposal-Forwarded" ? (
                          <p class="ml-3 mr-10 text-base text-blue-600">
                            PROPOSAL FORWARDED
                          </p>
                        ) : (
                          <p class="ml-3 mr-10 text-base text-green-600">
                            ON-PROGRESS
                          </p>
                        )}
                        TOTAL TIME WORKED
                        <p class="ml-3 text-base text-black">
                          {" "}
                          {totalTimeWorked.hours} hours:{" "}
                          {totalTimeWorked.minutes} mins:{" "}
                          {totalTimeWorked.seconds} seconds
                        </p>
                      </p>
                    )
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
                          RECEIVED
                        </p>
                      ) : caseDetails.status == "Proposal-Forwarded" ? (
                        <p class="ml-3 mr-10 text-base text-blue-600">
                          PROPOSAL FORWARDED
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
                <div class="pt-8 pb-5">
                    {
                      activeTab == "documents" ? 
                          <ul class="flex border-b">
                              <li class="-mb-px mr-1">
                                  <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activateDocsTab()}>Related Documents</button>
                              </li>
                              <li class="mr-1">
                                  <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeIntroTab()}>Client's Introduction</button>
                              </li>
                              {
                                caseDetails.status == "Proposal-Forwarded" || caseDetails.status == "On-progress" ? 
                                  <li class="mr-1">
                                    <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeProposalTab()}>My Proposal</button>
                                  </li>
                                :
                                ""
                              }
                              <li class="mr-1">
                                  <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeGDriveTab()}>Work with Google Drive</button>
                              </li>
                              <li class="mr-1">
                                <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeAssignmentTab()}>Assignment</button>
                              </li>
                          </ul>
                      :
                        activeTab == "intro" ?
                          <ul class="flex border-b">
                              <li class="mr-1">
                                  <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateDocsTab()}>Related Documents</button>
                              </li>
                              <li class="-mb-px mr-1">
                                  <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeIntroTab()}>Client's Introduction</button>
                              </li>
                              {
                                caseDetails.status == "Proposal-Forwarded" || caseDetails.status == "On-progress" ? 
                                  <li class="mr-1">
                                    <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeProposalTab()}>My Proposal</button>
                                  </li>
                                :
                                ""
                              }
                              <li class="mr-1">
                                  <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeGDriveTab()}>Work with Google Drive</button>
                              </li>
                              <li class="mr-1">
                                <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeAssignmentTab()}>Assignment</button>
                              </li>
                          </ul>
                      :
                        activeTab == "proposal" ?
                          <ul class="flex border-b">
                              <li class="mr-1">
                                  <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateDocsTab()}>Related Documents</button>
                              </li>
                              <li class="mr-1">
                                  <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeIntroTab()}>Client's Introduction</button>
                              </li>
                              {
                                caseDetails.status == "Proposal-Forwarded" || caseDetails.status == "On-progress" ? 
                                  <li class="-mb-px mr-1">
                                    <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeProposalTab()}>My Proposal</button>
                                  </li>
                                :
                                ""
                              }
                              <li class="mr-1">
                                  <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeGDriveTab()}>Work with Google Drive</button>
                              </li>
                              <li class="mr-1">
                                <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeAssignmentTab()}>Assignment</button>
                              </li>
                          </ul>
                      :
                        activeTab == "google-drive" ?
                        <ul class="flex border-b">
                          <li class="mr-1">
                              <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateDocsTab()}>Related Documents</button>
                          </li>
                          <li class="mr-1">
                              <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeIntroTab()}>Client's Introduction</button>
                          </li>
                          {
                            caseDetails.status == "Proposal-Forwarded" || caseDetails.status == "On-progress" ? 
                              <li class="mr-1">
                                <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeProposalTab()}>My Proposal</button>
                              </li>
                            :
                            ""
                          }
                          <li class="-mb-px mr-1">
                              <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeGDriveTab()}>Work with Google Drive</button>
                          </li>
                          <li class="mr-1">
                              <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeAssignmentTab()}>Assignment</button>
                          </li>
                        </ul>
                      :
                        <ul class="flex border-b">
                          <li class="mr-1">
                              <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateDocsTab()}>Related Documents</button>
                          </li>
                          <li class="mr-1">
                              <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeIntroTab()}>Client's Introduction</button>
                          </li>
                          {
                            caseDetails.status == "Proposal-Forwarded" || caseDetails.status == "On-progress" ? 
                              <li class="mr-1">
                                <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeProposalTab()}>My Proposal</button>
                              </li>
                            :
                            ""
                          }
                          <li class="mr-1">
                              <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activeGDriveTab()}>Work with Google Drive</button>
                          </li>
                          <li class="-mb-px mr-1">
                              <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activeAssignmentTab()}>Assignment</button>
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
                  activeTab == "intro" ?
                  <div class="mt-5" style={{ height: "25rem", width: "38rem" }}>
                    <VideoPlayer />
                  </div>
                  :
                  activeTab == "proposal" ?
                  <div >
                    <div class="flex w-4/5">
                      <p class="text-2xl my-3" style={{ textAlign: "left" }}>
                        {propsalDetails.title}
                      </p>
                    </div>
                      <p class="flex my-3 text-sm text-gray-600">
                        PROPOSED FEE{" "}
                        <p class="ml-3 mr-10 text-sm text-black">
                          ${propsalDetails.rate}/ {propsalDetails.rateType}
                        </p>
                        PROPOSAL SENT ON
                        <p class="ml-3 mr-10 text-sm text-black">
                          {propsalDetails.sentDate}
                        </p>
                        STATUS{" "}
                        {propsalDetails.status == "Accepted" ? (
                          <p class="ml-3 mr-10 text-sm text-green-600">
                            ACCEPTED
                          </p>
                        ) : propsalDetails.status == "Declined" ? (
                          <p class="ml-3 mr-10 text-sm text-red-600">
                            DECLINED
                          </p>
                        ) : (
                          <p class="ml-3 mr-10 text-sm text-blue-600">
                            ON REVIEW
                          </p>
                        )}
                      </p>
                      <p
                        class="text-gray-700 text-base mt-3"
                        style={{ marginTop: "3rem", "textAlign": "justify", "text-justify": "inter-word" }}
                      >
                        {propsalDetails.desc}
                      </p>
                      <div class="flex gap-6 mt-3">
                        {
                          propsalDetails.files.map((item) => {
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
                  activeTab == "google-drive" ?
                    <div>
                      <GoogleDriveRelatedFiles caseTitle={caseDetails.title} userName={userName}/>
                    </div>
                  :
                    <div>
                      <CaseAssignment />
                    </div>
                }

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCaseDetailsSP;
