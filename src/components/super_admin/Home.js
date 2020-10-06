import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import {PulseLoader} from "react-spinners";
import './styles/App.scss';
import SALayout from "./dashboard_component/Layout_SA";

const SAHomePage = (props) => {
    const [userType, setUserType] = useState("NR")      // NR is used for Not Received User Type
    const [collapsed, setCollapsed] = useState(false)

    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/user/validity',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        axios(config)
        .then((res) => {
            setUserType(res.data['user_type'])
        })
        .catch((error) => {
            props.history.push("/user/login")
        })
    }, [])

    useEffect(() => {
        
    }, [userType])

    return (
        <div>
            {
                userType == "NR" ?
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
                    userType == "SA" ?
                        <div>
                            <SALayout />
                        </div>
                    :
                        ""
            }
        </div>
    )
}

export default SAHomePage