import React, {useState, useEffect, useLayoutEffect} from "react";
import axios from "axios";
import _ from "lodash"

const ClientNonCaseIntakeFormDetails = () => {
    const [formValues, setFormValues] = useState([])
    const [allFormValues, setAllFormValues] = useState([]) 
    useLayoutEffect(() => {
        var string = document.location.pathname;
        var urlvalues = string.toString().split("/");
        const config = {
            method: "get",
            url: "/api/v1/intake-form/filled-details/" + urlvalues[3],
        };
        axios(config)
        .then((res) => {
            var allFormValuesCollection = []
            res.data.map((item) => allFormValuesCollection.push(item))
            setAllFormValues(allFormValuesCollection)
        })
        .catch((error) => {
            console.log(error.response)
        });
    }, [])

    useEffect(() => {

    }, [formValues])
    return(
        <div>
            {
                !_.isEmpty(allFormValues) &&
                allFormValues.map((item) => {
                    return (
                        <div>
                        <p class="text-2xl my-3">{item.form_title}</p>
                            {
                                Object.entries(item.formValues).map(([key, value]) => {
                                    return(
                                        <div class="flex">
                                            <div class="w-1/5 mb-4">
                                                {key}
                                            </div>
                                            <div class="w-1/5">
                                                {value}
                                            </div>
                                        </div>
                                        )
                                    })   
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ClientNonCaseIntakeFormDetails