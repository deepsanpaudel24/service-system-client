import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import download from "downloadjs";
import _ from "lodash";
import pdfLogo from "../../../images/pdf-Icon.png";
import docxLogo from "../../../images/docx-Icon.png";
import dataFileLogo from "../../../images/dataFile-Icon.png";
import imageLogo from "../../../images/image-Icon.png";
import VideoPlayer from "../video_player/VideoPlayer";
import { MdFileDownload } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CaseDetailsStorageDispatcher } from "../../actions/case_management/CaseDetailsStorage";
import ChatClientSide from "../../chat/ChatClientSide";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ViewCasesProposalClient from "./Case_propsals_client";

const ViewCaseDetailsClient = (props) => {
  const [ServerDomain, setServerDomain] = useState("http://127.0.0.1:5000/");
  const [caseDetails, setCaseDetails] = useState([]);
  const [caseTags, setCaseTags] = useState([]);
  const [pageLoading, setPageLoaoding] = useState(true);
  const [propsals, setPropsals] = useState("");
  const [confirmFileUpload, setConfirmFileUpload] = useState(false)
  const [confirmFileRemove, setConfirmFileRemove] = useState(false)
  const [activeTab, setActiveTab] = useState("documents");
  const dispatch = useDispatch();
  const response = useSelector((state) => state.CaseDetailsStorageReponse);

  useLayoutEffect(() => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    if (_.isEmpty(response.data)) {
      const config = {
        method: "get",
        url: "/api/v1/case/" + urlvalues[3],
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios(config)
        .then((res) => {
          setCaseDetails(res.data["case_details"]);
          setPageLoaoding(false);
          var tagslist = res.data["case_details"]["caseTags"]
            .toString()
            .split(",");
          setCaseTags(tagslist);
          dispatch(CaseDetailsStorageDispatcher(res.data));
        })
        .catch((error) => {
          setPageLoaoding(false);
        });
    } else if (response.data["case_details"]["_id"].$oid !== urlvalues[3]) {
      const config = {
        method: "get",
        url: "/api/v1/case/" + urlvalues[3],
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios(config)
        .then((res) => {
          setCaseDetails(res.data["case_details"]);
          setPageLoaoding(false);
          var tagslist = res.data["case_details"]["caseTags"]
            .toString()
            .split(",");
          setCaseTags(tagslist);
          dispatch(CaseDetailsStorageDispatcher(res.data));
        })
        .catch((error) => {
          setPageLoaoding(false);
        });
    } else {
      setCaseDetails(response.data["case_details"]);
      setPageLoaoding(false);
      var tagslist = response.data["case_details"]["caseTags"]
        .toString()
        .split(",");
      setCaseTags(tagslist);
    }
  }, []);

  useEffect(() => {}, [caseDetails]);

  const handleFileOpen = (filename) => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    let config = {
      method: "post",
      url: "/static/allFiles/" + filename,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "application/json; application/octet-stream",
      },
      responseType: "blob",
      data: {
        caseId: urlvalues[3],
      },
    };
    axios(config)
      .then((resp) => {
        const resp_file_name = resp.headers["content-disposition"].split(
          "filename="
        )[1];
        const content = resp.headers["content-type"];
        download(resp.data, resp_file_name, content);
      })
      .catch((error) => {});
  };

  const activateDocsTab = () => {
    setActiveTab("documents");
  };
  const activateProposalTab = () => {
    setActiveTab("proposals");
  };

  const handleViewContract = () => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    return props.history.push("/user/contract/" + urlvalues[3]);
  };

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
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    var targetFiles = e.target.files;
    var validateFilesList = [];
    for (let file of targetFiles) {
      if (validateFile(file)) {
        validateFilesList.push(file);
      } else {
        console.log("File Not valid....");
      }
    }
    var formData = new FormData();
    for (let file of validateFilesList) {
      formData.append(file.name, file);
    }
    const config = {
      method: "put",
      url: "/api/v1/case/documents/" + urlvalues[3],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      data: formData,
    };
    axios(config)
      .then((res) => {
        setConfirmFileUpload(true)
        setConfirmFileRemove(false)
        const config = {
          method: "get",
          url: "/api/v1/case/" + urlvalues[3],
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        };
        axios(config)
          .then((res) => {
            setCaseDetails(res.data["case_details"]);
            setPageLoaoding(false);
            var tagslist = res.data["case_details"]["caseTags"]
              .toString()
              .split(",");
            setCaseTags(tagslist);
            dispatch(CaseDetailsStorageDispatcher(res.data));
          })
          .catch((error) => {
            setPageLoaoding(false);
          });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleRemoveFile = (file) => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    const config = {
      method: "put",
      url: "/api/v1/case/docs-remove/" + urlvalues[3],
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      data: {
        file: file,
      },
    };
    axios(config)
      .then((res) => {
        setConfirmFileRemove(true)
        setConfirmFileUpload(false)
        const config = {
          method: "get",
          url: "/api/v1/case/" + urlvalues[3],
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        };
        axios(config)
          .then((res) => {
            setCaseDetails(res.data["case_details"]);
            setPageLoaoding(false);
            var tagslist = res.data["case_details"]["caseTags"]
              .toString()
              .split(",");
            setCaseTags(tagslist);
            dispatch(CaseDetailsStorageDispatcher(res.data));
          })
          .catch((error) => {
            setPageLoaoding(false);
          });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };


  const DeletePopUp = (item) => {
    confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="bg-white shadow border rounded px-4 py-4 mx-auto max-w-lg">
                <h1 class="text-3xl text-red-600 px-4">Delete the file. Are you sure?</h1>
                <hr class="border-gray-300 my-4" />
                <div class= "px-4">
                    <div class="flex items-center bg-orange-100 text-black px-4 py-3 mb-3" role="alert">
                        <div class="flex">
                            <div class="py-1">
                                <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                            </div>
                            <div>
                                <p class="font-bold text-md text-gray-800">You are about to delete the file.</p>
                                <p class="text-sm text-gray-800">
                                    Once a file is permanently deleted, all the details of the file will be immediately removed from the system.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center text-black px-4 py-3 mb-3" role="alert">
                        <div>
                            <p class="text-sm text-gray-900">This action cannot be undone later. You will loose this file and its details. Please confirm the following action: </p>
                            <p class="inline-block bg-gray-100 text-black pr-3 py-1">Delete the file {item.split("/").slice(-1)[0]}</p>
                        </div>
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
                                handleRemoveFile(item);
                                onClose();
                            }}
                            class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-red-700 border-red-700 hover:border-transparent hover:text-white hover:bg-red-700 mt-4 lg:mt-0"
                        >
                            Yes, Delete it!
                        </button>
                    </div>
              </div>
            </div>
          )
        },
        title: 'Confirm to submit'
    })
}

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
                  {
                    confirmFileUpload ? 
                    <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                        <p class="font-bold">File uploaded successfully</p>
                    </div>
                    :
                    ""
                  }
                  {
                    confirmFileRemove ? 
                    <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                        <p class="font-bold">File removed successfully</p>
                    </div>
                    :
                    ""
                  }
                  <div class="flex">
                    <div class="w-4/5">
                      <p class="text-4xl my-3" style={{ textAlign: "left" }}>
                        {caseDetails.title}
                      </p>
                    </div>
                    <div class="w-1/5 flex justify-end">
                      {caseDetails.status == "Contract-Sent" ||
                      caseDetails.status == "Contract-Replied" ? (
                        <button class="focus:outline-none">
                          <div
                            class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg"
                            onClick={() => handleViewContract()}
                          >
                            View Contract Paper
                          </div>
                        </button>
                      ) : (
                        ""
                      )}
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
                      ) : caseDetails.status == "Requested" ? (
                        <p class="ml-3 mr-10 text-base text-blue-600">
                          CASE REQUESTED
                        </p>
                      ) : caseDetails.status == "Proposal-Forwarded" ? (
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
                  {
                        caseDetails.hasOwnProperty('serviceProvidername') ? 
                        <p class="flex mt-5 text-sm text-gray-600" style={{marginTop: "2em"}}>
                          SERVICE PROVIDER{" "}
                          <p class="ml-3 mr-10 text-sm text-black">
                            {caseDetails.serviceProvidername}
                          </p>
                        </p>
                        :
                        ""
                      }
                  <p
                    class="text-gray-700 text-base tracking-wide"
                    style={{
                      marginTop: "1rem",
                      textAlign: "justify",
                      textJustify: "inter-word",
                    }}
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
                  {activeTab == "documents" ? (
                    <ul class="flex border-b">
                      <li class="-mb-px mr-1">
                        <button
                          class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none"
                          onClick={() => activateDocsTab()}
                        >
                          Case Documents
                        </button>
                      </li>
                      <li class="mr-1">
                          <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateProposalTab()}>Proposals</button>
                      </li>
                    </ul>
                  ) : (
                    <ul class="flex border-b">
                      <li class="mr-1">
                        <button
                          class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                          onClick={() => activateDocsTab()}
                        >
                          Case Documents
                        </button>
                      </li>
                      <li class="-mb-px mr-1">
                        <button
                          class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none"
                          onClick={() => activateProposalTab()}
                        >
                          Proposals
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
                {activeTab == "documents" ? (
                  <div>
                    <nav class="flex flex-wrap">
                      <div class="w-full block flex-grow lg:flex lg:w-auto">
                        <div class="lg:flex-grow">
                          <div class="flex gap-6 mt-4">
                            {caseDetails.files.map((item) => {
                              var filename = item.split("/").slice(-1)[0];
                              if (filename.length < 12) {
                                var display_name = filename;
                              } else {
                                var display_name =
                                  filename.slice(0, 12) + " ...";
                              }
                              var extension = filename
                                .split(".")
                                .slice(-1)[0]
                                .toLowerCase();
                              var owner = filename.split(".").slice(-2)[0];
                              if (extension == "pdf") {
                                return (
                                  <div class="bg-gray-100  shadow rounded-lg">
                                    {owner == "c" ? (
                                      <div class="flex justify-end mr-2 mt-1 mb-2">
                                        <button
                                          class="focus:outline-none"
                                          onClick={() => DeletePopUp(item)}
                                        >
                                          <p class="text-red-400 ml-3">
                                            <RiDeleteBin5Line />
                                          </p>
                                        </button>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    <div
                                      class={`flex flex-col items-center justify-center bg-gray-100 ${
                                        owner == "c" ? "" : "pt-8"
                                      } px-4 pb-4`}
                                      style={{ maxWidth: "15rem" }}
                                    >
                                      <div
                                        class="inline-flex overflow-hidden"
                                        style={{
                                          height: "10rem",
                                          width: "10rem",
                                        }}
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
                                          {/* <a
                                            href={ServerDomain + item}
                                            target="blank"
                                          >
                                            <p class="text-md font-medium mt-2">
                                              {display_name}{" "}
                                            </p>
                                          </a> */}
                                          <button
                                            onClick={() =>
                                              handleFileOpen(
                                                item.split("/").slice(-1)[0]
                                              )
                                            }
                                          >
                                            {" "}
                                            {display_name}{" "}
                                          </button>
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
                                  </div>
                                );
                              } else if (
                                [
                                  "msword",
                                  "doc",
                                  "docx",
                                  "vnd.openxmlformats-officedocument.wordprocessingml.document",
                                ].includes(extension)
                              ) {
                                return (
                                  <div class="bg-gray-100  shadow rounded-lg">
                                    {owner == "c" ? (
                                      <div class="flex justify-end mr-2 mt-1 mb-2">
                                        <button
                                          class="focus:outline-none"
                                          onClick={() => DeletePopUp(item)}
                                        >
                                          <p class="text-red-400 ml-3">
                                            <RiDeleteBin5Line />
                                          </p>
                                        </button>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    <div
                                      class={`flex flex-col items-center justify-center bg-gray-100 ${
                                        owner == "c" ? "" : "pt-8"
                                      } px-4 pb-4`}
                                      style={{ maxWidth: "15rem" }}
                                    >
                                      <div
                                        class="inline-flex overflow-hidden"
                                        style={{
                                          height: "10rem",
                                          width: "10rem",
                                        }}
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
                                          {/* <a
                                            href={ServerDomain + item}
                                            target="blank"
                                          >
                                            <p class="text-md font-medium mt-2">
                                              {display_name}
                                            </p>
                                          </a> */}

                                          <button
                                            onClick={() =>
                                              handleFileOpen(
                                                item.split("/").slice(-1)[0]
                                              )
                                            }
                                          >
                                            {" "}
                                            {display_name}{" "}
                                          </button>
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
                                  </div>
                                );
                              } else if (
                                ["jpeg", "png", "jpg", "gif"].includes(
                                  extension
                                )
                              ) {
                                return (
                                  <div class="bg-gray-100  shadow rounded-lg">
                                    {owner == "c" ? (
                                      <div class="flex justify-end mr-2 mt-1 mb-2">
                                        <button
                                          class="focus:outline-none"
                                          onClick={() => DeletePopUp(item)}
                                        >
                                          <p class="text-red-400 ml-3">
                                            <RiDeleteBin5Line />
                                          </p>
                                        </button>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    <div
                                      class={`flex flex-col items-center justify-center bg-gray-100 ${
                                        owner == "c" ? "" : "pt-8"
                                      } px-4 pb-4`}
                                      style={{ maxWidth: "15rem" }}
                                    >
                                      <div
                                        class="inline-flex overflow-hidden"
                                        style={{
                                          height: "10rem",
                                          width: "10rem",
                                        }}
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
                                          {/* <a href={ServerDomain + item} target="blank"><p class="text-md font-medium mt-2">{display_name} </p></a> */}
                                          <button
                                            onClick={() =>
                                              handleFileOpen(
                                                item.split("/").slice(-1)[0]
                                              )
                                            }
                                          >
                                            {" "}
                                            {display_name}{" "}
                                          </button>
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
                                  </div>
                                );
                              } else if (
                                ["csv", "xml", "xls", "xlsm", "xlsx"].includes(
                                  extension
                                )
                              ) {
                                return (
                                  <div class="bg-gray-100  shadow rounded-lg">
                                    {owner == "c" ? (
                                      <div class="flex justify-end mr-2 mt-1 mb-2">
                                        <button
                                          class="focus:outline-none"
                                          onClick={() => DeletePopUp(item)}
                                        >
                                          <p class="text-red-400 ml-3">
                                            <RiDeleteBin5Line />
                                          </p>
                                        </button>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    <div
                                      class={`flex flex-col items-center justify-center bg-gray-100 ${
                                        owner == "c" ? "" : "pt-8"
                                      } px-4 pb-4`}
                                      style={{ maxWidth: "15rem" }}
                                    >
                                      <div
                                        class="inline-flex overflow-hidden"
                                        style={{
                                          height: "10rem",
                                          width: "10rem",
                                        }}
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
                                          {/* <a
                                            href={ServerDomain + item}
                                            target="blank"
                                          >
                                            <p class="text-md font-medium mt-2">
                                              {display_name}{" "}
                                            </p>
                                          </a> */}

                                          <button
                                            onClick={() =>
                                              handleFileOpen(
                                                item.split("/").slice(-1)[0]
                                              )
                                            }
                                          >
                                            {" "}
                                            {display_name}{" "}
                                          </button>
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
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </div>
                        <div>
                          <label for="profileImage">
                            <a
                              class="h-12 w-auto px-5 py-2 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg"
                              style={{ cursor: "pointer" }}
                            >
                              <em class="fa fa-upload"></em> Add Documents
                            </a>
                          </label>
                          <input
                            type="file"
                            name="profileImage"
                            id="profileImage"
                            style={{ display: "none" }}
                            multiple
                            onChange={(e) => handleFileUpload(e)}
                            accept="image/png, image/jpeg,.pdf,.doc,.docx,.xml,.txt,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          />
                        </div>
                      </div>
                    </nav>
                  </div>
                ) : (
                  <div>
                    <ViewCasesProposalClient />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {caseDetails.status == "On-progress" && (
        <ChatClientSide
          userId={caseDetails.logged_in_user_id.$oid}
          username={caseDetails.logged_in_user_name}
          room={caseDetails._id.$oid}
        ></ChatClientSide>
      )}
    </div>
  );
};

export default ViewCaseDetailsClient;
