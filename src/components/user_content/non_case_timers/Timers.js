import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import Timer from "react-compound-timer";
import { AddNonCaseTimerResponseReset } from "../../actions/Timer_management/AddNonCaseTimerAction";
import { UpdateNonCaseTimerDispatcher } from "../../actions/Timer_management/UpdateNonCaseTimerAction";

const Timers = (props) => {
    const [timers, setTimers] = useState([])
    const [tableLoading, setTableLoading] = useState(false)
    const dispatch = useDispatch()
    const response = useSelector(state => state.AddNonCaseTimerResponse)

    const handleAdd = () => {
        dispatch(AddNonCaseTimerResponseReset())
        return (
          props.history.push("/user/add-timer")
        )
    }

    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/non-case-timer',
            headers: { 
              'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
          }
          axios(config)
          .then((res) => {
              setTimers(res.data)
              setTableLoading(false)
          })
          .catch((error) => {
              setTableLoading(false)
          })
      }, [])
  
      useEffect(() => {
          
      }, [timers])

    const handleNonCaseStart = (start) => {
        start();
    }

    const handleNonCaseStop = (stop, reset, timerRunningTime) => {
        stop();
        reset();
        var data = {
            timerValue: timerRunningTime
        }
        var timerId = "5f85bf469dc3294097768162"
        dispatch(UpdateNonCaseTimerDispatcher(data, timerId))
    }

    return (
        <div>
            <div class="px-4 sm:px-8">
                <div class="flex min-w-full">
                    <div class="w-1/5"><p class="text-3xl my-3" style={{textAlign: "left"}}>Non Case Timers</p></div>
                    <div class="w-3/5"></div>
                    <div class="w-1/5 flex justify-end">
                        <button class="focus:outline-none" onClick={() => handleAdd()}>
                            <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">Add Timers</div>
                        </button>
                    </div>
                </div>
                <Timer
                        initialTime={0}
                        startImmediately={false}
                    >
                        {({ start, stop, reset, getTime}) => (
                            <React.Fragment>
                                <div class="flex bg-black" style={{marginRight: "3rem"}}>
                                    <div class="flex-auto text-xl font-bold text-white text-center px-2 py-1 mr-2">
                                        <Timer.Hours />
                                        <p class="text-gray-300" style={{fontSize: "0.6rem"}}>Hour(s)</p>
                                    </div>
                                    <div class="flex-auto text-xl font-bold text-white text-center px-2 py-1 mr-2">
                                        :
                                    </div>
                                    <div class="flex-auto text-xl font-bold text-white text-center px-2 py-1 mr-2">
                                        <Timer.Minutes />
                                        <p class="text-gray-300" style={{fontSize: "0.6rem"}}>Minutes(s)</p>
                                    </div>
                                    <div class="flex-auto text-xl font-bold text-white text-center px-2 py-1 mr-2">
                                        :
                                    </div>
                                    <div class="flex-auto text-xl font-bold text-white text-center px-2 py-1">
                                        <Timer.Seconds />
                                        <p class="text-gray-300" style={{fontSize: "0.6rem"}}>Seconds(s)</p>
                                    </div>
                                </div>
                                <div>
                                    <button class="bg-gray-200 px-2 py-2 m-1" onClick={() => handleNonCaseStart(start)}>Start</button>
                                    <button class="bg-gray-200 px-2 py-2 m-1" onClick={() => handleNonCaseStop(stop, reset, getTime())}>Stop</button>
                                </div>
                                <br />
                            </React.Fragment>
                        )}
                    </Timer>

                <div class="py-8">
                    {
                        tableLoading ? 
                            <div class="animate-pulse flex space-x-4">
                                <div class="flex-1 space-y-4 py-1">
                                    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                                        <div class="min-w-full shadow rounded-lg overflow-hidden">
                                            <table class="min-w-full leading-normal">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Title
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Fee
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Requested On
                                                        </th>
                                                        <th
                                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="h-4 bg-gray-400 rounded w-3/4"></div>
                                    <div class="space-y-2">
                                        <div class="h-4 bg-gray-400 rounded"></div>
                                        <div class="h-4 bg-gray-400 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        :
                        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                            <div class="min-w-full shadow rounded-lg overflow-hidden">
                                <table class="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Total time worked 
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Created date
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            timers.map((item, index) => {
                                                return(
                                                    <tr>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm" style={{maxWidth: '14em'}}>
                                                            <div class="flex items-center">
                                                                <div class="ml-3">
                                                                    <p class="text-gray-900">
                                                                        {item.title}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {item.humanizeTime['seconds']}
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {item.createdDate}
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p class="text-blue-700 whitespace-no-wrap">
                                                               <Link to={`/user/case/${item._id.$oid}`}>Start</Link> 
                                                            </p>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default Timers