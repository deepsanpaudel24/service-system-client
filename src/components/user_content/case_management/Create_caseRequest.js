import React , {useState} from "react";
import _ from "lodash";
import CreatableSelect from 'react-select/creatable';
import {PulseLoader} from "react-spinners";
import {useDispatch, useSelector} from "react-redux";
import { NewCaseRequestDispacther } from "../../actions/case_management/NewCaseRequestAction"
import { VscClose } from "react-icons/vsc";

const CreateCaseRequest = (props) => {
    const [title, setTitle] = useState("")
    const [formStep, setFormStep] = useState(1)
    const [desc, setDesc] = useState("")
    const [budget, setBudget] = useState("")
    const [deadline, setDeadline] = useState("")
    const [caseTags, setCaseTags] = useState("")
    const [fileToSend, setFileToSend] = useState([]);
    const [fileNameToShow, setFileNameToShow] = useState([])  
    const [formEmptyError, setFormEmptyError] = useState("")
    const dispatch = useDispatch()
    const response = useSelector(state => state.NewCaseRequestResponse)

    const handleTitleChange = (e) => {
        setFormEmptyError("")
        setTitle(e.target.value)
    }
  
      const handleDeadline = (e) => {
        setFormEmptyError("")
        setDeadline(e.target.value)
    }
  
      const handleDescChange = (e) => {
        setFormEmptyError("")
        setDesc(e.target.value)
    }
  
      const handleBudgetChange = (e) => {
        setFormEmptyError("")
        setBudget(e.target.value)
    }

    const handleCaseTags = (e) => {
        // send the tags value to handleNewCaseRequest method
        var values = []
        if(_.isEmpty(e)){
            //
        }
        else {
            e.map((item, index) => {
                values.push(item.value)
            })
            setCaseTags(values.toString())
        }
    }

    const handleBackward = () => {
        setFormStep(1)
    }

    const handleForward = () => {
        setFormStep(2)
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

    const handleNewCaseRequest = () => {
        if(title == "" || desc == "" ){
            setFormEmptyError("Please fill up all the required fields")
        }
        else {
            //send the case request to backend.
            var formData = new FormData();
            for (let file of fileToSend) {
                formData.append(file.name, file);
              }
            formData.append("title", title)
            formData.append("desc", desc)
            formData.append("caseTags", caseTags)
            formData.append("budget", budget)
            formData.append("deadline", deadline)
            
            dispatch(NewCaseRequestDispacther(formData))
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
            props.history.push("/user/cases")
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
                onClick={() => handleNewCaseRequest()}
                >
                    Submit
                </button>
            </div>
        )
  
    }

    const options = [
        {label:'Law', value:'law'},
        {label:'Accounting', value: 'account'}
    ]

    return (
        <div class="flex mb-4">
            <div class="w-3/5 ml-5">
                <form>
                    <p class="text-3xl my-3" >New Case Request</p>
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
                                <div class="mt-6 mb-5" >
                                    <label for="price" class="block text-gray-700 text-sm">Approx budget (In USD) (Optional)</label>
                                    <input 
                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="budget" 
                                        type="number"
                                        onChange={(e) => handleBudgetChange(e)}
                                    />
                                </div>
                                <div class="mt-6 mb-5" >
                                    <label for="price" class="block text-gray-700 text-sm">Deadline (Optional)</label>
                                    <input 
                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="budget" 
                                        type="date"
                                        onChange={(e) => handleDeadline(e)}
                                    />
                                </div>
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
                                <div class="mt-6 mb-5">
                                    <label class="block text-black text-md mb-2" for="name">
                                        Case Tags:
                                    </label>
                                </div>
                                <CreatableSelect
                                    isMulti
                                    onChange={(e) => handleCaseTags(e)}
                                    options={options}
                                />
                                <div class="mt-6 mb-5" >
                                    <label for="price" class="block text-gray-700 text-sm">Related Files (Optional)</label>
                                    <input 
                                        class="rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id="budget" 
                                        type="file"
                                        multiple
                                        onChange={e => handleFileUpload(e)}
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

export default CreateCaseRequest