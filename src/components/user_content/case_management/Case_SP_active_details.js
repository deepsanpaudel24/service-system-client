import React , {useState, useEffect, useLayoutEffect} from "react";
import {Link} from "react-router-dom";
import Timer from "react-compound-timer";
import {useDispatch, useSelector} from "react-redux";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";

const ViewCaseActiveDetailsSP = (props) => {
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
            url: '/api/v1/case-sp/' + urlvalues[4],
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
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
                                <Timer
                                    initialTime={0}
                                    startImmediately={false}
                                >
                                    {({ start, resume, pause, stop, reset, timerState }) => (
                                        <React.Fragment>
                                            <div>
                                                <Timer.Hours /> hours
                                                <Timer.Minutes /> minutes
                                                <Timer.Seconds /> seconds
                                            </div>
                                            <br />
                                            <div>
                                                <button
                                                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline" 
                                                    type="button"  
                                                    onClick={start}
                                                >
                                                    Start
                                                </button>
                                                <button 
                                                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                                                    type="button" 
                                                    onClick={pause}
                                                >
                                                    Pause
                                                </button>
                                                <button 
                                                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                                                    type="button" 
                                                    onClick={resume}
                                                >
                                                    Resume
                                                </button>
                                                <button 
                                                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                                                    type="button" 
                                                    onClick={stop}
                                                >
                                                    Stop
                                                </button>
                                                <button 
                                                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                                                    type="button" 
                                                    onClick={reset}
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </Timer>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default ViewCaseActiveDetailsSP