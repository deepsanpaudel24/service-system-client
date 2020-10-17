import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";
import { NewCaseRequestResponseReset } from "../../actions/case_management/NewCaseRequestAction";

const ViewCaseDetailsClient = (props) => {
    const [caseDetails, setCaseDetails] = useState([])
    const [caseTags, setCaseTags] = useState([])
    const [pageLoading, setPageLoaoding] = useState(true)
    const [propsals, setPropsals] = useState("")
    const dispatch = useDispatch()
    const response = useSelector(state => state.NewCaseRequestResponse)
    
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
            setCaseDetails(res.data['case_details'])
            setPageLoaoding(false)
            var tagslist = res.data['case_details']['caseTags'].toString().split(',')
            setCaseTags(tagslist)
        })
        .catch((error) => {
            setPageLoaoding(false)
        })
    }, [])

    useEffect(() => {
        
    }, [caseDetails])

    const handleAdd = () => {
        dispatch(NewCaseRequestResponseReset())
        return (
          props.history.push("/user/create-case-request")
        )
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
                            <div class="flex">
                                <div class="w-1/5"><p class="text-3xl mx-3 my-3" style={{textAlign: "left"}}>Case Details</p></div>
                                <div class="w-3/5"></div>
                                <div class="w-1/5 flex justify-end">
                                    <button class="focus:outline-none" onClick={() => handleAdd()}>
                                        <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">Add case</div>
                                    </button>
                                </div>
                            </div>
                            <div class="border-t border-gray-200 mx-3"></div>
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
                                            <p class="text-sm text-gray-600 flex items-center mb-2">
                                                {
                                                    caseDetails.status == "Requested" ?
                                                    <span
                                                        class="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                                        <span aria-hidden
                                                            class="absolute inset-0 bg-blue-300 opacity-50 rounded-full"></span>
                                                        <span class="relative">Requested</span>
                                                    </span>
                                                    :
                                                    caseDetails.status == "Forwarded" ?
                                                    <span
                                                        class="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                                                        <span aria-hidden
                                                            class="absolute inset-0 bg-blue-300 opacity-50 rounded-full"></span>
                                                        <span class="relative">Forwarded</span>
                                                    </span>
                                                    :
                                                    caseDetails.status == "Proposal-Forwarded" ?
                                                    <span
                                                        class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                        <span aria-hidden
                                                            class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                        <span class="relative">Proposal Forwarded</span>
                                                    </span>
                                                    :
                                                    <span
                                                        class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                        <span aria-hidden
                                                            class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                        <span class="relative">On-progress</span>
                                                    </span>
                                                }
                                            </p>
                                            <div class="text-gray-900 font-bold text-xl mb-2">{caseDetails.title}</div>
                                            <p class="text-gray-700 text-base mt-4">{caseDetails.desc}</p>
                                        </div>
                                        <div class="flex items-center">
                                            <div class="text-sm">
                                                <p class="text-gray-900 leading-none">
                                                {
                                                    caseDetails.fee ? 
                                                        <div>Fee: ${caseDetails.fee}</div>
                                                    :
                                                        <div>Proposed budget: ${caseDetails.budgetClient}</div>
                                                }
                                                </p>
                                                <p class="text-gray-600">Case requested on: {caseDetails.requestedDate}</p>
                                                {
                                                    caseTags.map((item, index) => {
                                                        return(
                                                            <span
                                                                key={index}
                                                                class="relative inline-block px-3 py-1 mr-2 mb-3 mt-2 font-semibold text-gray-900 leading-tight">
                                                                <span aria-hidden
                                                                    class="absolute inset-0 bg-gray-300 opacity-50"></span>
                                                                <span class="relative">{item}</span>
                                                            </span>
                                                        )
                                                    })
                                                }
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