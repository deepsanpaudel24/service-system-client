import React, { useEffect, useState, useLayoutEffect } from "react";
import _ from "lodash";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin5Line } from "react-icons/ri";

const ClientFillForm = () => {
  const [formFields, setFormFields] = useState([]);
  const [formId, setFormId] = useState("")
  const [formValues, setFormValues] = useState({});
  useLayoutEffect(() => {
    const config = {
      method: "get",
      url: "/api/v1/client-fill-form",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then((res) => {
        setFormId(res.data['_id'].$oid)
        setFormFields(res.data["formFields"]);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);
  useEffect(() => {}, []);

  const handelInputTypeValueChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmit = () => {
    // _id, formValues, formId, FilledDate, clientId
    var data = {
      'formValues': formValues
    }
    const config = {
      method: "post",
      url: "/api/v1/intake-form/filled/" + formId,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      data : data
    }
    axios(config)
    .then((res) => {
      console.log(res.data)
    })
    .catch((error) => {
      console.log(error.response)
    })
  };

  return (
    <div class="mb-4">
      <p class="text-3xl mt-3 mb-6">Client Intake Form</p>
      <div class="flex ">
        {/* Form Display div */}
        <div class="w-2/5">
          <div class="border-dashed border-2 border-gray-300  px-5 py-3">
            {/* Displaying formfields that are first time fetched form database */}
              {formFields.map((field, index) => {
                return (
                  <div>
                    <div class="mt-3 mb-3">
                      <div class="relative flex items-center justify-between">
                        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                          <label class="block text-gray-700 text-sm">
                            {field.label}
                          </label>
                        </div>
                      </div>
                      {field.type == "textarea" ? (
                        <Textarea
                          field={field}
                          inputTypeValueChange={handelInputTypeValueChange}
                        ></Textarea>
                      ) : field.type == "select" ? (
                        <Select
                          field={field}
                          options={field.options}
                          inputTypeValueChange={handelInputTypeValueChange}
                        ></Select>
                      ) : (
                        <AnyField
                          field={field}
                          inputTypeValueChange={handelInputTypeValueChange}
                        ></AnyField>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* End of formfields map */}
              <button
                type="submit"
                class="mt-4 mb-3 w-full border-dashed border-2 border-gray-300 hover:bg-gray-100 flex text-gray-500 font-bold py-2 px-4 rounded focus:outline-none"
                onClick={() => handleFormSubmit()}
              >
                Submit
              </button>
          </div>
        </div>
      </div>
      <pre>{JSON.stringify(formValues, null, 2)}</pre>
    </div>
  );
};

export default ClientFillForm;

// Textarea component
export const Textarea = (props) => {
  const { field, inputTypeValueChange } = props;
  return (
    <textarea
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      name={field.label}
      type="text"
      style={{ minHeight: "9em" }}
      onChange={(e) => inputTypeValueChange(e)}
    />
  );
};

// TextField component
export const AnyField = (props) => {
  const { field, inputTypeValueChange } = props;
  return (
    <div>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type={field.type}
        name={field.label}
        onChange={(e) => inputTypeValueChange(e)}
      />
    </div>
  );
};

// Select component
export const Select = (props) => {
  const { field, options, inputTypeValueChange } = props;
  return (
    <div>
      <select
        class="shadow block appearance-none text-gray-700 w-full bg-white border px-3 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
        name={field.label}
        onChange={(e) => inputTypeValueChange(e)}
      >
        {options.map((item) => {
          return <option value={item}>{item}</option>;
        })}
      </select>
    </div>
  );
};
