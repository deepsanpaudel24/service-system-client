import React , {useState, useEffect, useLayoutEffect} from "react";
import {Link} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";

const ViewCaseDetailsClient = (props) => {
    const [caseDetails, setCaseDetails] = useState([])
    const [pageLoading, setPageLoaoding] = useState(true)
    const [propsals, setPropsals] = useState("")
    
    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'get',
            url: '/api/v1/case/' + urlvalues[3],
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

    const handleAdd = () => {
        return (
          props.history.push("/user/create-case-request")
        )
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
                                    <button class="focus:outline-none" onClick={() => handleAdd()}>
                                        <div class="rounded-full h-16 w-16 flex items-center justify-center bg-white text-blue-500 shadow-md text-4xl hover:shadow-lg">+</div>
                                    </button>
                                </div>
                            </div>
                            <div class="border-t border-gray-200"></div>
                            <div class="max-w-sm w-full lg:max-w-full lg:flex">
                                {
                                    _.isEmpty(caseDetails) ?  
                                    <div class="border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                                        <div class="mb-8">
                                            <p class="text-sm text-gray-600 flex items-center">
                                                No details to show
                                            </p>
                                        </div>
                                    </div>
                                    :
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
                                        <div class="flex items-center">
                                            <div class="text-sm">
                                            <p class="text-blue-600 leading-none"><Link to={`/user/case/proposals/${caseDetails._id.$oid}`}>View Proposals for this case</Link></p>
                                        </div>
                                    </div>
                                    </div>
                                }
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default ViewCaseDetailsClient