import React , {useEffect, useState, useLayoutEffect} from "react";
import _ from "lodash";
import axios from "axios";
import {PulseLoader} from "react-spinners";
import {useDispatch, useSelector} from "react-redux";
import { SaveIntakeFormDispatcher } from "../../actions/form_generator/SaveIntakeFormAction";
import {FaEdit, FaPlus} from "react-icons/fa";
import {RiDeleteBin5Line} from "react-icons/ri";


const ClientIntakeForm = (props) => {
    const [clientIntakeForm, setClientIntakeForm] = useState([])
    const [pageLoading, setPageLoading] = useState(true)

    const [showSaveChanges, setShowSaveChanges] = useState(false)

    const [optionCounter, setOptionCounter] = useState(1)
    const [showOptionAdd, setShowOptionAdd] = useState(false)

    const [showBuilder, setShowBuilder] = useState(false)
    const [fieldStep, setFieldStep] = useState(1)
    
    const [label, setLabel] = useState("")
    const [type, setType] = useState("")
    const [optionValue, setOptionValue] = useState("")
    const [options, setOptions] = useState([{"option" : "choose ..."}])

    const [tempEditableFormFields, setTempEditableFormFields] = useState({})
    
    const [formFields, setFormFields] = useState([])
    
    const [preview, setPreview] = useState(false)
    const dispatch = useDispatch()
    const response = useSelector(state => state.SaveIntakeFormResponse)
    
    var copyFormFields = []

    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/intake-form',
            headers: { 
              'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
          }
        axios(config)
        .then((res) => {
            setClientIntakeForm(res.data)
            setFormFields(res.data['formFields'])
            setPageLoading(false)
        })
        .catch((error) => {
            setPageLoading(false)
        })
    }, [])
  
      useEffect(() => {
          
      }, [clientIntakeForm])

    const handleLabelChange = (e) => {
        copyFormFields = formFields.filter((item) => item.label !== tempEditableFormFields.label);
        copyFormFields.push({...tempEditableFormFields, "label": e.target.value})
        setFormFields(copyFormFields)
        setTempEditableFormFields({...tempEditableFormFields, "label": e.target.value})
        // if e.target.value is in  ...formfields(label)
        // replace label 
    }

    const handleTypeChange = (e) => {
        if(e.target.value == "select"){
            copyFormFields = formFields.filter((item) => item.label !== tempEditableFormFields.label);
            copyFormFields.push({...tempEditableFormFields, "type": e.target.value, "options": [...options, {"option": optionValue, "value": optionValue}]})
            setFormFields(copyFormFields)
            setTempEditableFormFields({...tempEditableFormFields, "type": e.target.value, "options": [...options, {"option": optionValue, "value": optionValue}]})
            setType(e.target.value)
        }
        else{
            copyFormFields = formFields.filter((item) => item.label !== tempEditableFormFields.label);
            copyFormFields.push({...tempEditableFormFields, "type": e.target.value})
            setFormFields(copyFormFields)
            setTempEditableFormFields({...tempEditableFormFields, "type": e.target.value})
            setType(e.target.value)
        }

    }

    const handleOptionValue = (e) => {
        if(e.target.value !== ""){
            setShowOptionAdd(true)
            copyFormFields = formFields.filter((item) => item.label !== tempEditableFormFields.label);
            copyFormFields.push({...tempEditableFormFields, "options": [...options, {"option": e.target.value, "value": e.target.value}]})
            setFormFields(copyFormFields)
            setTempEditableFormFields({...tempEditableFormFields, "options": [...options, {"option": e.target.value, "value": e.target.value}]})
            setOptionValue(e.target.value)
        }
        else {
            setShowOptionAdd(false)
        }
        //setOptions([...options, {"option": e.target.value, "value": e.target}])
    }

    const handleOptionAdd = () => {
        //set the current option value to the options state
        if (optionValue !== ""){
            setOptions([...options, {"option": optionValue, "value": optionValue}])
            setOptionValue("")
            setOptionCounter(optionCounter+1)
            setShowOptionAdd(false)
        }
    }

    const handleOptionRemove = (optionValueC) => {
        var copyOptions = options.filter((item) => item.option !== optionValueC);
        setOptions(copyOptions);
        copyFormFields = formFields.filter((item) => item.label !== tempEditableFormFields.label);
        copyFormFields.push({...tempEditableFormFields, "options": copyOptions})
        setFormFields(copyFormFields)
        setTempEditableFormFields({...tempEditableFormFields, "options": copyOptions})

    }

    const handleSaveForm = () => {
        var data = {
            formFields: formFields
        }
        var method = _.isEmpty(clientIntakeForm) ? "post":"put"

        dispatch(SaveIntakeFormDispatcher(data, method))
        setShowBuilder(false)
        setShowSaveChanges(false)
    }
    

    // Make a copy of the clientInatakeForm state 

    const handleEdit = (label, type, optionsForEdit) => {
        setTempEditableFormFields({"label": label, "type": type, "options": optionsForEdit})
        setShowBuilder(true)
        setLabel(label)
        setType(type)
        setOptions(optionsForEdit)
    }

    const handleAddFormBuilder = () => {
        setShowBuilder(true)
        setFieldStep(fieldStep+1)
        setLabel("")
        setType("")
        setOptionValue("")
        setOptions([{"option" : "choose ..."}])
        setTempEditableFormFields({})
    }

    const handleDelete = (label) => {
        const NewClientIntakeForm = formFields.filter((item) => item.label !== label);
        setFormFields(NewClientIntakeForm)
        setShowSaveChanges(true)
        // Enable the save button to allow users to save the updated form
    }

    const confirmFieldAdded = () => {
        if(!_.isEmpty(response.data)){
           return(
            <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                <p class="font-bold">Form updated successfully</p>
            </div>
           )
        }
    }
    
    const showButtonSaveChanges = () => {
        return (
                <button 
                    class="hover:bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    style={{backgroundColor: "#3490ff"}}
                    onClick={() => handleSaveForm()}
                >
                    Save Changes
                </button>
        )
    }

    const showButtonsClientIntake = () => {
        return (
                <button 
                    class="hover:bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    style={{backgroundColor: "#3490ff"}}
                    onClick={() => handleSaveForm()}
                >
                    Save Field
                </button>
        )
    }

    return (
        <div class="mb-4">
            <p class="text-3xl mt-3 mb-6" >Client Intake Form</p>
                <div class="flex ">
                    <div class="w-2/5">
                        {confirmFieldAdded()}
                        <p class="text-xl text-gray-700 mb-2">Form Builder</p>
                        <div class="border-dashed border-2 border-gray-300  px-5 py-3">
                            {
                                formFields.map((item) => {
                                    return(
                                        <div>
                                            <div class="mt-3 mb-3" >
                                                <div class="relative flex items-center justify-between">
                                                    <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                                        <label class="block text-gray-700 text-sm" for="label">
                                                            {item.label}
                                                        </label>
                                                    </div>
                                                    <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                                        <label class="block text-gray-700 text-sm" for="label">
                                                            <button class="focus:outline-none" onClick={() => handleEdit(item.label, item.type, item.options)}>
                                                                <p class="text-blue-400"><FaEdit /></p>
                                                            </button>
                                                            <button class="focus:outline-none" onClick={() => handleDelete(item.label)}>
                                                                <p class="text-red-400 ml-3"><RiDeleteBin5Line /></p>
                                                            </button>
                                                        </label>
                                                    </div>
                                                </div>
                                                {
                                                    item.type == "textarea" ? 
                                                    <textarea 
                                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                        id="title" 
                                                        type="text"
                                                        style={{minHeight: "9em"}}
                                                    />
                                                    :
                                                    item.type == "select" ?
                                                    <select 
                                                        class="shadow block appearance-none text-gray-700 w-full bg-white border px-3 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
                                                        {item.options.map((el) => {
                                                            return (
                                                                    <option value={el.value}>{el.option}</option>
                                                            )
                                                        })}
                                                    </select>
                                                    :
                                                    <input 
                                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                        id="label" 
                                                        type={item.type}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <button 
                                class="mt-4 mb-3 w-full border-dashed border-2 border-gray-300 hover:bg-gray-100 flex text-gray-500 font-bold py-2 px-4 rounded focus:outline-none"
                                onClick={() => handleAddFormBuilder()}
                            >
                                <FaPlus class="mt-1 mr-2"/>Add Field
                            </button>
                        </div>
                        {
                            showSaveChanges ?
                            <div class="flex justify-start my-5">
                                {showButtonSaveChanges()}
                            </div>
                            :
                            ""
                        }
                    </div>
                    <div class="w-1/5"></div>
                    {
                        showBuilder ? 
                        <div class="w-2/5 mr-6">
                            <p class="text-xl text-gray-700">Form Builder</p>
                            <div class="mt-6 mb-5" >
                                <label class="block text-gray-700 text-sm" for="label">
                                    Label
                                </label>
                                    <input 
                                        key={fieldStep}
                                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        id={fieldStep} 
                                        type="text"
                                        defaultValue={label}
                                        onChange={(e) => handleLabelChange(e)}
                                    />
                            </div>
                            <div class="mt-6 mb-3" >
                                <label class="block text-gray-700 text-sm mb-2" for="type">
                                    Input type
                                </label>
                                <div>
                                    <select 
                                            defaultValue={type}
                                            key={fieldStep}
                                            onChange={e => handleTypeChange(e)}
                                            class="shadow block appearance-none text-gray-700 w-full bg-white border px-3 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
                                            <option value="">choose ...</option>
                                            <option value="text">Text field</option>
                                            <option value="number">Number field</option>
                                            <option value="textarea">Text area</option>
                                            <option value="select">Select field</option>
                                    </select>
                                </div>
                                {
                                    type == "select" ?
                                        <div>
                                            <label class="block text-gray-700 text-sm mb-2" for="type">
                                                Options
                                            </label>
                                            {options.map((option) => {
                                                return(
                                                    <div class= "flex my-2">
                                                        <input
                                                            key={option.option} 
                                                            class="shadow appearance-none border rounded w-3/5 ml-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                            type="text"
                                                            defaultValue={option.option}
                                                            onChange={(e) => handleOptionValue(e)}
                                                        />
                                                        <button class="bg-gray-300 text-gray-800 px-4 py-1 ml-2 focus:outline-none" onClick={() => handleOptionRemove(option.option)}>-</button>
                                                    </div>
                                                )
                                            })}
                                            <div class= "flex my-2">
                                                <input 
                                                    key= {optionCounter}
                                                    class="shadow appearance-none border rounded w-3/5 ml-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    type="text"
                                                    id={optionCounter}
                                                    onChange={(e) => handleOptionValue(e)}
                                                />
                                                {
                                                    showOptionAdd ?
                                                    <button class="text-white px-4 py-1 ml-2 focus:outline-none" style={{backgroundColor: "#3490ff"}} onClick={() => handleOptionAdd()}>+</button>
                                                    :
                                                    ""
                                                }
                                                
                                            </div>
                                        </div>
                                    :
                                    ""
                                }
                            </div>
                            <div class="flex justify-start my-5">
                            {showButtonsClientIntake()}
                            </div>
                        </div>
                    :
                    ""
                    }
                </div>
        </div>
    )
}

export default ClientIntakeForm