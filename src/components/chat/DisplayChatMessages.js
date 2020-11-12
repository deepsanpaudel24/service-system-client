import React, { useState } from "react";

const DisplayChatMessages = (props) => {
  const { allMessages, currentUserId} = props;
  const [todayDisplay, setTodayDisplay] = useState(true)
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  var current_date = new Date()

  function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }

  function TimeConverter(message_date) { 
    //var date = new Date(); 
    var hours = message_date.getHours(); 
    var minutes = message_date.getMinutes(); 
    
    // Check whether AM or PM 
    var newformat = hours >= 12 ? 'PM' : 'AM';  
    
    // Find current hour in AM-PM Format 
    hours = hours % 12;  
    
    // To display "0" as "12" 
    hours = hours ? hours : 12;  
    minutes = minutes < 10 ? '0' + minutes : minutes; 
    
   return (hours + ':' + minutes + ' ' + newformat)
  } 

  return allMessages.map((msgObj) => {
    const { message, sender, created_at, _id, message_type, senderId } = msgObj;
    // storing JSX to the element
    let element;
    let element_key = "";
    var message_date = new Date(created_at)
    

    //Checking whether message in normal text or images or pdf/docs
    if (message_type === "MULTIMEDIA") {
      let image_type_list = ["jpeg", "jpg", "png"];
      let url = new URL(message);
      let dir = url.pathname.split("/");
      let file_name = dir.slice(-1)[0];
      let file_extension = file_name.split(".")[1].toLowerCase();

      if (image_type_list.includes(file_extension)) {
        element_key = _id.$oid;
        element = (
          <>
            {/* <p>{sender}:</p> */}
            <a class="bg-gray-100 self-end my-1" href={message} target="_blank" rel="noopener noreferrer">
              <img src={message} alt={file_name} width="20%" height="20%" />
            </a>
            {/* <i>{created_at}</i> */}
          </>
        );
      } else {
        element_key = _id.$oid;
        element = (
          <>
            {/* <b>{sender}:</b> */}
            <a class="bg-gray-100 self-end my-1" href={message} target="_blank" rel="noopener noreferrer">
              {file_name}
            </a>
            {/* <i>{created_at}</i> */}
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
              {/* <p class="text-xs text-gray-600 px-2 mt-2">{sender} {current_date.getDate() == message_date.getDate() ? tConvert(`${message_date.getHours()}:${message_date.getMinutes()}:${message_date.getSeconds()}`): message_date.getDate()+"-"+ months[message_date.getMonth()]+"-"+message_date.getFullYear()}</p> */}
              <p class="text-xs text-gray-600 px-2 mt-2">{sender} {current_date.getDate() == message_date.getDate() ? TimeConverter(message_date) : message_date.getDate()+"-"+ months[message_date.getMonth()]+"-"+message_date.getFullYear()}</p>
              <div class="chat bg-white text-gray-700 text-md p-2 self-start mb-2 rounded-md shadow mr-3">
                {message}
              </div>
            </>
          )}
         
          {/* <p>
            <b>{sender}:</b> {message} <i>{created_at}</i>
          </p> */}
        </>
      );
    }
    return <>{element}</>;
  });
};

export default DisplayChatMessages;
