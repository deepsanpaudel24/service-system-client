import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";
import { AddTimerDispatcher, AddTimerResponseReset } from "../../actions/TimerAction";
import { TimerDispatcher } from "../../actions/Timer_management/TimerAction";

const TaskDetails = (props) => {
    const [taskDetails, settaskDetails] = useState([])
    const [replyStatus, setReplyStatus] = useState(false)
    const [pageLoading, setPageLoaoding] = useState(true)
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
            url: '/api/v1/tasks/' + urlvalues[3],
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        axios(config)
        .then((res) => {
            settaskDetails(res.data)
            setPageLoaoding(false)
        })
        .catch((error) => {
            setPageLoaoding(false)
        })
    }, [])

    useEffect(() => {
        
    }, [taskDetails])

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
            "title": taskDetails.title,
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
            "title": taskDetails.title,
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
                                            <div class="w-4/5">
                                                <p class="text-4xl my-3" style={{ textAlign: "left" }}>
                                                    {taskDetails.title}
                                                </p>
                                            </div>
                                            <div class="w-1/5 flex justify-end">
                                                {
                                                    taskDetails.status == "On-progress" ?
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
                                        {taskDetails.status == "On-progress" ? 
                                            _.isEmpty(totalTimeWorked) ?
                                            <p class="flex my-3 text-base text-gray-600" >
                                                TASK CREATED ON<p class="ml-3 mr-10 text-base text-black">{taskDetails.requestedDate}</p>
                                                STATUS {taskDetails.status == "Forwarded" ? <p class="ml-3 mr-10 text-base text-blue-600">RECEIVED</p> : taskDetails.status == "Proposal-Forwarded"? <p class="ml-3 mr-10 text-base text-blue-600">PROPOSAL FORWARDED</p>: <p class="ml-3 mr-10 text-base text-green-600">ON-PROGRESS</p>} 
                                                TOTAL TIME WORKED<p class="ml-3 text-base text-black">NOT STARTED YET</p>
                                            </p>
                                            :
                                            <p class="flex my-3 text-base text-gray-600" >
                                                TASK CREATED ON<p class="ml-3 mr-10 text-base text-black">{taskDetails.requestedDate}</p>
                                                STATUS {taskDetails.status == "Forwarded" ? <p class="ml-3 mr-10 text-base text-blue-600">RECEIVED</p> : taskDetails.status == "Proposal-Forwarded"? <p class="ml-3 mr-10 text-base text-blue-600">PROPOSAL FORWARDED</p>: <p class="ml-3 mr-10 text-base text-green-600">ON-PROGRESS</p>} 
                                                TOTAL TIME WORKED<p class="ml-3 text-base text-black"> {totalTimeWorked.hours} hours: {totalTimeWorked.minutes} mins: {totalTimeWorked.seconds} seconds</p>
                                            </p>
                                        :
                                            <p class="flex my-3 text-base text-gray-600" >
                                                TASK CREATED ON ON<p class="ml-3 mr-10 text-base text-black">{taskDetails.requestedDate}</p>
                                                STATUS {taskDetails.status == "Forwarded" ? <p class="ml-3 mr-10 text-base text-blue-600">RECEIVED</p> : taskDetails.status == "Proposal-Forwarded"? <p class="ml-3 mr-10 text-base text-blue-600">PROPOSAL FORWARDED</p>: <p class="ml-3 mr-10 text-base text-green-600">ON-PROGRESS</p>}  
                                            </p>
                                        }
                                        <p class="text-gray-700 text-base mt-3" style={{marginTop: "3rem"}}>{taskDetails.desc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default TaskDetails