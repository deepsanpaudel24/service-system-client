import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import download from "downloadjs";
import _ from "lodash";
import pdfLogo from "../../../images/pdf-Icon.png";
import docxLogo from "../../../images/docx-Icon.png";
import dataFileLogo from "../../../images/dataFile-Icon.png";
import imageLogo from "../../../images/image-Icon.png";
import folderEmptyIcon from "../../../images/folder_empty.png";
import { MdFileDownload } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CaseDetailsStorageDispatcher } from "../../actions/case_management/CaseDetailsStorage";
import ChatClientSide from "../../chat/ChatClientSide";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ViewCasesProposalClient from "./Case_propsals_client";
import StripeCheckout from "../payments/Checkout";
import { ConfirmCompletionDispatcher } from "../../actions/case_management/ConfirmCompletionAction";
import ClientCaseTransactions from "./Client_Case_Transactions";
import CaseAssignment from "./Case_Assignment";

const ViewCaseDetailsClient = (props) => {
  const [confirmCompletion, setConfirmCompletion] = useState(false)
  const [confirmCompletionLoading, setConfirmCompletionLoading] = useState(false)
  const [caseDetails, setCaseDetails] = useState([]);
  const [caseTags, setCaseTags] = useState([]);
  const [pageLoading, setPageLoaoding] = useState(true);
  const [confirmFileUpload, setConfirmFileUpload] = useState(false)
  const [confirmFileRemove, setConfirmFileRemove] = useState(false)
  const [activeTab, setActiveTab] = useState("documents");
  const [caseNotFound, setCaseNotFound] = useState(false)
  const dispatch = useDispatch();
  const response = useSelector((state) => state.CaseDetailsStorageReponse);

  var spFilesCount = 0;
  var clientFilesCount = 0;

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
          setCaseNotFound(true)
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
          setCaseNotFound(true)
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

  // function to refresh the page data 
  const refreshPage = () => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
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
        setCaseNotFound(true)
        setPageLoaoding(false);
      });
  }

  // ************************************* Stripe Checkout Integration Event handler ********************************

  // Event handler for the checkout form of stripe 


  const handleFileOpen = (filename) => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    let config = {
      method: "post",
      url: "/api/v1/static/allFiles/" + filename,
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
  const activateTransactionsTab = () => {
    setActiveTab("trasactions");
  };
  const activateAssignmentTab = () => {
    setActiveTab("assignment")
  }

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
            setCaseNotFound(true)
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
            setCaseNotFound(true)
            setPageLoaoding(false);
          });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };



  // To request the completion of the case by service provider
  const handleConfirmCompletion = () => {
    var string = document.location.pathname;
    var urlvalues = string.toString().split("/");
    setConfirmCompletionLoading(true)
    const config = {
      method: 'put',
      url: '/api/v1/confirm-case-completion/'+ urlvalues[3],
    }
    axios(config)
    .then((res) => {
      setConfirmCompletionLoading(false)
      setConfirmCompletion(true)
      // also dispatch a action so that the cases page can refresh
      dispatch(ConfirmCompletionDispatcher(res.data))
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
          setCaseNotFound(true)
          setPageLoaoding(false);
        });
    })
    .catch((error) => {
      setConfirmCompletionLoading(false)
    })
  } 


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
        ) 
        :
        caseNotFound ?
        (
          <div>
            <p class="mx-3 text-gray-700 text-md">Sorry, no details found for this case.</p>
            <img src={folderEmptyIcon} style={{ width: "60%"}}/>
          </div>
        )
        : 
        (
          <div>
            <div class="max-w-sm w-full lg:max-w-full lg:flex">
              <div class="border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                <div class="mb-8">
                {
                    confirmCompletion ? 
                    <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                        <p class="font-bold">Case completion confirmed successfully</p>
                    </div>
                    :
                    ""
                  }
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
                      { caseDetails.status == "Contract-Sent" ||
                      caseDetails.status == "Contract-Replied" ? (
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
                      caseDetails.status == "Awaiting-Advance-Payment" || caseDetails.status == "Confirm-Completion" ?
                        <StripeCheckout
                            caseId={caseDetails._id.$oid}
                            caseTitle={caseDetails.title} 
                            clientId={caseDetails.client.$oid}
                            clientName={caseDetails.clientName}
                            serviceProviderId={caseDetails.serviceProvider.$oid}
                            serviceProvidername={caseDetails.serviceProvidername}
                            caseStatus={caseDetails.status}
                        />
                      :
                      ""
                    }
                    </div>
                  </div>
                  {caseDetails.status == "Requested" || caseDetails.status == "Forwarded" || caseDetails.status == "Proposal-Forwarded" ? (
                    <p class="flex my-3 text-base text-gray-600">
                    PROPOSED BUDGET{" "}
                    <p class="ml-3 mr-10 text-base text-black">
                      {caseDetails.budgetClient}
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
                    ) : caseDetails.status == "Awaiting-Advance-Payment" ? (
                      <p class="ml-3 mr-10 text-base text-blue-600">
                        MAKE ADVANCE INSTALLMENT
                      </p>
                    ) : caseDetails.status == "Request-Completion" ? (
                      <p class="ml-3 mr-10 text-base text-blue-600">
                          CASE COMPLETION REQUESTED
                      </p>
                    ): caseDetails.status == "Confirm-Completion" ? (
                      <p class="ml-3 mr-10 text-base text-blue-600">
                          CASE COMPLETION CONFIRMED
                      </p>
                    ): caseDetails.status == "Client-Final-Installment-Paid" ? (
                      <p class="ml-3 mr-10 text-base text-blue-600">
                        FINAL PAYMENT DONE
                      </p>
                    ) : caseDetails.status == "Closed" ? (
                      <p class="ml-3 mr-10 text-base text-blue-600">
                         CLOSED
                      </p>
                    ) : (
                      <p class="ml-3 mr-10 text-base text-green-600">
                        ON-PROGRESS
                      </p>
                    )}
                  </p>
                  ) : (
                    <p class="flex my-3 text-base text-gray-600">
                      FEE{" "}
                      <p class="ml-3 mr-10 text-base text-black">
                        {caseDetails.rate}/ {caseDetails.rateType}
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
                      ): caseDetails.status == "Awaiting-Advance-Payment" ? (
                        <p class="ml-3 mr-10 text-base text-blue-600">
                          MAKE ADVANCE INSTALLMENT ({caseDetails.advancePayment}%)
                        </p>
                      ): caseDetails.status == "Request-Completion" ? (
                        <p class="ml-3 mr-10 text-base text-blue-600">
                            CASE COMPLETION REQUESTED
                        </p>
                      ) : caseDetails.status == "Confirm-Completion" ? (
                        <p class="ml-3 mr-10 text-base text-blue-600">
                            MAKE FINAL INSTALLEMENT
                        </p>
                      ): caseDetails.status == "Client-Final-Installment-Paid" ? (
                        <p class="ml-3 mr-10 text-base text-blue-600">
                          FINAL PAYMENT DONE
                        </p>
                      ) : caseDetails.status == "Closed" ? (
                        <p class="ml-3 mr-10 text-base text-blue-600">
                           CLOSED
                        </p>
                      ) : (
                        <p class="ml-3 mr-10 text-base text-green-600">
                          ON-PROGRESS
                        </p>
                      )}
                    </p>
                  )}
                  <div class="flex mt-5 mb-4"> 
                    {
                        caseDetails.hasOwnProperty('serviceProvidername') ? 
                        <p class="flex  text-sm text-gray-600" style={{marginTop: "2em"}}>
                          SERVICE PROVIDER{" "}
                          <p class="ml-3 mr-10 text-sm text-black">
                            {caseDetails.serviceProvidername}
                          </p>
                        </p>
                        :
                        ""
                      }

                    </div>

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

                <nav>
                    <div class="">
                        <div class="relative flex items-center justify-between h-16">
                            <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                              <div class="flex items-center">
                                <div class="text-sm mr-5">
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
                            </div>
                            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                              
                            </div>
                        </div>
                    </div>
                </nav>
                <div>
                  <div>
                  {
                    caseDetails.status == "Request-Completion" ? 
                      confirmCompletionLoading ? 
                      <div class="">
                          <PulseLoader
                              size={10}
                              color={"#6DADE3"}
                              loading={true}
                          />
                      </div>
                      :
                      <button class="bg-blue-600 text-white px-3 py-2" onClick={() => handleConfirmCompletion()}>Confirm Completion</button>
                    :
                    ""
                  }
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
                      <li class="mr-1">
                          <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateAssignmentTab()}>Assignment</button>
                      </li>
                      <li class="mr-1">
                          <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateTransactionsTab()}>Transactions</button>
                      </li>
                    </ul>
                  ) 
                  :
                  activeTab == "proposals" ? 
                  (
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
                      <li class="mr-1">
                          <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateAssignmentTab()}>Assignment</button>
                      </li>
                      <li class="mr-1">
                          <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateTransactionsTab()}>Transactions</button>
                      </li>
                    </ul>
                  )
                  :
                  activeTab == "assignment" ? 
                  (
                    <ul class="flex border-b">
                      <li class="mr-1">
                        <button
                          class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                          onClick={() => activateDocsTab()}
                        >
                          Case Documents
                        </button>
                      </li>
                      <li class="mr-1">
                        <button
                          class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                          onClick={() => activateProposalTab()}
                        >
                          Proposals
                        </button>
                      </li>
                      <li class="-mb-px mr-1">
                          <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activateAssignmentTab()}>Assignment</button>
                      </li>
                      <li class="mr-1">
                          <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateTransactionsTab()}>Transactions</button>
                      </li>
                    </ul>
                  )
                  :
                  (
                    <ul class="flex border-b">
                      <li class="mr-1">
                        <button
                          class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
                          onClick={() => activateDocsTab()}
                        >
                          Case Documents
                        </button>
                      </li>
                      <li class="mr-1">
                        <button
                          class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" 
                          onClick={() => activateProposalTab()}
                        >
                          Proposals
                        </button>
                      </li>
                      <li class="mr-1">
                          <button class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none" onClick={() => activateAssignmentTab()}>Assignment</button>
                      </li>
                      <li class="-mb-px mr-1">
                          <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none" onClick={() => activateTransactionsTab()}>Transactions</button>
                      </li>
                    </ul>
                  )
                }
                </div>
                {activeTab == "documents" ? (
                  <div>
                  <div class="flex ">
                      {/* div for the realted files list beigns here */}
                      <div class="w-11/12">
                        {/* div for the related files start from here */}
                          {/* div for the related files of Clients starts*/}
                          <p class="font-bold mb-4">Files from service provider</p>
                            <div class="flex gap-6 flex-wrap">
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
                                  var owner = filename.split(".").slice(-2)[0];
                                  if (owner == "sp"){
                                    spFilesCount = spFilesCount + 1;
                                    if(extension == "pdf"){
                                      return (
                                        <div class="bg-gray-100  shadow rounded-lg">
                                        <div class="flex justify-end mr-2 mt-1 mb-2">
                                        {
                                          owner == "c" ? 
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
                                          :
                                          ""
                                        }
                                        </div>
                                        <div
                                          class={`flex flex-col items-center justify-center bg-gray-100 ${owner == "c" ? "" : "pt-8"} px-4 pb-4`}
                                          style={{ maxWidth: "15rem", cursor: "pointer" }}
                                          onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}
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
                                              <button onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}>
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
                                      )
                                    }
                                    else if(["msword", "doc", "docx" ,"vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(extension)){
                                      return(
                                        <div class="bg-gray-100  shadow rounded-lg">
                                          {
                                            owner == "c" ? 
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
                                            :
                                            ""
                                          }
                                        <div
                                          class={`flex flex-col items-center justify-center bg-gray-100 ${owner == "c" ? "" : "pt-8"} px-4 pb-4`}
                                          style={{ maxWidth: "15rem", cursor: "pointer" }}
                                          onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}
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
                                              <button onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}>
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
                                      )
                                    }
                                    else if(["jpeg", "png", "jpg", "gif"].includes(extension)){
                                      return(
                                        <div class="bg-gray-100  shadow rounded-lg">
                                          {
                                            owner == "c" ? 
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
                                            :
                                            ""
                                          }
                                        <div
                                          class={`flex flex-col items-center justify-center bg-gray-100 ${owner == "c" ? "" : "pt-8"} px-4 pb-4`}
                                          style={{ maxWidth: "15rem", cursor: "pointer" }}
                                          onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}
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
                                              <button onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}>
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
                                      )
                                    }
                                    else if(["csv", "xml", "xls", "xlsm", "xlsx"].includes(extension)){
                                      return(
                                        <div class="bg-gray-100  shadow rounded-lg">
                                          {
                                            owner == "c" ? 
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
                                            :
                                            ""
                                          }
                                        <div
                                          class={`flex flex-col items-center justify-center bg-gray-100 ${owner == "c" ? "" : "pt-8"} px-4 pb-4`}
                                          style={{ maxWidth: "15rem", cursor: "pointer" }}
                                          onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}
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
                                              <button onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}>
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
                                      )
                                    }
                                  }
                                })
                              }
                              {
                                spFilesCount == 0 ?
                                <div class="my-4">
                                  <p class="text-gray-600">No files from service provider as of now.</p>
                                </div>
                                :
                                ""
                              }
                            </div>
                          {/* div for the related files of Clients ends */}

                          {/* div for the related files of service providers starts */}
                          <p class="font-bold mt-4">Your Files</p>
                          <div class="flex gap-6 my-4 flex-wrap">
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
                                  var owner = filename.split(".").slice(-2)[0];
                                  if (owner == "c"){
                                    clientFilesCount = clientFilesCount + 1;
                                    if(extension == "pdf"){
                                      return (
                                        <div class="bg-gray-100  shadow rounded-lg">
                                        <div class="flex justify-end mr-2 mt-1 mb-2">
                                        {
                                          owner == "c" ? 
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
                                          :
                                          ""
                                        }
                                        </div>
                                        <div
                                          class={`flex flex-col items-center justify-center bg-gray-100 ${owner == "c" ? "" : "pt-8"} px-4 pb-4`}
                                          style={{ maxWidth: "15rem", cursor: "pointer" }}
                                          onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}
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
                                              <button onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}>
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
                                      )
                                    }
                                    else if(["msword", "doc", "docx" ,"vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(extension)){
                                      return(
                                        <div class="bg-gray-100  shadow rounded-lg">
                                          {
                                            owner == "c" ? 
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
                                            :
                                            ""
                                          }
                                        <div
                                          class={`flex flex-col items-center justify-center bg-gray-100 ${owner == "c" ? "" : "pt-8"} px-4 pb-4`}
                                          style={{ maxWidth: "15rem", cursor: "pointer" }}
                                          onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}
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
                                              <button onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}>
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
                                      )
                                    }
                                    else if(["jpeg", "png", "jpg", "gif"].includes(extension)){
                                      return(
                                        <div class="bg-gray-100  shadow rounded-lg">
                                          {
                                            owner == "c" ? 
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
                                            :
                                            ""
                                          }
                                        <div
                                          class={`flex flex-col items-center justify-center bg-gray-100 ${owner == "c" ? "" : "pt-8"} px-4 pb-4`}
                                          style={{ maxWidth: "15rem", cursor: "pointer" }}
                                          onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}
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
                                              <button onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}>
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
                                      )
                                    }
                                    else if(["csv", "xml", "xls", "xlsm", "xlsx"].includes(extension)){
                                      return(
                                        <div class="bg-gray-100  shadow rounded-lg">
                                          {
                                            owner == "c" ? 
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
                                            :
                                            ""
                                          }
                                        <div
                                          class={`flex flex-col items-center justify-center bg-gray-100 ${owner == "c" ? "" : "pt-8"} px-4 pb-4`}
                                          style={{ maxWidth: "15rem", cursor: "pointer" }}
                                          onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}
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
                                              <button onClick={() => handleFileOpen(item.split("/").slice(-1)[0])}>
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
                                      )
                                    }

                                  }
                                })
                              }
                              {
                                clientFilesCount == 0 ?
                                <div class="my-4">
                                  <p class="text-gray-600">No files uploded from your side as of now</p>
                                </div>
                                :
                                ""
                              }
                            </div>
                          {/* div for the related files of service providers ends */}
                          
                        {/* div for the related files ends from here  */}
                      </div>
                        {/* Div for adding the documents beigns from here */}
                      <div class="w-1/12">
                        <div class="flex flex-col items-end">
                          <label for="profileImage"> 
                            <a class="h-12 w-auto px-5 py-2 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg" style={{cursor: "pointer"}}>
                            <em class="fa fa-upload"></em> Add Files</a>
                          </label> 
                          <input type="file" name="profileImage" 
                            id="profileImage" style={{display: "none"}} 
                            multiple
                            onChange={e => handleFileUpload(e)}
                            accept="image/png, image/jpeg,.pdf,.doc,.docx,.xml,.txt,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            />
                          </div>
                      </div>
                        {/* Div for adding the documents removed from here */}
                    </div>
                </div>
              ) 
              : 
              activeTab == "proposals" ?
              (
                  <div>
                    <ViewCasesProposalClient />
                  </div>
              )
              : 
              activeTab == "assignment" ?
              (
                  <div>
                    <CaseAssignment user_type="cca" />
                  </div>
              )
              :
              <div>
                <ClientCaseTransactions />
              </div>
              }
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
          refresh_page={refreshPage}
        ></ChatClientSide>
      )}
    </div>
  );
};

export default ViewCaseDetailsClient;
