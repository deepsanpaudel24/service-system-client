import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";
import { ForewardCaseRequestDispacther } from "../../actions/case_management/ForwardCaseRequestAction";

const ViewCaseDetailsSA = (props) => {
    const [caseDetails, setCaseDetails] = useState([])
    const [pageLoading, setPageLoaoding] = useState(true)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const dispatch = useDispatch()
    const response = useSelector(state => state.ForwardCaseRequestResponse)
    
    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'get',
            url: '/api/v1/case/' + urlvalues[3],
            }
            axios(config)
            .then((res) => {
                setCaseDetails(res.data)
                setPageLoaoding(false)
            })
            .catch((error) => {
                setPageLoaoding(false)
            })
    }, [])

    useEffect(() => {
        
    }, [caseDetails])

    const handleCaseForward = () => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        dispatch(ForewardCaseRequestDispacther(urlvalues[3]))
        setButtonDisabled(true)
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
           return(
            <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4" role="alert">
                <p class="font-bold">Case has been forwared.</p>
            </div>
           )
        }
    }
  
    const showData = () => {
  
        if(response.loading){
            return (
              <button 
                class="hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                style={{backgroundColor: "#3490ff"}}
                disabled
              >
                  Loading...
              </button>
            )
        }
        else if(buttonDisabled){
            return(
                <p class="text-green-600 sm"> The case has been forwarded</p>
            )
        }
        return (
            
            <button 
              class="hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="button" 
              style={{backgroundColor: "#3490ff"}}
              onClick={() => handleCaseForward()}
            >
                  Forward
            </button>
        )
  
    }

    return (
        <div>
            <div class="container mx-auto px-4 sm:px-8">
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
                                <div class="w-1/5"><p class="text-3xl my-3" style={{textAlign: "left"}}>Case Details</p></div>
                                <div class="w-1/5"></div>
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
                                            {
                                                _.isEmpty(caseDetails.fee) ? 
                                                    <div>Proposed budget: ${caseDetails.budgetClient}</div>
                                                    :
                                                    <div>Fee: ${caseDetails.fee}</div>
                                            }
                                        </p>
                                        <div class="text-gray-900 font-bold text-xl mb-2">{caseDetails.title}</div>
                                        <p class="text-gray-700 text-base">{caseDetails.desc}</p>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="text-sm">
                                            <p class="text-gray-600">Case requested on: {caseDetails.requestedDate}</p>
                                            <p class="text-gray-900 leading-none">{caseDetails.clientName}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-cener">
                                        {
                                            caseDetails.forward ? 
                                            <p class="text-green-600 sm"> The case has been forwarded</p>
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

export default ViewCaseDetailsSA