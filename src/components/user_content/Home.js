import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import {PulseLoader} from "react-spinners";
import { useHistory } from "react-router";
import './styles/App.scss';

const SPCALayout = React.lazy(() => import('./SPCA/Layout_SPCA'));
const CCALayout = React.lazy(() => import('./CCA/Layout_CCA'));
const SPCAeLayout = React.lazy(() => import('./SPCAe/Layout_SPCAe'));
const CCAeLayout = React.lazy(() => import('./CCAe/Layout_CCAe'));


const HomePage = () => {
    const history = useHistory();
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
            history.push("/user/login")
        })

        const config2 = {
            method: "get",
            url: "/api/v1/user/profile-details",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
        };
        axios(config2)
        .then((res) => {
            if (res.data['language']){
                localStorage.setItem("lang", res.data['language'])
            }
            else {
                localStorage.setItem("lang", "en")
            }
        })
        .catch((error) => {});

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
                            userType == "CCA" ?
                                <div>
                                    <CCALayout />
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