import React , {useState, useEffect, useLayoutEffect} from "react";
import {Link} from "react-router-dom";
import Timer from "react-compound-timer";
import {useDispatch, useSelector} from "react-redux";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";
import { AddTimerDispatcher, AddTimerResponseReset } from "../../actions/TimerAction";
import { TimerDispatcher } from "../../actions/Timer_management/TimerAction";

const ViewCaseDetailsSP = (props) => {
    const [caseDetails, setCaseDetails] = useState([])
    const [replyStatus, setReplyStatus] = useState(false)
    const [pageLoading, setPageLoaoding] = useState(true)
    const [caseTags, setCaseTags] = useState([])
    const [totalTimeWorked, setTotalTimeWorked] = useState()
    const [startingTime, setStartingTime] = useState(null);
    const [stoppingTime, setStoppingTime] = useState(null);
    const [showIfBillable, setShowIfBillable] = useState(false);
    const dispatch = useDispatch()
    const response = useSelector(state => state.AddTimerResponse)
    const timerResponse = useSelector(state => state.TimerActionResponse)
    
    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'get',
            url: '/api/v1/case-sp/' + urlvalues[3],
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        axios(config)
        .then((res) => {
            setCaseDetails(res.data)
            setPageLoaoding(false)
            var tagslist = res.data['caseTags'].toString().split(',')
            setCaseTags(tagslist)
        })
        .catch((error) => {
            setPageLoaoding(false)
        })
    }, [])

    useEffect(() => {
        
    }, [caseDetails])

    const handleReply = () => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        props.history.push("/user/case/reply/" + urlvalues[3])
    }

    // For timer details
    useEffect(() => {
        getTotalTimeWored()
     }, []);    
 
     const getTotalTimeWored = async () => {
         var string = document.location.pathname
         var urlvalues = string.toString().split('/')
         const config = {
           method: "get",
           url: "api/v1/total-time/"+ urlvalues[3],
           headers: {
             "Content-Type": "application/json",
             'Authorization': 'Bearer ' + localStorage.getItem('access_token')
           },
         };
         const getTotalTime = async () => {
           try 
             {
                 const resp = await axios(config);
                 setTotalTimeWorked(resp.data)
                 dispatch(AddTimerResponseReset())
                 return resp;
             } 
           catch (error) 
             {
                 return error;
             }
         };
         getTotalTime();
     }
 
     const showTimerAddedConfirm = () => {
         if(!_.isEmpty(response.data)){
             getTotalTimeWored()
         }
     }

    const handleAskIfBillable = () => {
        setShowIfBillable(true)
    }

    const handleBillable = () => {
        setShowIfBillable(false)
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        setStartingTime(new Date().toLocaleTimeString())
        var data = {
            "caseId": urlvalues[3],
            "start": true,
            "title": caseDetails.title,
            "startingTime": new Date().toLocaleTimeString(),
            "billable": true
        }

        dispatch(TimerDispatcher(data))
    }

    const handleNonBillable = () => {
        setShowIfBillable(false)
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        setStartingTime(new Date().toLocaleTimeString())
        var data = {
            "caseId": urlvalues[3],
            "start": true,
            "title": caseDetails.title,
            "startingTime": new Date().toLocaleTimeString(),
            "billable": false
        }

        dispatch(TimerDispatcher(data))
    }

    const handleStopTimer = () => {
        setStoppingTime(new Date().toLocaleTimeString());
        var data = {
            "stop": true,
        }
        dispatch(TimerDispatcher(data))
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
                                        {showTimerAddedConfirm()}
                                        <div class="flex">
                                            <div class="w-4/5"><p class="text-4xl my-3" style={{textAlign: "left"}}>{caseDetails.title}</p></div>
                                            <div class="w-1/5 flex justify-end">
                                                {
                                                    caseDetails.status == "On-progress" ?
                                                        timerResponse.data['start'] ? 
                                                        <button class="focus:outline-none">
                                                            <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg" onClick={() => handleStopTimer()}>Stop Timer</div>
                                                        </button>
                                                        :
                                                        showIfBillable ? 
                                                        <div class="border border-gray-200 px-3 py-1 ">
                                                            <p class="mb-3">Is it a billable time?</p>
                                                            <button class="bg-blue-600 text-white px-2 mr-2" onClick={() => handleBillable()}>Yes</button>
                                                            <button class="bg-gray-200 text-gray-700 px-2 mx-2" onClick={() => handleNonBillable()}>No</button>
                                                        </div>
                                                        :
                                                        <button class="focus:outline-none">
                                                            <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg" onClick={() => handleAskIfBillable()}>Start Timer</div>
                                                        </button>
                                                    :
                                                    ""
                                                }
                                            </div>
                                        </div>
                                        {caseDetails.status == "On-progress" ? 
                                            _.isEmpty(totalTimeWorked) ?
                                            <p class="flex my-3 text-base text-gray-600" >
                                                FEE <p class="ml-3 mr-10 text-base text-black">${caseDetails.rate}/ {caseDetails.rateType}</p>
                                                CASE REQUESTED ON<p class="ml-3 mr-10 text-base text-black">{caseDetails.requestedDate}</p>
                                                STATUS {caseDetails.status == "Forwarded" ? <p class="ml-3 mr-10 text-base text-blue-600">RECEIVED</p> : caseDetails.status == "Proposal-Forwarded"? <p class="ml-3 mr-10 text-base text-blue-600">PROPOSAL FORWARDED</p>: <p class="ml-3 mr-10 text-base text-green-600">ON-PROGRESS</p>} 
                                                TOTAL TIME WORKED<p class="ml-3 text-base text-black">NOT STARTED YET</p>
                                            </p>
                                            :
                                            <p class="flex my-3 text-base text-gray-600" >
                                                FEE <p class="ml-3 mr-10 text-base text-black">${caseDetails.rate}/ {caseDetails.rateType}</p>
                                                CASE REQUESTED ON<p class="ml-3 mr-10 text-base text-black">{caseDetails.requestedDate}</p>
                                                STATUS {caseDetails.status == "Forwarded" ? <p class="ml-3 mr-10 text-base text-blue-600">RECEIVED</p> : caseDetails.status == "Proposal-Forwarded"? <p class="ml-3 mr-10 text-base text-blue-600">PROPOSAL FORWARDED</p>: <p class="ml-3 mr-10 text-base text-green-600">ON-PROGRESS</p>} 
                                                TOTAL TIME WORKED<p class="ml-3 text-base text-black"> {totalTimeWorked.hours} hours: {totalTimeWorked.minutes} mins: {totalTimeWorked.seconds} seconds</p>
                                            </p>
                                        :
                                            <p class="flex my-3 text-base text-gray-600" >
                                                PROPOSED BUDGET <p class="ml-3 mr-10 text-base text-black">${caseDetails.budgetClient}</p>
                                                CASE REQUESTED ON<p class="ml-3 mr-10 text-base text-black">{caseDetails.requestedDate}</p>
                                                STATUS {caseDetails.status == "Forwarded" ? <p class="ml-3 mr-10 text-base text-blue-600">RECEIVED</p> : caseDetails.status == "Proposal-Forwarded"? <p class="ml-3 mr-10 text-base text-blue-600">PROPOSAL FORWARDED</p>: <p class="ml-3 mr-10 text-base text-green-600">ON-PROGRESS</p>}  
                                            </p>
                                        }
                                        <p class="text-gray-700 text-base mt-3" style={{marginTop: "3rem"}}>{caseDetails.desc}</p>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="text-sm ">
                                            <p>Tags: &nbsp;&nbsp;
                                                {
                                                    caseTags.map((item, index) => {
                                                        return(
                                                            <span
                                                                key={index}
                                                                class="relative inline-block px-3 py-1 my-4 mx-2 font-semibold text-gray-900 leading-tight">
                                                                <span aria-hidden
                                                                    class="absolute inset-0 bg-gray-300 opacity-50"></span>
                                                                <span class="relative">{item}</span>
                                                            </span>
                                                        )
                                                    })
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                            caseDetails.status == "On-progress" ? 
                                ""
                            :
                            caseDetails.status == "Proposal-Forwarded" ?
                                ""
                            :
                                <div class="mx-5">
                                    <button 
                                        class="hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                        type="button" 
                                        style={{backgroundColor: "#3490ff"}}
                                        onClick = {() => handleReply()}
                                    >
                                        Make a proposal
                                    </button>
                                </div>
                            }
                        </div>
                }
            </div>
        </div>
    )
}

export default ViewCaseDetailsSP