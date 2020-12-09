import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";
import { ProposalAcceptDispacther } from "../../actions/case_management/ProposalAcceptAction";
import pdfLogo from "../../../images/pdf-Icon.png";
import docxLogo from "../../../images/docx-Icon.png";
import dataFileLogo from "../../../images/dataFile-Icon.png";
import imageLogo from "../../../images/image-Icon.png";
import { MdFileDownload } from "react-icons/md";
import download from "downloadjs";

const ViewProposalDetailsClient = (props) => {
    const [proposalDetails, setProposalDetails] = useState([])
    const [pageLoading, setPageLoading] = useState(true)
    const dispatch = useDispatch()
    const response = useSelector(state => state.ProposalAcceptResponse)
    
    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'get',
            url: '/api/v1/proposal/' + urlvalues[3],
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        axios(config)
        .then((res) => {
            setProposalDetails(res.data)
            setPageLoading(false)
        })
        .catch((error) => {
            setPageLoading(false)
        })
    }, [])

    useEffect(() => {
        
    }, [proposalDetails])

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
            caseId: proposalDetails.caseId.$oid,
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

    const handleAccept = () => {
        //send the value true for accepted attribute
        var data = {
            accepted: "true"
        }
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        dispatch(ProposalAcceptDispacther(data, urlvalues[3]))
    }

    const handleDeclined = () => {
        //send the value false for accepted attribute
        var data = {
            accepted: "false"
        }
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        dispatch(ProposalAcceptDispacther(data, urlvalues[3]))
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
  
    const confirmNewCaseRequest = () => {
        if(!_.isEmpty(response.data)){
          props.history.push("/user/cases")
        }
    }

    const showData = () => {
        if(response.loading ){
            return(
                <div class="m-auto">
                    <PulseLoader
                        size={10}
                        color={"#6DADE3"}
                        loading={true}
                    />
                </div>
            )
        }
        return(
            <div class="my-4">
                <button 
                    class="hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    style={{backgroundColor: "#3490ff"}}
                    onClick={() => handleAccept()}
                >
                    Accept
                </button>
            </div>
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
                                {showServerError()}
                                {confirmNewCaseRequest()}
                            <div class="max-w-sm w-full lg:max-w-full lg:flex">
                                <div class="border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                                    <div class="flex">
                                        <div class="w-5/5">
                                            <p class="text-4xl my-3" style={{ textAlign: "left" }}>
                                                {proposalDetails.title}
                                            </p>
                                        </div>
                                    </div>
                                    <p class="flex my-3 text-base text-gray-600">
                                        PROPOSED FEE{" "}
                                        <p class="ml-3 mr-10 text-base text-black">
                                        {proposalDetails.rate}/ {proposalDetails.rateType}
                                        </p>
                                        PROPOSAL SENT ON
                                        <p class="ml-3 mr-10 text-base text-black">
                                        {proposalDetails.sentDate}
                                        </p>
                                        STATUS{" "}
                                        {proposalDetails.status == "Accepted" ? (
                                        <p class="ml-3 mr-10 text-base text-green-600">
                                            ACCEPTED
                                        </p>
                                        ) : proposalDetails.status == "Declined" ? (
                                        <p class="ml-3 mr-10 text-base text-red-600">
                                            DECLINED
                                        </p>
                                        ) : (
                                        <p class="ml-3 mr-10 text-base text-blue-600">
                                            ON REVIEW
                                        </p>
                                        )}
                                    </p>
                                    <div class="flex">
                                      {
                                            proposalDetails.hasOwnProperty('paymentType') ? 
                                            <p class="flex mt-3 text-base text-gray-600" style={{marginTop: "1em"}}>
                                              PAYMENT TYPE{" "}
                                              <p class="ml-3 mr-10 text-base text-black">
                                                {proposalDetails.paymentType == "full-payment" ? "One-time payment": "Tranches"}
                                              </p>
                                            </p>
                                            :
                                            ""
                                      }
                                      {
                                            proposalDetails.hasOwnProperty('paymentType') && proposalDetails.paymentType == "advance-payment"? 
                                            <p class="flex mt-3 text-base text-gray-600" style={{marginTop: "1em"}}>
                                              ADVANCE PAYMENT{" "}
                                              <p class="ml-3 mr-10 text-base text-black">
                                                {proposalDetails.advancePayment} %
                                              </p>
                                            </p>
                                            :
                                            ""
                                      }
                                    </div>
                                    <p
                                        class="text-gray-700 text-base mt-3 tracking-wide"
                                        style={{ marginTop: "3rem", "textAlign": "justify", "text-justify": "inter-word" }}
                                    >
                                        {proposalDetails.desc}
                                    </p>
                                    <div class="pt-8 pb-5">
                                        <ul class="flex border-b">
                                            <li class="-mb-px mr-1">
                                                <button class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold focus:outline-none">Related Documents</button>
                                            </li>
                                        </ul>
                                    </div>
                                    {
                        _.isEmpty(proposalDetails.files) ? 
                        ""
                        :
                        <div class="flex gap-6 mt-3">
                        {
                          proposalDetails.files.map((item) => {
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
                              )
                            }
                            else if(["msword", "doc", "docx" ,"vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(extension)){
                              return(
                                <div
                                  class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
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
                              )
                            }
                            else if(["jpeg", "png", "jpg", "gif"].includes(extension)){
                              return(
                                <div
                                  class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
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
                              )
                            }
                            else if(["csv", "xml", "xls", "xlsm", "xlsx"].includes(extension)){
                              return(
                                <div
                                  class="flex flex-col items-center justify-center bg-gray-100 p-4 shadow rounded-lg"
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
                              )
                            }
                          })
                        }
                      </div>
                      }
                                    <div class="my-3">
                                        {
                                            proposalDetails.accepted == true || proposalDetails.accepted == false ? 
                                            ""
                                            :
                                            showData()
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default ViewProposalDetailsClient