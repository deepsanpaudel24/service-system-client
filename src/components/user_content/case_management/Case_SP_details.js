import React , {useState, useEffect, useLayoutEffect} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";

const ViewCaseDetailsSP = (props) => {
    const [caseDetails, setCaseDetails] = useState([])
    const [replyStatus, setReplyStatus] = useState(false)
    const [pageLoading, setPageLoaoding] = useState(true)
    const dispatch = useDispatch()
    const response = useSelector(state => state.NewCaseRequestResponse)
    
    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'get',
            url: '/api/v1/case-sp/' + urlvalues[3],
        }
        axios(config)
        .then((res) => {
            setCaseDetails(res.data)
            setPageLoaoding(false)
        })
        .catch((error) => {
            setPageLoaoding(false)
        })

        const config2 = {
            method: 'get',
            url: '/api/v1/case-request/reply/'+ urlvalues[3],
        }
        axios(config2)
        .then((res) => {
            setReplyStatus(res.data)
            console.log(res.data)
        })
        .catch((error) => {
            console.log(error.response)
            setReplyStatus(false)
        })
    }, [])

    useEffect(() => {
        
    }, [caseDetails])

    const handleReply = () => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        props.history.push("/user/case/reply/" + urlvalues[3])
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
                                            <p class="text-gray-900 leading-none">{caseDetails.clientName}</p>
                                            <p class="text-gray-600">Case requested on: {caseDetails.requestedDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mx-5">
                                <button 
                                    class="hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="button" 
                                    style={{backgroundColor: "#3490ff"}}
                                    onClick = {() => handleReply()}
                                >
                                    Make a reply
                                </button>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default ViewCaseDetailsSP