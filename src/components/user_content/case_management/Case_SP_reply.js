import React , {useState} from "react";
import _ from "lodash";
import {PulseLoader} from "react-spinners";
import {useDispatch, useSelector} from "react-redux";
import { ReplyCaseRequestDispacther } from "../../actions/case_management/ReplyCaseRequestAction";

const ReplyCaseRequest = () => {
    const [formStep, setFormStep] = useState(1)
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [rateType, setRateType]  = useState("")
    const [rate, setRate] = useState(0)
    const [avgTimeTaken, setAvgTimeTaken] = useState("")
    const [proposedDeadline, setProposedDeadline] = useState("")
    const [formEmptyError, setFormEmptyError] = useState("")
    const dispatch = useDispatch()
    const response = useSelector(state => state.ReplyCaseRequestResponse)

    const handleTitleChange = (e) => {
        setFormEmptyError("")
        setTitle(e.target.value)
    }
  
    const handleDescChange = (e) => {
        setFormEmptyError("")
        setDesc(e.target.value)
    }

    const handleRateType = e => {
        setRateType(e.target.value)
    }

    const handleRateChange = e => {
        setRate(e.target.value)
    }

    const handleForward = () => {
        setFormStep(2)
    }

    const handleBackward = () => {
        setFormStep(1)
    }

    const handleAvgTimeTaken = e => {
        setAvgTimeTaken(e.target.value)
    }

    const handleProposedDeadline = (e) => {
        setFormEmptyError("")
        setProposedDeadline(e.target.value)
    }

    const handleReplyCaseRequest = () => {
        if(title == "" || desc == "" || rate == "" || avgTimeTaken == "" || proposedDeadline == ""){
          setFormEmptyError("Please fill up all the required fields")
        }
        else {
          //send the case request to backend.
            var string = document.location.pathname
            var urlvalues = string.toString().split('/')
            var data = {
                "title": title,
                "desc": desc,
                "rateType": rateType,
                "rate": rate,
                "averageTimeTaken": avgTimeTaken,
                "spDeadline": proposedDeadline
            }
            var caseid = urlvalues[4]
            dispatch(ReplyCaseRequestDispacther(data, caseid))
        }
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
  
    const confirmNewCaseRequest = () => {
        if(!_.isEmpty(response.data)){
           return(
            <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4" role="alert">
                <p class="font-bold">Proposal sent successfully</p>
            </div>
           )
        }
    }
  
    const showData = () => {
  
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
                    class="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    onClick={() => handleBackward()}
                >
                    Back
                </button>
                <button 
                class="hover:bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                style={{backgroundColor: "#3490ff"}}
                onClick={() => handleReplyCaseRequest()}
                >
                    Submit
                </button>
            </div>
        )
  
    }

    return (
        <div class="flex mb-4">
            <div class="w-3/5 ml-5">
                <form>
                    <p class="text-3xl my-3" >Make a proposal</p>
                    <div class="border-t border-gray-200"></div>
                    {showServerError()}
                    {confirmNewCaseRequest()}
                    {
                        formStep == 1 ? 
                        <div>
                            <div class="mt-6 mb-5" >
                                <label class="block text-gray-700 text-sm" for="title">
                                    Title:
                                </label>
                                    <input 
                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="title" 
                                        type="text"
                                        onChange={(e) => handleTitleChange(e)}
                                    />
                            </div>
                            <div class="mt-6 mb-5" >
                                <label class="block text-gray-700 text-sm" for="title">
                                    Description:
                                </label>
                                <textarea 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="title" 
                                    type="text"
                                    style={{minHeight: "9em"}}
                                    onChange= {(e) => handleDescChange(e)}
                                />
                            </div>
                            <div class="mt-6 mb-3" >
                                <label class="block text-gray-700 text-sm mb-2" for="password">
                                    Rate Type
                                </label>
                                <div>
                                    <select 
                                            onChange={e => handleRateType(e)}
                                            class="shadow block appearance-none text-gray-700 w-full bg-white border px-3 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
                                            <option value="">choose ...</option>
                                            <option value="hourly">Hourly fee</option>
                                            <option value="flatFee">Flat fee</option>
                                    </select>
                                </div>
                            </div>
                            {
                                rateType == "hourly" ?
                                    <div class="mt-6 mb-3" >
                                        <label class="block text-gray-700 text-sm mb-2" for="password">
                                            Hourly Rate (USD)
                                        </label>
                                        <div>
                                            <input 
                                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                id="hourly-fee" 
                                                type="number"
                                                onChange={e => handleRateChange(e)}
                                            />
                                        </div>
                                    </div>
                                :
                                    rateType == "flatFee" ?
                                        <div class="mt-6 mb-3" >
                                            <label class="block text-gray-700 text-sm mb-2" for="password">
                                                Flat Fee (USD)
                                            </label>
                                            <div>
                                                <input 
                                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="flat-fee" 
                                                    type="number"
                                                    onChange={e => handleRateChange(e)}
                                                />
                                            </div>
                                        </div>
                                    :
                                    ""
                            }
                            <div class="flex justify-start my-5">
                                <button 
                                    class="hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="button" 
                                    style={{backgroundColor: "#3490ff"}}
                                    onClick={() => handleForward()}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                        :
                        formStep == 2 ? 
                            <div>
                                <div class="mt-6 mb-3" >
                                    <label class="block text-gray-700 text-sm mb-2" for="password">
                                        Average Time Taken (Hours)
                                    </label>
                                    <div>
                                        <input 
                                            class="shadow appearance-none border w-full mr-3 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="hourly-fee" 
                                            type="number"
                                            onChange={e => handleAvgTimeTaken(e)}
                                            />
                                    </div>
                                </div>
                                <div class="mt-6 mb-3" >
                                    <label class="block text-gray-700 text-sm mb-2" for="password">
                                        Proposed date of completion
                                    </label>
                                    <div>
                                        <input 
                                            class="shadow appearance-none border w-full mr-3 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="hourly-fee" 
                                            type="date"
                                            onChange= {e => handleProposedDeadline(e)}
                                            />
                                    </div>
                                </div>
                                <div class="mt-6 mb-5" >
                                    <label for="price" class="block text-gray-700 text-sm">Related Files (Optional)</label>
                                    <input 
                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="budget" 
                                        type="file"
                                        multiple
                                    />
                                </div>
                                <div class="flex justify-start my-5">
                                    {showData()}
                                </div>
                            </div>
                        :
                        ""
                    }
                </form>
            </div>
        </div>
    )
}

export default ReplyCaseRequest