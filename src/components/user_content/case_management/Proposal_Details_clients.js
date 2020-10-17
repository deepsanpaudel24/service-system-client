import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";
import { ProposalAcceptDispacther } from "../../actions/case_management/ProposalAcceptAction";

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
           if(response.data['message'] == true){
                return(
                    <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4" role="alert">
                        <p class="font-bold">Proposal accepted</p>
                    </div>
                )
           }
           else if(response.data['message'] == false) {
            return(
                <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
                    <p class="font-bold">Proposal declined</p>
                </div>
               )
           }
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
            <div>
                <button 
                    class="hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    style={{backgroundColor: "#3490ff"}}
                    onClick={() => handleAccept()}
                >
                    Accept
                </button>
                <button 
                    class="hover:bg-red-500 text-white font-bold mx-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    style={{backgroundColor: "#FF0000"}}
                    onClick={() => handleDeclined()}
                >
                    Decline
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
                            <div class="flex">
                                <div class="w-2/5"><p class="text-3xl my-3" style={{textAlign: "left"}}>Proposal Details</p></div>
                                <div class="w-1/5"></div>
                                <div class="w-1/5"></div>
                                <div class="w-1/5 mb-4">
                                </div>
                            </div>
                            <div class="border-t border-gray-200"></div>
                                {showServerError()}
                                {confirmNewCaseRequest()}
                            <div class="max-w-sm w-full lg:max-w-full lg:flex">
                                <div class="border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                                    <div class="mb-8">
                                        <p class="text-sm text-gray-600 flex items-center">
                                            <div>Fee: ${proposalDetails.rate} {proposalDetails.rateType}</div>
                                        </p>
                                        <div class="text-gray-900 font-bold text-xl mb-2">{proposalDetails.title}</div>
                                        <p class="text-gray-700 text-base">{proposalDetails.desc}</p>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="text-sm">
                                            <p class="text-gray-900 leading-none">{proposalDetails.serviceProvidername}</p>
                                            <p class="text-gray-600">Proposed completion deadline: {proposalDetails.spDeadline}</p>
                                            <p class="text-gray-600">Proposal sent on: {proposalDetails.sentDate}</p>
                                        </div>
                                    </div>
                                    <div class="my-3">
                                        {showData()}
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