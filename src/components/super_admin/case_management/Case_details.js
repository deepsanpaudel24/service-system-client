import React , {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";
import { ForwardCaseRequestDispacther, ForwardCaseRequestDispactherResponseReset } from "../../actions/case_management/ForwardCaseRequestAction";
import TransferPayment from "./Transfer_payment";
import { FinalPaymentTransferDispatcherResponseReset } from "../../actions/case_management/FinalPaymentTransferAction";

const ViewCaseDetailsSA = (props) => {
    const [caseDetails, setCaseDetails] = useState([])
    const [TransferConfirm, setTransferConfirm] = useState(false)
    const [caseTags, setCaseTags] = useState([])
    const [forwardedSPIdList, setForwardedSPIdList] = useState([])
    const [pageLoading, setPageLoaoding] = useState(true)
    const [serviceProviders, setserviceProviders] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    const [propsals, setPropsals] = useState("")
    const dispatch = useDispatch()
    const response = useSelector(state => state.ForwardCaseRequestResponse)


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
            setserviceProviders(res.data['matchingServiceProviders'])
            setCaseDetails(res.data['case_details'])
            var tagslist = res.data['case_details']['caseTags'].toString().split(',')
            setCaseTags(tagslist)
            setForwardedSPIdList(res.data['forwardedSP_list'])
            setPageLoaoding(false)
        })
        .catch((error) => {
            setPageLoaoding(false)
        })
    }, [])

    useEffect(() => {
        
    }, [caseDetails])

    const redirectAfterTransfer = () => {
        props.history.push("/sadmin/cases")
    }

    var list_of_service_providers = []
    const handleServiceProviders = e => {
        if(e.target.checked){
            list_of_service_providers.push(e.target.value)
        }
        if(!e.target.checked){
            const index = list_of_service_providers.indexOf(e.target.value)
            list_of_service_providers.splice(index, 1)
        }
    }

    const handleCaseForward = () => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        var data = {
            "service_providers" : list_of_service_providers.toString()
        }
        dispatch(ForwardCaseRequestDispacther(urlvalues[3], data))
    }
    
    const showServerError = () => {
        if(!_.isEmpty(response.serverErrorMsg)){
            return (
                <div class="bg-red-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                    <p class="font-bold">Be Warned</p>
                    <p>{response.serverErrorMsg}</p>
                </div>
            )
        }
    }

    const handleUndo = (spId) => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'put',
            url: '/api/v1/case-undo/' + urlvalues[3],
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              },
            data: {
                'service_providers': spId
            }
        }
        axios(config)
        .then((res) => {
            //console.log(res.data)
            setShowAlert(true)
            const config5 = {
                method: 'get',
                url: '/api/v1/case/' + urlvalues[3],
                headers: { 
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                  }
            }
            axios(config5)
            .then((res) => {
                setserviceProviders(res.data['matchingServiceProviders'])
                setCaseDetails(res.data['case_details'])
                var tagslist = res.data['case_details']['caseTags'].toString().split(',')
                setCaseTags(tagslist)
                setForwardedSPIdList(res.data['forwardedSP_list'])
                setPageLoaoding(false)
            })
            .catch((error) => {
                setPageLoaoding(false)
            })

        })
        .catch((error) => {
            setPageLoaoding(false)
        })
    }
  
    const confirmCaseForwarded = () => {
        if(!_.isEmpty(response.data)){
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
                setserviceProviders(res.data['matchingServiceProviders'])
                setCaseDetails(res.data['case_details'])
                var tagslist = res.data['case_details']['caseTags'].toString().split(',')
                setCaseTags(tagslist)
                setForwardedSPIdList(res.data['forwardedSP_list'])
                setPageLoaoding(false)
                //dispatch(ForwardCaseRequestDispactherResponseReset())
            })
            .catch((error) => {
                setPageLoaoding(false)
                //dispatch(ForwardCaseRequestDispactherResponseReset())
            })
            return(
                props.history.push('/sadmin/cases')
            )
        }
    }

    const showButton = () => {
        if(response.loading){
            return (
                <div class="">
                    <PulseLoader
                        size={10}
                        color={"#6DADE3"}
                        loading={true}
                    />
                </div>
            )
        }
        return (
            <div>
                <button 
                    class="hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    style={{backgroundColor: "#3490ff"}}
                    onClick= {() => handleCaseForward()}
                >
                    Forward
                </button>
            </div>
        )
    }

    return (
        <div>
            <div class="px-4 sm:px-8">
                {
                    showAlert ? 
                    <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                        <p class="font-bold">Service Provider removed from forwarded list</p>
                    </div>
                    :
                    ""
                }
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
                            <div class="min-w-full lg:max-w-full lg:flex">
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
                                    <div class="min-w-full border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 justify-between leading-normal">
                                        {showServerError()}
                                        {confirmCaseForwarded()}
                                        <div class="w-4/5">
                                            <p class="text-4xl my-3" style={{ textAlign: "left" }}>
                                                {caseDetails.title}
                                            </p>
                                        </div>
                                        {caseDetails.status == "Requested" || caseDetails.status == "Forwarded" || caseDetails.status == "Proposal-Forwarded" ? (
                                            <p class="flex my-3 text-base text-gray-600">
                                            PROPOSED BUDGET{" "}
                                            <p class="ml-3 mr-10 text-base text-black">
                                                {caseDetails.budgetClient}
                                            </p>
                                            CASE REQUESTED ON
                                            <p class="ml-3 mr-10 text-base text-black">
                                                {caseDetails.requestedDate}
                                            </p>
                                            STATUS{" "}
                                            {caseDetails.status == "Forwarded" ? (
                                                <p class="ml-3 mr-10 text-base text-blue-600">
                                                CASE FORWARDED
                                                </p>
                                            ): caseDetails.status == "Requested" ? (
                                            <p class="ml-3 mr-10 text-base text-blue-600">
                                                CASE RECEIVED
                                            </p>
                                            ): caseDetails.status == "Proposal-Forwarded" ? (
                                                <p class="ml-3 mr-10 text-base text-blue-600">
                                                PROPOSAL FORWARDED
                                                </p>
                                            ) : caseDetails.status == "Awaiting-Advance-Payment" ? (
                                                <p class="ml-3 mr-10 text-base text-blue-600">
                                                AWAITING ADVANCE INSTALLMENT
                                                </p>
                                            ): caseDetails.status == "Request-Completion" ? (
                                                <p class="ml-3 mr-10 text-base text-blue-600">
                                                    CASE COMPLETION REQUESTED
                                                </p>
                                              ) : caseDetails.status == "Confirm-Completion" ? (
                                                <p class="ml-3 mr-10 text-base text-blue-600">
                                                    AWAITING FINAL INSTALLMENT
                                                </p>
                                              ): caseDetails.status == "Client-Final-Installment-Paid" ? (
                                                <p class="ml-3 mr-10 text-base text-blue-600">
                                                   FINAL PAYMENT RECEIVED
                                                </p>
                                              ): caseDetails.status == "Closed" ? (
                                                <p class="ml-3 mr-10 text-base text-blue-600">
                                                   CLOSED
                                                </p>
                                              ) : (
                                                <p class="ml-3 mr-10 text-base text-green-600">
                                                ON-PROGRESS
                                                </p>
                                            )}
                                            </p>
                                            ) 
                                             : (
                                            <p class="flex my-3 text-base text-gray-600">
                                                FEE{" "}
                                                <p class="ml-3 mr-10 text-base text-black">
                                                {caseDetails.rate}/ {caseDetails.rateType}
                                                </p>
                                                CASE REQUESTED ON
                                                <p class="ml-3 mr-10 text-base text-black">
                                                {caseDetails.requestedDate}
                                                </p>
                                                STATUS{" "}
                                                {caseDetails.status == "Forwarded" ? (
                                                <p class="ml-3 mr-10 text-base text-blue-600">
                                                    CASE FORWARDED
                                                </p>
                                                ): caseDetails.status == "Requested" ? (
                                                <p class="ml-3 mr-10 text-base text-blue-600">
                                                    CASE RECEIVED
                                                </p>
                                                ): caseDetails.status == "Proposal-Forwarded" ? (
                                                <p class="ml-3 mr-10 text-base text-blue-600">
                                                    PROPOSAL FORWARDED
                                                </p>
                                                ) : caseDetails.status == "Awaiting-Advance-Payment" ? (
                                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                                    AWAITING ADVANCE INSTALLMENT
                                                    </p>
                                                ): caseDetails.status == "Request-Completion" ? (
                                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                                        CASE COMPLETION REQUESTED
                                                    </p>
                                                  ) : caseDetails.status == "Confirm-Completion" ? (
                                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                                        AWAITING FINAL INSTALLMENT
                                                    </p>
                                                  ) : caseDetails.status == "Client-Final-Installment-Paid" ? (
                                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                                       FINAL PAYMENT RECEIVED
                                                    </p>
                                                  ) : caseDetails.status == "Closed" ? (
                                                    <p class="ml-3 mr-10 text-base text-blue-600">
                                                       CLOSED
                                                    </p>
                                                  ) : (
                                                <p class="ml-3 mr-10 text-base text-green-600">
                                                    ON-PROGRESS
                                                </p>
                                                )}
                                            </p>
                                        )}
                                        {
                                            caseDetails.hasOwnProperty('serviceProvidername') ? 
                                            <p class="flex my-5 text-sm text-gray-600" style={{marginTop: "2em"}}>
                                            SERVICE PROVIDER{" "}
                                            <p class="ml-3 mr-10 text-sm text-black">
                                                {caseDetails.serviceProvidername}
                                            </p>
                                            </p>
                                            :
                                            ""
                                        }
                                        <div class="flex items-center">
                                            <div class="text-sm ">
                                                <p>
                                                Tags: &nbsp;&nbsp;
                                                {caseTags.map((item, index) => {
                                                    return (
                                                    <span
                                                        key={index}
                                                        class="relative inline-block px-3 py-1 my-4 mx-2 font-semibold text-gray-900 leading-tight"
                                                    >
                                                        <span
                                                        aria-hidden
                                                        class="absolute inset-0 bg-gray-300 opacity-50"
                                                        ></span>
                                                        <span class="relative">{item}</span>
                                                    </span>
                                                    );
                                                })}
                                                </p>
                                            </div>
                                        </div>
                                        {
                                            caseDetails.status == "Client-Final-Installment-Paid" ? 
                                            <TransferPayment 
                                                spname = {caseDetails.serviceProvidername} 
                                                spid={caseDetails.serviceProvider.$oid}
                                                clientname = {caseDetails.clientName} 
                                                clientid={caseDetails.client.$oid}
                                                casetitle = {caseDetails.title}
                                                caseid = {caseDetails._id.$oid}
                                                redirectAfterTransfer = {redirectAfterTransfer}
                                            />
                                            :
                                            ""
                                        }
                                        
                                        {
                                            caseDetails.status == "Requested" ?
                                            <div>
                                                <div class="flex items-center mt-8 mt-3">
                                                    <div class="text-sm">
                                                        <p class="text-xl text-gray-900 leading-none mb-2">
                                                            Matching service providers
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="flex mt-3">
                                                {
                                                    serviceProviders.length > 0 ? 
                                                        serviceProviders.map((item, index) => {
                                                            return(
                                                                <div class="w-3/12 mr-4">
                                                                    <div class="flex"> 
                                                                        <div>
                                                                            <input class="my-3" type="checkbox" value={item._id.$oid} 
                                                                                onChange={e => handleServiceProviders(e)} 
                                                                            />
                                                                        </div>
                                                                        <div style={{marginLeft: "2em"}}>
                                                                            <div class="mb-8">
                                                                                <div class="flex text-gray-800 font-bold text-md mb-2">
                                                                                    {item.name}
                                                                                </div>
                                                                                <hr class="border-gray-400" />
                                                                                <p class="text-gray-700 text-sm my-3">Address: {item.address}</p>
                                                                                <p class="text-gray-700 text-sm my-3">Forwarded cases: {item.no_forwarded_cases}</p>
                                                                                <p class="text-gray-700 text-sm my-3">On-progress cases: {item.no_forwarded_cases}</p>
                                                                                <p class="text-gray-700 text-sm my-3">
                                                                                    Tags: {item.service_categories.join(', ')}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    :
                                                    "No matching service providers"
                                                }
                                                </div>
                                                <div class="flex justify-start my-5">
                                                    {showButton()}
                                                </div>
                                            </div>
                                            :
                                            <div>
                                                {
                                                    caseDetails.status == "Proposal-Forwarded" ?
                                                    <div class="flex items-center mt-8">
                                                        <div class="text-sm">
                                                            <a href={`/sadmin/proposals/${caseDetails._id.$oid}`} class=" text-gray-900 text-blue-700 leading-none mb-2">
                                                                View Proposals for this case
                                                            </a>
                                                        </div>
                                                    </div>
                                                    :
                                                    ""
                                                }
                                                
                                                <div class="flex items-center mt-5">
                                                    <div class="text-sm">
                                                        <p class="text-lg text-gray-900 leading-none mb-2">
                                                            Case forwarded to
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="flex mt-3">
                                                    {
                                                        forwardedSPIdList.map((item) => {
                                                            return(
                                                            <div class="w-3/12 mr-4" key={item._id.$oid}>
                                                                <div class="flex items-center">
                                                                    <div class="flex-shrink-0 w-10 h-10">
                                                                        <Link to={`/sadmin/people/`}>
                                                                            <img class="w-full h-full rounded-full"
                                                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                                                                alt="" />
                                                                        </Link>
                                                                    </div>
                                                                    <div class="ml-3">
                                                                        <Link to={`/sadmin/people/`}>
                                                                            <p class="text-blue-700 text-lg whitespace-no-wrap">
                                                                                {item.email}
                                                                            </p>
                                                                        </Link>
                                                                        <p class="my-2 text-gray-700 text-sm whitespace-no-wrap">
                                                                            {item.name}
                                                                        </p>
                                                                        <p class="my-2 text-gray-700 text-sm whitespace-no-wrap">
                                                                            {item.address}
                                                                        </p>
                                                                        { 
                                                                            caseDetails.status == "Forwarded" || caseDetails.status == "Requested" ? 
                                                                            <button
                                                                                onClick={() => handleUndo(item._id.$oid)}
                                                                                class="text-sm font-medium bg-red-500 py-1 px-2 rounded text-white align-middle focus:outline-none"
                                                                            >
                                                                                Undo
                                                                            </button>
                                                                            :
                                                                            ""
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default ViewCaseDetailsSA