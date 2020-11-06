import React, { useEffect, useState, useLayoutEffect } from "react";
import _ from "lodash";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { SaveIntakeFormDispatcher } from "../../actions/form_generator/SaveIntakeFormAction";
import { FaEdit, FaPlus } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FormBuilder } from "./FormBuilder";
import { CreateIntakeFormDispatcher } from "../../actions/form_generator/CreateIntakeFormAction";

const NewCreateIntakeForm = (props) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formFields, setFormFields] = useState([]); // store the formfields from database form firsttime with axiso request
  const [showBuilder, setShowBuilder] = useState(false);
  const [options, setOptions] = useState(["Choose..."]);
  const [formBuilderLabel, setFormBuilderLabel] = useState(""); // used to store the label value from form builder compoment
  const [formBuilderInputType, setFormBuilderInputType] = useState(""); // used to store the input type value from form builder compoment
  const [showSaveChangesButton, setShowSaveChangeButton] = useState(false);
  const [requestMethodDecider, setRequestMethodDecider] = useState("post"); //know's form is built for thefirst time or not
  //when any field is edited it set these two states
  const [editingMode, setEditingMode] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);
  const dispatch = useDispatch();
  const response = useSelector((state) => state.CreateIntakeFormResponse);

  const reset = () => {
    setShowBuilder(false);
    setOptions(["Choose..."]);
    setFormBuilderLabel("");
    setFormBuilderInputType("");
    setEditingMode(false);
    setEditingFieldIndex(null);
  };

  const handleEdit = (index) => {
    reset(); // to clear all save state and make to default
    setShowBuilder(true);
    setEditingFieldIndex(index);
    setEditingMode(true);
    var editedField = formFields[index];
    setFormBuilderInputType(editedField["type"]);
    setFormBuilderLabel(editedField["label"]);
    if (editedField.hasOwnProperty("options")) {
      setOptions(editedField["options"]);
    }
  };

  const handleDelete = (index) => {
    var newFormFields = [...formFields];
    console.log(newFormFields, "while copying");
    newFormFields.splice(index, 1);
    console.log(newFormFields, "after slicing");
    setFormFields(newFormFields);
    setShowSaveChangeButton(true); // show save changes button on form displaying side
  };

  const handleAddNewField = () => {
    // making default state: reason: if any field is edited the its properties are saved in state.
    reset();
    setShowBuilder(true); // for displaying from builder
  };

  //When submiting from form displaying
  const handelFinalFormSubmit = () => {
    var data = {
      formFields: formFields,
      formTitle: formTitle,
    };
    // var method = requestMethodDecider;
    dispatch(CreateIntakeFormDispatcher(data));
    setShowSaveChangeButton(false);
  };

  const ConfirmFormSave = () => {
    if (!_.isEmpty(response.data)) {
      return props.history.push("/user/intake-form/list");
    }
  };
  const showSaveButton = () => {
    return (
      <button
        class="hover:bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline"
        type="button"
        style={{ backgroundColor: "#3490ff" }}
        onClick={() => handelFinalFormSubmit()}
      >
        Save Changes
      </button>
    );
  };
  const handleTitleChange = (e) => {
    setFormTitle(e.target.value);
  };

  // THESE FUNCTIONS ARE SEND TO FORMBUILDER AS PROPS
  const labelChange = (e) => {
    if (editingMode) {
      formFields[editingFieldIndex]["label"] = e.target.value;
      setFormFields(formFields);
    }
    setFormBuilderLabel(e.target.value);
  };

  const inputTypeChange = (e) => {
    if (editingMode) {
      formFields[editingFieldIndex]["type"] = e.target.value;
      setFormFields(formFields);
    }
    setFormBuilderInputType(e.target.value);
  };

  // codes that are related to select field options
  const selectFieldOptionsAdd = () => {
    var optionList = [...options, ""];
    setOptions(optionList);
    // for rerendering the form option list in while options are removed
    if (editingMode) {
      formFields[editingFieldIndex]["options"] = optionList;
      setFormFields(formFields);
    }
  };

  const selectFieldOptionsRemove = (index) => {
    var optionList = [...options];
    optionList.splice(index, 1);
    setOptions(optionList);
    //for rerendering the form option list in while options are removed
    if (editingMode) {
      formFields[editingFieldIndex]["options"] = optionList;
      setFormFields(formFields);
    }
  };

  const selectFieldOptionsChange = (e, index) => {
    //updating the option state
    var optionList = [...options];
    optionList[index] = e.target.value;
    setOptions(optionList);
    if (editingMode) {
      formFields[editingFieldIndex]["options"][index] = e.target.value;
      setFormFields(formFields);
    }
  };

  const saveFormBuilder = () => {
    if (!editingMode) {
      //adding new field
      var newFieldToAdd = {
        label: formBuilderLabel,
        type: formBuilderInputType,
      };
      if (formBuilderInputType == "select") {
        newFieldToAdd["options"] = options;
      }
      var newFormFields = [...formFields, newFieldToAdd];
      setFormFields(newFormFields);
    }

    setShowSaveChangeButton(true); // show save changes button on form displaying side
    // making to default state
    reset();
  };

  return (
    <div class="mb-4">
      <p class="text-3xl mt-3 mb-6">Client Intake Form</p>
      {ConfirmFormSave()}
      <div class="flex ">
        {/* Form Display div */}
        <div class="w-2/5">
          <div class="mt-6 mb-5">
            <label class="block text-gray-700 text-sm" for="title">
              Form Title:
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              onChange={(e) => handleTitleChange(e)}
            />
          </div>
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
                      <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <label class="block text-gray-700 text-sm">
                          <button
                            class="focus:outline-none"
                            onClick={() => handleEdit(index)}
                          >
                            <p class="text-blue-400">
                              <FaEdit />
                            </p>
                          </button>
                          <button
                            class="focus:outline-none"
                            onClick={() => handleDelete(index)}
                          >
                            <p class="text-red-400 ml-3">
                              <RiDeleteBin5Line />
                            </p>
                          </button>
                        </label>
                      </div>
                    </div>
                    {field.type == "textarea" ? (
                      <Textarea field={field}></Textarea>
                    ) : field.type == "select" ? (
                      <Select field={field} options={field.options}></Select>
                    ) : (
                      <AnyField field={field.type}></AnyField>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Display fields that are set in state by formBuilder */}

            {/* Reason for doing this: while editing the any field it set  it's properties 
            on state and render the html for label and input type in editing mode which is unnecessary,
            and doing this conditon prevent redering.
            */}

            {editingMode
              ? ""
              : formBuilderLabel && (
                  <label class="block text-gray-700 text-sm" for="label">
                    {formBuilderLabel}
                  </label>
                )}

            {/* {formBuilderLabel && (
              <label class="block text-gray-700 text-sm" for="label">
                {formBuilderLabel}
              </label>
            )} */}

            {editingMode ? (
              ""
            ) : formBuilderInputType && formBuilderInputType == "textarea" ? (
              <Textarea field={formBuilderInputType}></Textarea>
            ) : formBuilderInputType == "select" ? (
              <Select field={formBuilderInputType} options={options}></Select>
            ) : formBuilderInputType == "text" ||
              formBuilderInputType == "number" ? (
              <AnyField field={formBuilderInputType}></AnyField>
            ) : (
              ""
            )}

            {/* End of formfields map */}
            <button
              class="mt-4 mb-3 w-full border-dashed border-2 border-gray-300 hover:bg-gray-100 flex text-gray-500 font-bold py-2 px-4 rounded focus:outline-none"
              onClick={() => handleAddNewField()}
            >
              <FaPlus class="mt-1 mr-2" />
              Add Field
            </button>
          </div>
          {showSaveChangesButton && (
            <div class="flex justify-start my-5">{showSaveButton()}</div>
          )}
        </div>

        {/* THIS BELOW CODE IS FOR FORM BUILDER */}
        <div class="w-1/5"></div>
        {showBuilder && (
          <FormBuilder
            options={options}
            label={formBuilderLabel}
            inputType={formBuilderInputType}
            labelChange={labelChange}
            inputTypeChange={inputTypeChange}
            selectFieldOptionsChange={selectFieldOptionsChange}
            selectFieldOptionsAdd={selectFieldOptionsAdd}
            selectFieldOptionsRemove={selectFieldOptionsRemove}
            saveFormBuilder={saveFormBuilder}
          ></FormBuilder>
        )}
      </div>
      <pre>{JSON.stringify(formBuilderLabel, null, 2)}</pre>
      <pre>{JSON.stringify(formBuilderInputType, null, 2)}</pre>
      <pre>{JSON.stringify(editingMode, null, 2)}</pre>
      <pre>{JSON.stringify(editingFieldIndex, null, 2)}</pre>
    </div>
  );
};
export default NewCreateIntakeForm;

// BELOW EXPORT COMPONENTS ARE FORM  FORM FIELDS

// Textarea component
export const Textarea = (props) => {
  const { field } = props;
  return (
    <textarea
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="title"
      type="text"
      style={{ minHeight: "9em" }}
    />
  );
};

// TextField component
export const AnyField = (props) => {
  const { field } = props;
  return (
    <input
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="label"
      type={field}
    />
  );
};

// Select component
export const Select = (props) => {
  const { field, options } = props;
  return (
    <div>
      <select class="shadow block appearance-none text-gray-700 w-full bg-white border px-3 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
        {options.map((item) => {
          return <option value={item}>{item}</option>;
        })}
      </select>
      <pre>{JSON.stringify(options, null, 2)}</pre>
    </div>
  );
};
