import React, { useEffect, useState, useLayoutEffect } from "react";
export const FormBuilder = (props) => {
  const {
    options,
    label,
    inputType,
    labelChange,
    inputTypeChange,
    selectFieldOptionsChange,
    selectFieldOptionsAdd,
    selectFieldOptionsRemove,
    saveFormBuilder,
  } = props;

  return (
    <div class="w-2/5 mr-6">
      <p class="text-xl text-gray-700">Form Builder</p>
      <div class="mt-6 mb-5">
        <label class="block text-gray-700 text-sm" for="label">
          Label
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          value={label}
          onChange={(e) => labelChange(e)}
        />
      </div>
      <div class="mt-6 mb-3">
        <label class="block text-gray-700 text-sm mb-2" for="type">
          Input type
        </label>
        <div>
          <select
            class="shadow block appearance-none text-gray-700 w-full bg-white border px-3 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => inputTypeChange(e)}
            value={inputType}
          >
            <option value="">Choose ...</option>
            <option value="text">Text field</option>
            <option value="number">Number field</option>
            <option value="textarea">Text area</option>
            <option value="select">Select field</option>
          </select>
        </div>

        {inputType == "select" && (
          <div>
            <label class="block text-gray-700 text-sm mb-2" for="type">
              Options
            </label>
            {options.map((option, index) => {
              return (
                <div class="flex my-2">
                  <input
                    class="shadow appearance-none border rounded w-3/5 ml-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name={option}
                    value={option}
                    onChange={(e) => selectFieldOptionsChange(e, index)}
                  />
                  {options.length !== 1 && index !== 0 && (
                    <button
                      class="bg-gray-300 text-gray-800 px-4 py-1 ml-2 focus:outline-none"
                      onClick={() => selectFieldOptionsRemove(index)}
                    >
                      -
                    </button>
                  )}

                  {options.length - 1 === index && (
                    <button
                      class="text-white px-4 py-1 ml-2 focus:outline-none"
                      style={{ backgroundColor: "#3490ff" }}
                      onClick={() => selectFieldOptionsAdd()}
                    >
                      +
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Display form builder save button  */}
      <div class="flex justify-start my-5">
        <button
          class="hover:bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded focus:outline-none focus:shadow-outline"
          type="button"
          style={{ backgroundColor: "#3490ff" }}
          onClick={() => saveFormBuilder()}
        >
          Add Field
        </button>
      </div>
    </div>
  );
};
