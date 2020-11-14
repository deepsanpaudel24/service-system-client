import React, {useState, useEffect} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Timer from "react-compound-timer";
import LogoutUser from "../../actions/UserLogoutAction";
import { useDispatch, useSelector } from 'react-redux';
import _ from "lodash";
import SPCAContent from "./Content_SPCA";
import { TimerRunningTimeDispatcher } from "../../actions/Timer_management/TimerRunningTimeAction";
import { AddTimerDispatcher } from "../../actions/TimerAction";
import { NotificationChangeStatusDispacther } from "../../actions/notifications/Notification_change_status_action";
import { MdNotificationsNone } from 'react-icons/md';

const SPCANavbar = () => {
    const [showOptions, setShowOptions] = useState(false)
    // const [logout, setLogout] = useState(false)
    const [timerTitle, setTimerTitle] = useState("")
    const [timerStartingTime, setTimerStartingTime] = useState("")
    const [timerCaseId, setTimerCaseId] = useState("")
    const [billable, setBillable] = useState(false)

    // For notification modules
    const [showNotifications, setShowNotifications] = useState(false)
    const [notification, setNotification] = useState([]);
    const [sendFirstNotification, setSendFirstNotification] = useState(true)
    const [numberOfNotifications, setNumberOfNotifications] = useState(0);

    const dispatch = useDispatch()
    const logoutResponse = useSelector(state => state.logoutUserResponse)
    const timerResponse = useSelector(state => state.TimerActionResponse)

    const config = {
        method: "get",
        url: "/api/v1/notifications",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      };

    useEffect(() => {
        const checkNotification = async () => {
            try {
                const resp = await axios(config);
                setNotification(resp.data);
                setNumberOfNotifications(resp.data.length)
                return resp;
            } 
            catch (error) {
                return error;
            }
        };

        if(sendFirstNotification){
            checkNotification()
            setSendFirstNotification(false)
        }
        else {
            const interval = setInterval(checkNotification, 9000);
            return () => clearInterval(interval);
        }
      }, [sendFirstNotification]);
    
    const handleShowNotifications = () => {
        if(showNotifications){
            setShowNotifications(false)
        }
        else {
            setShowOptions(false)
            setShowNotifications(true)
        }
    }

    const handleNotificationClick = (notification_id) => {
        setShowNotifications(false)
        console.log(notification_id, "notification id")
        dispatch(NotificationChangeStatusDispacther(notification_id))
    }



    const handleLogout = () => {
        dispatch(LogoutUser())
    }

    const LogoutUserResponse = (props) => {
      if(!_.isEmpty(logoutResponse.data)){
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.reload(true)
      }
    }

    const handleShowOptions = () => {
        if(showOptions){
            setShowOptions(false)
        }
        else {
            setShowOptions(true)
        }
    }

    const handleTimerStarter = (start) => {
        start();
        setTimerTitle(timerResponse.data['title'])
        setTimerStartingTime(timerResponse.data['startingTime'])
        setTimerCaseId(timerResponse.data['caseId'])
        setBillable(timerResponse.data['billable'])
    }

    const handleTimerStopper = (stop, reset, timerRunningTime) => {
        stop();
        reset();
        var data = {
            "title": timerTitle,
            "startingTime": timerStartingTime,
            "stoppingTime": new Date().toLocaleTimeString(),
            "Timervalue": timerRunningTime,
            "Billable": billable,
            "caseId": timerCaseId
        }
        //dispatch action to send the timer details to backend server
        dispatch(AddTimerDispatcher(data))
    }


    return(
        <div>
            {LogoutUserResponse()}
            <nav style={{backgroundColor: "#273238"}}>
            <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div class="relative flex items-center justify-between h-16">
                    <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div class="hidden sm:block sm:ml-6">
                        <div class="flex">
                            <a href="#" class="px-3 py-2 rounded-md text-sm font-medium leading-5 text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Dashboard</a>
                            <a href="#" class="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Team</a>
                            <a href="#" class="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Projects</a>
                            <a href="#" class="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Calendar</a>
                        </div>
                        </div>
                    </div>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        
                        <Timer
                            initialTime={0}
                            startImmediately={false}
                        >
                            {({ start, stop, reset, getTime}) => (
                                <React.Fragment>
                                    <div class="flex" style={{marginRight: "3rem"}}>
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
                                    {
                                        timerResponse.data['start'] ? 
                                            handleTimerStarter(start)
                                        :
                                        timerResponse.data['stop'] ?
                                            handleTimerStopper(stop, reset, getTime())
                                        :
                                        ""
                                    }
                                    <br />
                                </React.Fragment>
                            )}
                        </Timer>
                        <div class="ml-3 relative">
                            {
                                numberOfNotifications == 0 ? 
                                    <button onClick={() => handleShowNotifications()} class="relative text-white focus:outline-none mr-4 mt-1">
                                        <MdNotificationsNone style={{fontSize: "1.7rem", marginRight: "0.5rem", marginTop: "0.5rem"}}/>
                                    </button>
                                :
                                <button onClick={() => handleShowNotifications()} class="relative text-white focus:outline-none mr-3 mt-3">
                                    <MdNotificationsNone style={{fontSize: "1.8rem", marginRight: "0.5rem", marginTop: "0.5rem"}}/>
                                    {
                                        numberOfNotifications == 0 ? 
                                        ""
                                        :
                                        <div class="static mb-3">
                                            <div class="absolute top-0 right-0">
                                                <span class="badge bg-red-800 text-center text-white text-sm" style={{fontSize: "0.7rem"}}>
                                                    {numberOfNotifications}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                </button>
                            }
                            {
                                showNotifications ?
                                    <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg" style={{width: "20rem"}}>
                                        <div class="rounded-md bg-white shadow-xs">
                                            <div class="" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                {
                                                    _.isEmpty(notification)  ?
                                                    <span class="flex items-center px-4 py-3 border-b hover:bg-gray-100 ">
                                                        <p class="text-gray-600 text-sm mx-2">
                                                        <span class="font-bold" href="#">No new notifications</span>
                                                        </p>
                                                    </span>
                                                    :
                                                    notification.map((item, index) => {
                                                        return(
                                                            <Link to={item.link} class="flex items-center px-4 py-3 border-b hover:bg-gray-100 " onClick={() => handleNotificationClick(item._id.$oid)}>
                                                                    <p class="text-gray-600 text-sm mx-2">
                                                                    <span class="font-bold" href="#">{item.title}</span>
                                                                    </p>
                                                            </Link>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                :
                                ""
                            } 
                        </div>
                        <div class="ml-3 relative">
                            <div class="text-white">
                                <button onClick={() => handleShowOptions()} class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out" id="user-menu" aria-label="User menu" aria-haspopup="true">
                                <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                </button>
                            </div>
                            {
                                showOptions ? 
                                <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg">
                                    <div class="rounded-md bg-white shadow-xs">
                                        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <Link to="/user/profile-setting" onClick={() => handleShowOptions()} class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Profile</Link>
                                            <Link to="/user/change-password" onClick={() => handleShowOptions()} class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Change password</Link>
                                            <a href="#" class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Account settings</a>
                                            <div class="border-t border-gray-200"></div>
                                            <button type="submit" onClick={() => handleLogout()} class="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                :
                                ""
                            }
                        </div>
                    </div>
                </div>
            </div>
            </nav>
            <div class="container max-w-full py-4">
                <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mx-4 " style={{minHeight: "53rem"}}>
                    <SPCAContent />
                </div>
            </div>
        </div>
    )
}

export default SPCANavbar