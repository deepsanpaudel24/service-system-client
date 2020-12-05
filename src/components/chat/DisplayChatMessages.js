import React, { useState } from "react";
import axios from "axios";
import download from "downloadjs";
import {VscFile, VscFileMedia} from "react-icons/vsc"

const DisplayChatMessages = (props) => {
  const { allMessages, currentUserId, caseId } = props;
  const [todayDisplay, setTodayDisplay] = useState(true);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  var current_date = new Date();

  const handleFileOpen = (filename) => {
    let config = {
      method: "post",
      url: "/static/allFiles/" + filename,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "application/json; application/octet-stream",
      },
      responseType: 'blob',
      data: {
        caseId: caseId,
      },
    };
    axios(config)
      .then((resp) => {
        //takes the filename from the response and stores it in the resp_file_name
        const resp_file_name = resp.headers["content-disposition"].split(
          "filename="
        )[1];
        //takes the content type in the content const
        const content = resp.headers["content-type"];
        //downloads the file in the response
        download(resp.data, resp_file_name, content);
      })
      .catch((error) => {
        console.log("File could not be accessed");
      });
  };

  function TimeConverter(message_date) {
    var hours = message_date.getHours();
    var minutes = message_date.getMinutes();

    // Check whether AM or PM
    var newformat = hours >= 12 ? "PM" : "AM";

    // Find current hour in AM-PM Format
    hours = hours % 12;

    // To display "0" as "12"
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return hours + ":" + minutes + " " + newformat;
  }

  return allMessages.map((msgObj) => {
    const { message, sender, created_at, _id, message_type, senderId } = msgObj;
    // storing JSX to the element
    let element;
    let element_key = "";
    var message_date = new Date(created_at);

    //Checking whether message in normal text or images or pdf/docs
    if (message_type === "MULTIMEDIA") {
      let image_type_list = ["jpeg", "jpg", "png"];
      let url = new URL(message);
      let dir = url.pathname.split("/");
      let file_name = dir.slice(-1)[0];
      let file_extension = file_name.split(".")[1].toLowerCase();
      if (file_name.length < 12){
        var display_name = file_name
      }
      else {
        var display_name = file_name.slice(0,12) + " ..."
      }
      if (image_type_list.includes(file_extension)) {
        element_key = _id.$oid;
        element = (
          <div class="message bg-blue-500 text-white text-md p-2 self-end my-2 rounded-md shadow ml-3">
            <button class="px-2 my-1 focus:outline-none" onClick={() => handleFileOpen(file_name)}>
              <span class="flex">
                <VscFileMedia class="my-1 mr-1"/>
                {display_name}
              </span>
            </button>
          </div>
        );
      } else {
        element_key = _id.$oid;
        element = (
          <>
            {
              currentUserId === senderId.$oid ? 
                <div class="message bg-blue-500 text-white text-md p-2 self-end my-2 rounded-md shadow ml-3">
                  <button class="px-2 my-1 focus:outline-none" onClick={() => handleFileOpen(file_name)}>
                    <span class="flex">
                      <VscFile class="my-1 mr-1"/>
                      {display_name}
                    </span>
                  </button>
                </div>
                :
                <>
                  <p class="text-xs text-gray-600 px-2 mt-2">
                    {sender}{" "}
                    {current_date.getDate() == message_date.getDate()
                      ? TimeConverter(message_date)
                      : message_date.getDate() +
                        "-" +
                        months[message_date.getMonth()] +
                        "-" +
                        message_date.getFullYear()}
                  </p>
                    <div class="message bg-white text-gray-700 text-md p-2 self-start my-2 rounded-md shadow ml-3">
                    <button class="px-2 my-1 focus:outline-none" onClick={() => handleFileOpen(file_name)}>
                      <span class="flex">
                        <VscFile class="my-1 mr-1"/>
                        {display_name}
                      </span>
                    </button>
                  </div>
                </>
            }
          </>
        );
      }
    } else {
      element_key = _id.$oid;
      element = (
        <>
          {currentUserId === senderId.$oid ? (
            <div class="message bg-blue-500 text-white text-md p-2 self-end my-2 rounded-md shadow ml-3">
              {message}
            </div>
          ) : (
            <>
              <p class="text-xs text-gray-600 px-2 mt-2">
                {sender}{" "}
                {current_date.getDate() == message_date.getDate()
                  ? TimeConverter(message_date)
                  : message_date.getDate() +
                    "-" +
                    months[message_date.getMonth()] +
                    "-" +
                    message_date.getFullYear()}
              </p>
              <div class="chat bg-white text-gray-700 text-md p-2 self-start mb-2 rounded-md shadow mr-3">
                {message}
              </div>
            </>
          )}
        </>
      );
    }
    return <>{element}</>;
  });
};

export default DisplayChatMessages;
