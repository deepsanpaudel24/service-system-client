import React , {useState} from "react";
import _ from "lodash";
import CreatableSelect from 'react-select/creatable';
import {PulseLoader} from "react-spinners";
import {useDispatch, useSelector} from "react-redux";
import { NewCaseRequestDispacther } from "../../actions/case_management/NewCaseRequestAction"
import { AddCustomTaskDispacther } from "../../actions/custom_task/AddCustomTaskAction";

const CreateTask = (props) => {
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [deadline, setDeadline] = useState("")
    const [formEmptyError, setFormEmptyError] = useState("")
    const dispatch = useDispatch()
    const response = useSelector(state => state.AddCustomTaskResponse)

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
  
    const handleNewCaseRequest = () => {
        if(title == "" || desc == "" ){
            setFormEmptyError("Please fill up all the required fields")
        }
        else {
            //send the case request to backend.
            var data = {
                    "title": title,
                    "desc": desc,
                    "deadline": deadline,
            }
            dispatch(AddCustomTaskDispacther(data))
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
               props.history.push("/user/tasks")
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
                class="hover:bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                type="button" 
                style={{backgroundColor: "#3490ff"}}
                onClick={() => handleNewCaseRequest()}
                >
                    Add
                </button>
            </div>
        )
  
    }

    return (
        <div class="flex mb-4">
            <div class="w-3/5 ml-5">
                <form>
                    <p class="text-3xl my-3" >Add New Task</p>
                    <div class="border-t border-gray-200"></div>
                    {showServerError()}
                    {confirmNewCaseRequest()}
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
                            <label for="price" class="block text-gray-700 text-sm">Deadline (Optional)</label>
                            <input 
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="budget" 
                                type="date"
                                onChange={(e) => handleDeadline(e)}
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

export default CreateTask