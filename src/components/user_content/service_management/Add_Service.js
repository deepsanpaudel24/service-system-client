import React , {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {PulseLoader} from "react-spinners";
import _, { add } from "lodash";
import validator from "validator";
import { AddServiceDispatcher, AddServiceResponseReset } from "../../actions/service_management/AddServiceAction";

const AddService = (props) => {
    const [serviceTitle, setServiceTitle] = useState("")
    const [rateType, setRateType]  = useState("")
    const [rate, setRate] = useState(0)
    const [avgTimeTaken, setAvgTimeTaken] = useState("")
    const dispatch = useDispatch()
    const response = useSelector(state => state.ServiceRegisterReponse)

    const handleServiceTitle = e => {
        setServiceTitle(e.target.value)
    }

    const handleRateType = e => {
        setRateType(e.target.value)
    }

    const handleRateChange = e => {
        setRate(e.target.value)
    }

    const handleAvgTimeTaken = e => {
        setAvgTimeTaken(e.target.value)
    }

    const dataValidator = () => {
        var data = {
            title: serviceTitle,
            rateType: rateType,
            rate: rate,
            averageTimeTake: avgTimeTaken
        }
        //dispatch the action here
        dispatch(AddServiceDispatcher(data))
    }

    const dataValidatorNext = () => {
        var data = {
            title: serviceTitle,
            rateType: rateType,
            rate: rate,
            averageTimeTake: avgTimeTaken
        }
        var addNext = "true"
        //dispatch the action here
        dispatch(AddServiceDispatcher(data, addNext))
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

    const confirmServiceRegister = () => {
        if(!_.isEmpty(response.data)){
            if(response.addNext == "true"){
                return (
                    <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4" role="alert">
                        <p class="font-bold">Service added successfully</p>
                    </div>
                )
            }
            return(
                props.history.push("/user/services")
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
                    class="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    onClick={() => dataValidatorNext()}
                >
                    Add and continue
                </button>
                <button 
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    onClick={() => dataValidator()}
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
                    <p class="text-3xl my-3">Add Service</p>
                    {showServerError()}
                    {confirmServiceRegister()}
                    <div class="mt-6 mb-3" >
                        <label class="block text-gray-700 text-sm mb-2" for="password">
                            Service Title
                        </label>
                        <div>
                            <input 
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="service_title" 
                                type="text"
                                onChange={e => handleServiceTitle(e)}
                            />
                        </div>
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
                    <div class="flex justify-start my-5" >
                        {showData()}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddService