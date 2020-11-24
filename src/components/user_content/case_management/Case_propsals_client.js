import React , {useState, useEffect, useLayoutEffect} from "react";
import {Link} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import _ from "lodash";

const ViewCasesProposalClient = (props) => {
    const [proposals, setProposals] = useState([])
    const [tableLoading, setTableLoading] = useState(true)
    
    useLayoutEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        const config = {
            method: 'get',
            url: '/api/v1/case/proposals/' + urlvalues[3],
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
            }
            axios(config)
            .then((res) => {
                setProposals(res.data)
                setTableLoading(false)
            })
            .catch((error) => {
                setTableLoading(false)
            })
    }, [])

    useEffect(() => {
        
    }, [proposals])

    const handleAdd = () => {
        return (
          props.history.push("/user/create-case-request")
        )
      }

    return (
        <div>
            <div class="px-4 sm:px-8">
                <div class="py-8">
                    {
                        tableLoading ? 
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
                        _.isEmpty(proposals) ? 
                        <p class="text-gray-600">No Proposals as of now</p>
                        :
                        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
                            <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
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
                                                Timetaken
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Proposed Deadline
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Sent Date
                                            </th>
                                            <th
                                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Sent By
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            proposals.map((item, index) => {
                                                return(
                                                    <tr>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm" style={{maxWidth: '18rem'}}>
                                                            <div class="flex items-center">
                                                                <div class="ml-3">
                                                                    <Link to={`/user/proposal/${item._id.$oid}`}>
                                                                        <p class="text-blue-700 ">
                                                                            {item.title}
                                                                        </p>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {
                                                                <p>${item.rate}/{item.rateType}</p>
                                                            }
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {item.averageTimeTaken} hrs
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {item.spDeadline}
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {item.sentDate}
                                                        </td>
                                                        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            {item.serviceProvidername}
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

export default ViewCasesProposalClient