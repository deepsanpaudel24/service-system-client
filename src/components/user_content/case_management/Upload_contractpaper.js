import React, {useState} from "react";
import {PulseLoader} from "react-spinners";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {UploadContractPaperAction} from "../../actions/case_management/UploadContractPaperAction";

const UploadContractPaper = () => {
    const [fileToSend, setFileToSend] = useState([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [formEmptyError, setFormEmptyError] = useState("")
    const dispatch = useDispatch()
    const response = useSelector(state => state.UploadContractPaperResponse)

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
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const handleDescChange = (e) => {
        setDesc(e.target.value)
    }

    const handleSendContractPaper = () => {
        var string = document.location.pathname;
        var urlvalues = string.toString().split("/");
        if(title == "" || desc == "" ){
            setFormEmptyError("Please fill up all the required fields")
        }
        else if(_.isEmpty(fileToSend)){
            setFormEmptyError("Please upload the contract paper")
        }
        else {
            //send the case request to backend.
            var formData = new FormData();
            for (let file of fileToSend) {
                formData.append(file.name, file);
              }
            formData.append("title", title)
            formData.append("desc", desc)
            dispatch(UploadContractPaperAction(formData, urlvalues[5]))
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
                class="hover:bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                style={{backgroundColor: "#3490ff"}}
                onClick= {() => handleSendContractPaper()}
                >
                    Submit
                </button>
            </div>
        )
  
    }
    return(
        <div class="flex mb-4">
            <div class="w-3/5 ml-5">
                <form>
                    <p class="text-3xl my-3" >Send Contract Paper</p>
                    <div class="border-t border-gray-200"></div>
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
                                    onChange={(e) => handleDescChange(e)}
                                />
                            </div>
                            <div class="mt-6 mb-5" >
                                <label for="price" class="block text-gray-700 text-sm">Contract paper</label>
                                <input 
                                    class="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" 
                                    id="contract_paper" 
                                    type="file"
                                    multiple
                                    onChange={e => handleFileUpload(e)}
                                    accept="image/png, image/jpeg,.pdf,.doc,.docx,.xml,.txt,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                />
                            </div>
                            <div class="flex justify-start my-5">
                                {showData()}
                            </div>
                        </div>
                </form>
            </div>
        </div>
    )
}

export default UploadContractPaper