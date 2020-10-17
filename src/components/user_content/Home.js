import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import {PulseLoader} from "react-spinners";
import './styles/App.scss';
import SPCALayout from "./SPCA/Layout_SPCA";
import CCALayout from "./CCA/Layout_CCA";
import CSLayout from "./CS/Layout_CS";
import SPSLayout from "./SPS/Layout_SPS";
import SPCAeLayout from "./SPCAe/Layout_SPCAe";
import CCAeLayout from "./CCAe/Layout_CCAe";

const HomePage = (props) => {
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
                    userType == "SPCA" ?
                        <div>
                            <SPCALayout />
                        </div>
                    :
                        userType == "SPS" ?
                            <div>
                                <SPSLayout />
                            </div>
                        :
                            userType == "CCA" ?
                                <div>
                                    <CCALayout />
                                </div>
                            :
                                userType == "CS" ?
                                    <div>
                                        <CSLayout />
                                    </div>
                                :
                                    userType == "SPCAe" ?
                                        <div>
                                            <SPCAeLayout/>
                                        </div>
                                    :
                                        userType == "CCAe" ?
                                            <div>
                                                <CCAeLayout />
                                            </div>
                                        :
                                        ""
            }
        </div>
    )
}

export default HomePage