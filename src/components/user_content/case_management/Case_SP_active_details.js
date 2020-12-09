import React , {useState, useEffect, useLayoutEffect} from "react";
import {Link} from "react-router-dom";
import Timer from "react-compound-timer";
import {useDispatch, useSelector} from "react-redux";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";
import { AddTimerDispatcher, AddTimerResponseReset } from "../../actions/TimerAction";

const ViewCaseActiveDetailsSP = (props) => {
    const [caseDetails, setCaseDetails] = useState([])
    const [pageLoading, setPageLoaoding] = useState(true)
    const [showStop, setShowStop] = useState(false)
    const [totalTimeWorked, setTotalTimeWorked] = useState()
    const [startingTime, setStartingTime] = useState(null);
    const [stoppingTime, setStoppingTime] = useState(null);
    const [timerRunningTime, setTimerRunningTime] = useState(0);
    const dispatch = useDispatch()
    const response = useSelector(state => state.AddTimerResponse)
    
   // For case details request 
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

    // For timer details
    useEffect(() => {
       getTotalTimeWored()
    }, []);    

    const getTotalTimeWored = async () => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
          method: "get",
          url: "api/v1/total-time/"+ urlvalues[4],
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
                console.log('Total time worked', resp.data)
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

    const customStart = (start) => {
        start();
        setStartingTime(new Date().toLocaleTimeString());
        setShowStop(true);
      };
    
    const customStop = (stop, reset, timerRunningTime) => {
        stop();
        reset();
        setStoppingTime(new Date().toLocaleTimeString());
        // timerRunning time is in milisecond
        setTimerRunningTime(timerRunningTime);
        setShowStop(false);
        var data = {
            "title": caseDetails.title,
            "startingTime": startingTime,
            "stoppingTime": new Date().toLocaleTimeString(),
            "Timervalue": timerRunningTime,
            "caseId": caseDetails._id.$oid
        }
        //dispatch action to send the timer details to backend server
        dispatch(AddTimerDispatcher(data))
    };

    const showTimerAddedConfirm = () => {
        if(!_.isEmpty(response.data)){
            getTotalTimeWored()
            return(
                <p>Timer added successfully!</p>
            )
        }
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
                                <div class="w-1/5">
                                    {
                                        _.isEmpty(totalTimeWorked) ? 
                                        ""
                                        :
                                        <p class="my-3">
                                           {totalTimeWorked.days} days: {totalTimeWorked.hours} hours: {totalTimeWorked.minutes} mins: {totalTimeWorked.seconds} seconds
                                        </p>
                                    }
                                </div>
                                <div class="w-1/5"></div>
                                <div class="w-1/5"></div>
                                <div class="w-1/5 mb-4">
                                </div>
                            </div>
                            {showTimerAddedConfirm()}
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
                                    {({ start, stop, reset, getTime}) => (
                                        <React.Fragment>
                                            <div>
                                                <Timer.Hours /> &nbsp;hours&nbsp;: &nbsp;&nbsp; 
                                                <Timer.Minutes /> &nbsp;minutes&nbsp;: &nbsp;&nbsp; 
                                                <Timer.Seconds /> &nbsp;seconds 
                                            </div>
                                            <br />
                                            <div>
                                                {
                                                    showStop ? 
                                                        <button 
                                                            class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                                                            type="button" 
                                                            onClick={() => customStop(stop, reset, getTime())}
                                                        >
                                                            Stop
                                                        </button>
                                                    :
                                                        <button
                                                            class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline" 
                                                            type="button"  
                                                            onClick={() => customStart(start)}
                                                        >
                                                            Start
                                                        </button>
                                                }
                                                
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