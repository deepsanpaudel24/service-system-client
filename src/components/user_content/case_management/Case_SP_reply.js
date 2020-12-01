import React , {useState, useLayoutEffect, useEffect} from "react";
import _ from "lodash";
import {PulseLoader} from "react-spinners";
import {useDispatch, useSelector} from "react-redux";
import { ReplyCaseRequestDispacther } from "../../actions/case_management/ReplyCaseRequestAction";
import { MdAttachFile, MdFileUpload } from "react-icons/md";
import { VscClose } from "react-icons/vsc";
import axios from "axios";

const ReplyCaseRequest = (props) => {
    const [currency, setCurrency] = useState("usd")
    const [paymentType, setPaymentType] = useState("full-payment")
    const [advancePayment, setAdvancePayment] = useState(1)
    const [advancePaymentError, setAdvancePaymentError] = useState(false)
    const [formStep, setFormStep] = useState(1)
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [rateType, setRateType]  = useState("")
    const [rate, setRate] = useState(0)
    const [avgTimeTaken, setAvgTimeTaken] = useState("")
    const [proposedDeadline, setProposedDeadline] = useState("")
    const [fileToSend, setFileToSend] = useState([]);
    const [fileNameToShow, setFileNameToShow] = useState([])  
    const [formEmptyError, setFormEmptyError] = useState("")
    const [caseId, setCaseId] = useState("")
    const dispatch = useDispatch()
    const response = useSelector(state => state.ReplyCaseRequestResponse)

    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/user/profile-details',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        axios(config)
        .then((res) => {
            setCurrency(res.data['currency_preferences'])
        })
    })

    useEffect(() => {
        var string = document.location.pathname
        var urlvalues = string.toString().split('/')
        setCaseId(urlvalues[4])
    }, [])

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

    const handlePaymentType = e => {
        setPaymentType(e.target.value)
    }

    const handleAdvancePayment = e => {
        if (e.target.value > 50 || e.target.value < 1){
            setAdvancePaymentError(true)
        }
        else {
            setAdvancePaymentError(false)
        }
        setAdvancePayment(e.target.value)
    }

    const handleRateChange = e => {
        setRate(e.target.value + " " + currency)
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

    // allowed file types
    const fileTypes = [
        "video/3gpp",
        "video/3gpp2",
        "video/3gp2",
        "video/mpeg",
        "video/mp4",
        "video/ogg",
        "video/webm",
        "video/quicktime",
        "image/jpg",
        "image/jpeg",
        "image/png",
        "text/plain",
        "text/csv",
        "application/msword",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    //Validate files
    const validateFile = (file) => {
        return fileTypes.includes(file.type);
    };

    const handleFileUpload = (e) => {
        var targetFiles = e.target.files
        var validateFilesList = []
        for (let file of targetFiles) {
            if (validateFile(file)) {
                validateFilesList.push(file)
            } else {
            console.log("File Not valid....");
            }
        }
        setFileToSend(validateFilesList)
        // loop through files
        var files = e.target.files
        var filesNameList = [] 
        for (var i = 0; i < files.length; i++) {
        // get item
        var file = files.item(i);
        filesNameList.push(file.name)
        }
        setFileNameToShow(filesNameList)
    }

    const handleRemoveChatFile = (name, index) => {
        var filteredFileList = []
        var fileList = fileToSend
        var NewFileNameList = fileNameToShow
    
        for (var i = 0; i < fileList.length; i++) {
          var file = fileList[i]
          if(file.name !== name){
            filteredFileList.push(file)
          } 
        }
        NewFileNameList.splice(index, 1)
        setFileToSend(filteredFileList)
        setFileNameToShow(NewFileNameList)
      }

    const handleReplyCaseRequest = () => {
        if(title == "" || desc == "" || rate == "" || avgTimeTaken == "" || proposedDeadline == ""){
            
          setFormEmptyError("Please fill up all the required fields")
        }
        else if (paymentType=="advance-payment" && advancePayment == "") {
            setFormEmptyError("Please fill up all the required fields")
        }
        else {
            var formData = new FormData();
            for (let file of fileToSend) {
                formData.append(file.name, file);
              }
            formData.append("title", title)
            formData.append("desc", desc)
            formData.append("rateType", rateType)
            formData.append("rate", rate)
            formData.append("averageTimeTaken", avgTimeTaken)
            formData.append("spDeadline", proposedDeadline)
            formData.append("paymentType", paymentType)
            formData.append("advancePayment", advancePayment)

          //send the case request to backend.
            var string = document.location.pathname
            var urlvalues = string.toString().split('/')
            var caseid = urlvalues[4]
            dispatch(ReplyCaseRequestDispacther(formData, caseid))
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
            props.history.push("/user/case/"+ caseId)
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
                { 
                    advancePaymentError ?
                    <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p class="font-bold">Advance payment should be between 0 - 50 %</p>
                    </div>
                    :
                    ""
                }
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
                                            key="rateType"
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
                                            Hourly Rate ({currency})
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
                                                Flat Fee ({currency})
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

                                <div class="mt-6 mb-3" >
                                    <label class="block text-gray-700 text-sm mb-2" for="password">
                                        Payment Type
                                    </label>
                                    <div>
                                        <select 
                                                key="paymentType"
                                                defaultValue={paymentType}
                                                onChange={e => handlePaymentType(e)}
                                                class="shadow block appearance-none text-gray-700 w-full bg-white border px-3 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
                                                <option value="full-payment">Full Payment after completion</option>
                                                <option value="advance-payment">Advance payment and final payment</option>
                                        </select>
                                    </div>
                                </div>

                                {
                                    paymentType == "advance-payment" ? 
                                        <div class="mt-6 mb-3" >
                                            <label class="block text-gray-700 text-sm mb-2" for="password">
                                                Advance payment ( In percentage )
                                            </label>
                                            <div>
                                                <input 
                                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="advance-payment" 
                                                    type="number"
                                                    defaultValue= {advancePayment}
                                                    max="50"
                                                    min="1"
                                                    required
                                                    onChange={e => handleAdvancePayment(e)}
                                                />
                                            </div>
                                        </div>
                                    :
                                        ""
                                }

                                <div class="mt-6 mb-5" >
                                    <label for="price" class="block text-gray-700 text-sm">Related Files (Optional)</label>
                                    <label for="allfilesMessage" style={{ cursor: "pointer" }}>
                                        <a>
                                            <em class="fa fa-upload"></em>{" "}
                                            <span class="bg-gray-200 border border-gray-100 hover:bg-grey text-grey-darkest py-2 px-4 rounded inline-flex items-center">
                                                <p class="text-lg"><MdFileUpload /></p>
                                                <span> &nbsp;Attach Files</span>
                                            </span>
                                        </a>
                                    </label>
                                    <input
                                        type="file"
                                        name="allfilesMessage"
                                        id="allfilesMessage"
                                        style={{ display: "none" }}
                                        onChange={e => handleFileUpload(e)}
                                        multiple
                                        accept="image/png, image/jpeg,.pdf,.doc,.docx,.xml,.txt,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    />
                                    {
                                        !_.isEmpty(fileNameToShow) ? 
                                            fileNameToShow.map((item, index) => {
                                                return(
                                                    <div class="flex mx-3 my-5">
                                                        <div class="w-3/12">
                                                            <p>{item}</p>
                                                        </div>
                                                        <div class="w-1/12">
                                                            <p class="text-red-400 mx-6 text-lg" onClick={() => handleRemoveChatFile(item, index)}><VscClose /></p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        :
                                        ""
                                    }
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