import React , {useState} from "react";
import _ from "lodash";
import CreatableSelect from 'react-select/creatable';
import {useDispatch, useSelector} from "react-redux";
import { NewCaseRequestDispacther } from "../../actions/case_management/NewCaseRequestAction"

const CreateCaseRequest = () => {
    const [title, setTitle] = useState("")
    const [type, setType] = useState("law")
    const [desc, setDesc] = useState("")
    const [budget, setBudget] = useState("")
    const [formEmptyError, setFormEmptyError] = useState("")
    const dispatch = useDispatch()
    const response = useSelector(state => state.NewCaseRequestResponse)

    const handleTitleChange = (e) => {
        setFormEmptyError("")
        setTitle(e.target.value)
    }
  
      const handleTypeChange = (e) => {
        setFormEmptyError("")
        setType(e.target.value)
    }
  
      const handleDescChange = (e) => {
        setFormEmptyError("")
        setDesc(e.target.value)
    }
  
      const handleBudgetChange = (e) => {
        setFormEmptyError("")
        setBudget(e.target.value)
    }

    const handleNewCaseRequest = () => {

        if(title == "" || desc == "" ){
          setFormEmptyError("Please fill up all the required fields")
        }
        else {
          //send the case request to backend.
          var data = {
            "title": title,
            "type": type,
            "desc": desc,
            "budget": budget
          }
          dispatch(NewCaseRequestDispacther(data))
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
                <p class="font-bold">New case requested successfully</p>
            </div>
           )
        }
    }
  
    const showData = () => {
  
        if(response.loading){
            return (
              <button 
                class="hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                style={{backgroundColor: "#3490ff"}}
                onClick={() => handleNewCaseRequest()}
              >
                  Loading...
              </button>
            )
        }
        return (
            <button 
              class="hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="button" 
              style={{backgroundColor: "#3490ff"}}
              onClick={() => handleNewCaseRequest()}
            >
                  Send
            </button>
        )
  
    }

    const handleCaseTags = () => {
        // send the tags value to handleNewCaseRequest method
    }

    const options = [
        {label:'React', value:'react'},
        {label:'Angular', value: 'angular'}
    ]

    return (
        <div class="flex mb-4">
            <div class="w-1/4"></div>
            <div class="w-2/5">
                <form>
                    <p class="text-3xl my-3" style={{textAlign: "center"}}>New Case Request</p>
                    <div class="border-t border-gray-200"></div>
                    {showServerError()}
                    {confirmNewCaseRequest()}
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
                    <div>
                        <div class="flex items-center ">
                            <label class="block text-gray-700 text-sm" for="name">
                                Case type:
                            </label>
                        </div>
                        <div class="flex items-center mr-4 mb-4">
                            <input id="radio1" type="radio" name="radio" class="hidden" value="law" onClick={(e) => {handleTypeChange(e)}}/>
                            <label for="radio1" class="flex items-center cursor-pointer mr-4">
                                <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                                <p class="text-gray-800">Law</p>
                            </label>
                            <input id="radio2" type="radio" name="radio" class="hidden" value="account"  onClick={(e) => {handleTypeChange(e)}}/>
                            <label for="radio2" class="flex items-center cursor-pointer mr-4">
                                <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                                <p class="text-gray-800">Account</p>
                            </label>
                        </div>
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
                        <label for="price" class="block text-gray-700 text-sm">Approx budget (In USD)</label>
                        <input 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            id="budget" 
                            type="number"
                            onChange={(e) => handleBudgetChange(e)}
                        />
                    </div>
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
                    <div class="flex justify-between my-5" style={{ justifyContent: "center"}}>
                        {showData()}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateCaseRequest