import axios from "axios";
import React, {useState, useEffect, useLayoutEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import _ from "lodash";
import {PulseLoader} from "react-spinners";
import ProfileNav from "./Profile_nav";
import UserTypeIcon from "../../images/user_type.png";
import "./User_type_setup.css";
import UpdateUserType from "../actions/UserTypeAction";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";

const SetupUserType = ({t}) => {
    const history = useHistory();
    const [stepOneType, setStepOneType] = useState("C")
    const [stepTwoType, setStepTwoType] = useState("CA")
    const [userType, setUserType] = useState("NR")      // NR is used for Not Received User Type
    const [formStep, setFormStep] = useState("1")
    const dispatch = useDispatch()
    const response = useSelector(state => state.updateUserTypeResponse)


    useLayoutEffect(() => {
        const config = {
            method: 'get',
            url: '/api/v1/user/validity',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
        }
        axios(config)
        .then((res) => {
            setUserType(res.data['user_type'])
        })
        .catch((error) => {
            history.push("/user/login");
        })
    }, [])

    useEffect(() => {
        
    }, [userType])

    const handleStepOneType = (e) => {
        setStepOneType(e.target.value)
    }

    // const handleStepTwoType = (e) => {
    //     setStepTwoType(e.target.value)
    // }

    const handleStepOneSubmit = () => {
        setFormStep("2")
    }

    const handleUserTypeSubmit = () => {
        var data = {
            "user_type": stepOneType.concat(stepTwoType)
        }
        dispatch(UpdateUserType(data))
    }

    const showServerError = () => {
        if(!_.isEmpty(response.serverErrorMsg)){
            return (
                <div class="bg-red-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                    <p class="font-bold">{t("be_warned")}</p>
                    <p>{response.serverErrorMsg}</p>
                </div>
            )
        }
    }


    const showData = () => {
        if(!_.isEmpty(response.data)) {
            localStorage.setItem('access_token', response.data['access_token'])
            localStorage.setItem('refresh_token', response.data['refresh_token'])
            history.push("/user/setup/profile/details");
        }
        if(response.loading){
            return (
                <button 
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    disabled
                >
                    {t("submit")}
                </button>
            )
        }
        return (
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => handleUserTypeSubmit()}
          >
            {t("submit")}
          </button>
        );

    }

    return (
      <div>
        {userType == "NR" ? (
          <div class="flex h-screen">
            <div class="m-auto">
              <PulseLoader size={10} color={"#6DADE3"} loading={true} />
            </div>
          </div>
        ) : (
          <div>
            <div>
              {showServerError}
              <ProfileNav />
            </div>
            <div class="container mx-auto w-auto py-4">
              <form>
                <div class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
                  {formStep == "1" ? (
                    <div class="flex mb-4">
                      <div class="w-1/6  h-15"></div>
                      <div class="w-2/6  h-15">
                        <img src={UserTypeIcon} alt="Select user type" />
                      </div>
                      <div class="w-2/6 h-12 my-10">
                        <p class="text-3xl mt-5 mb-4">
                          {t("select_user_type")}
                        </p>
                        <p class="text-1xl mt-5 mb-10 text-gray-500 text-s italic">
                          {t("select_role")}
                        </p>
                        <div class="flex items-center mr-4 mb-4">
                          <input
                            id="radio1"
                            type="radio"
                            name="radio"
                            class="hidden"
                            value="SP"
                            onClick={(e) => {
                              handleStepOneType(e);
                            }}
                          />
                          <label
                            for="radio1"
                            class="flex items-center cursor-pointer"
                          >
                            <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                            {t("you_are_a_service_provider")}
                          </label>
                        </div>
                        <div class="flex items-center mr-4 mb-4">
                          <input
                            id="radio2"
                            type="radio"
                            name="radio"
                            class="hidden"
                            value="C"
                            onClick={(e) => {
                              handleStepOneType(e);
                            }}
                            checked
                          />
                          <label
                            for="radio2"
                            class="flex items-center cursor-pointer"
                          >
                            <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                            {t("you_are_looking_for_services")}
                          </label>
                        </div>
                        <div class="flex justify-between my-2">
                          <div class="flex justify-between my-2">
                            {showData()}
                          </div>
                        </div>
                      </div>
                      <div class="w-1/6  h-15"></div>
                    </div>
                  ) 
                  : 
                  ""
                  }
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
}

export default withTranslation() (SetupUserType);