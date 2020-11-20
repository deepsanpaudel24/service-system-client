import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import DisplayChatMessages from "./DisplayChatMessages";
import "./chat.css";
import _ from "lodash";
import { MdAttachFile, MdSend } from "react-icons/md";
import { VscClose } from "react-icons/vsc";
import { HiChatAlt2 } from "react-icons/hi";

const ChatClientSide = (props) => {
  //functionality related variables
  const { userId, username, room } = props;
  const [showMoreCount, setShowMoreCount] = useState(null);
  const [msgInfo, setMsgInfo] = useState({
    message: "",
    allfilesMessage: [],
    userId: userId,
    username: username,
    room: room,
  });
  const [allMessages, setAllMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [fileNameToShow, SetFileNameToShow] = useState([])
 
  //Design related variables
  const chatModal = document.querySelector(".chat-modal");
  const chatServices = document.querySelector(".chat-services");

  const showChat = document.querySelector(".show-chat");
  const closeChat = document.querySelector(".close-chat");

  const handleShowChats = (value) => {
    const config = {
      method: "get",
      url: "/api/v1/chat-initial-message/" + room,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then((res) => {
        setAllMessages(res.data);
      })
      .catch((error) => {
        console.log(error.response);
      });

    if (value) {
      chatModal.classList.add("show");
      showChat.classList.add("hidden");
      setTimeout(() => {
        chatServices.classList.add("expand");
      }, 500);
    } else {
      setTimeout(() => {
        showChat.classList.remove("hidden");
      }, 820);
      chatServices.classList.remove("expand");
      setTimeout(() => {
        chatModal.classList.remove("show");
      }, 500);
    }
  };

  const handelShowMoreMessages = () => {
    let value = showMoreCount + 1;
    setShowMoreCount(value);

    const config = {
      method: "post",
      url: "/api/v1/chat-more-message/" + room,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      data: {
        count: value,
      },
    };
    axios(config)
      .then((res) => {
        console.log([...allMessages, ...res.data]);
        setAllMessages([...res.data, ...allMessages]);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  // establish socket connection
  useEffect(() => {
    setSocket(io.connect("http://127.0.0.1:5000"));
  }, []);

  useEffect(() => {
    if (!socket) return;
    // Connection event
    socket.on("connect", () => {
      console.log(socket.connected, username, room);
      clientConnect();
    });

    // Handel Event(join_status_reply) coming from server
    socket.on("join_status_reply", (data) => {
      clientJoinStatus(data);
    });

    // Handel Event(leave_status_reply) coming from server
    socket.on("leave_status_reply", (data) => {
      clientLeaveStatus(data);
    });

    //  Event(receive_message) handel messages comming from server
    socket.on("receive_message", (data) => {
      clientReceiveMessage(data);
    });

    socket.on("receive_file", (fileData, chatClientData) => {
      clientReceiveFile(fileData, chatClientData);
    });
  }, [socket]);

  /* ALL FUNCTIOINs THAT ARE CALLED IN USEEFFECT*/

  // function called for handeling connection
  const clientConnect = () => {
    socket.emit("join", msgInfo);
  };

  // function called while handeling join
  const clientJoinStatus = (data) => {
    console.log(data.message);
  };

  // function called while handeling leave
  const clientLeaveStatus = (data) => {
    console.log(data.message);
  };

  /*Fun called on message input change*/
  const onMessageChange = (e) => {
    setMsgInfo({ ...msgInfo, [e.target.name]: e.target.value });
  };

  /* Func called when message Form Submissioin*/
  const onMessageSubmit = (e) => {
    e.preventDefault();
    // extracting allfilesMessage and message previously
    const { allfilesMessage, message } = msgInfo;

    // for sending file to the database
    if (allfilesMessage.length === 0) {
      console.log("No files are selected");
    } else {
      for (let file of allfilesMessage) {
        if (validateFile(file)) {
          sendFileToServer(file);
        } else {
          console.log("File Not valid....");
        }
      }
      setMsgInfo({ ...msgInfo, allfilesMessage: [] });
    }

    // for sending text messages
    if (message.length === 0) {
      console.log("Cannot send empty message");
    } else {
      // binary attachment is not allowed in socket so sending only text
      // while sending text, allfilesMessage  will be empty
      let dataForTextMessageOnly = { ...msgInfo, allfilesMessage: "" };
      socket.emit("send_message", dataForTextMessageOnly);
      setMsgInfo({ ...msgInfo, message: "" });
    }

    SetFileNameToShow([])
  };

  /*Func called while handeling received message*/
  const clientReceiveMessage = (data) => {
    setAllMessages(data.all_messages);
  };

  /*BELOW CODES ARE RELATED TO SENDING FILES  */

  /*Fun called on file input change*/
  const onFilesChange = (e) => {
    let newMsgInfo = { ...msgInfo, [e.target.name]: e.target.files };
    setMsgInfo(newMsgInfo);
    // loop through files
    var files = e.target.files
    var filesNameList = [] 
    for (var i = 0; i < files.length; i++) {
      // get item
      var file = files.item(i);
      filesNameList.push(file.name)
    }
    SetFileNameToShow(filesNameList)
  };

  const handleRemoveChatFile = (name, index) => {
    var filteredFileList = []
    var fileList = msgInfo.allfilesMessage
    var NewFileNameList = fileNameToShow

    for (var i = 0; i < fileList.length; i++) {
      var file = fileList[i]
      if(file.name !== name){
        filteredFileList.push(file)
      } 
    }
    NewFileNameList.splice(index, 1)
    setMsgInfo({ ...msgInfo, "allfilesMessage": filteredFileList})
    SetFileNameToShow(NewFileNameList)
  }

  // Handeling the files received from server
  const clientReceiveFile = (fileData, chatClientData) => {
    setAllMessages(chatClientData.all_messages);
  };

  
  // Send file to server of client choice upload
  const sendFileToServer = (file) => {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
      let arrayBuffer = fileReader.result;

      let fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        binary: arrayBuffer,
      };
      let chatClientData = {};
      chatClientData.userId = msgInfo.userId;
      chatClientData.username = msgInfo.username;
      // while sending allfilesMessage, text message will be empty
      chatClientData.message = msgInfo.message;
      chatClientData.room = msgInfo.room;

      socket.emit("file_upload", chatClientData, fileData);
    };
  };

  // allowed file types
  const fileTypes = [
    "image/jpeg",
    "image/png",
    "text/plain",
    "text/csv",
    "application/msword",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  //Validate files
  const validateFile = (file) => {
    return fileTypes.includes(file.type);
  };

  /* RETURN METHOD OF COMPONENT*/
  return (
    <div class="fixed bottom-0 right-0 flex flex-col items-end ml-6">
      <div class="chat-modal mr-5 flex flex-col mb-5 shadow-lg sm:w-1/3 md:w-1/4 lg:w-1/5" style={{minWidth: "23rem"}}>
        {/* <!-- admin profile --> */}
        <div class="flex justify-between items-center text-black p-2 bg-white border shadow-lg mr-5 w-full">
          <div class="flex items-center">
            <img
              src="https://f0.pngfuel.com/png/136/22/profile-icon-illustration-user-profile-computer-icons-girl-customer-avatar-png-clip-art-thumbnail.png"
              alt="picture"
              class="rounded-full w-8 h-8 mr-1"
            />
            <h2 class="font-semibold tracking-wider">{username}</h2>
          </div>
          <button
            class="hover:bg-gray-100 focus:outline-none"
            onClick={() => handleShowChats(false)}
          >
            <p class="text-blue-500 mx-2 text-2xl">
              <VscClose />
            </p>
          </button>
        </div>
        {/* <!-- chats --> */}
        <div class="flex flex-col bg-white px-2 chat-services overflow-auto">
          <button onClick={() => handelShowMoreMessages()}>
            Show more messages...
          </button>
          <DisplayChatMessages
            allMessages={allMessages}
            currentUserId={userId}
            caseId={room}
          />
        </div>
        <div>
        </div>
        {/* shows the files selected */}
          {
            !_.isEmpty(fileNameToShow) ?
              fileNameToShow.map((item, index) => {
                return(
                  <div class="flex ml-2">
                    <div class="w-4/5">
                      <p>{item}</p>
                    </div>
                    <div>
                      <p class="text-red-400 mx-6 text-lg" onClick={() => handleRemoveChatFile(item, index)}><VscClose /></p>
                    </div>
                  </div>
                )
              })
            :
            ""
          }
        {/* <!-- send message -->  */}
        <form onSubmit={onMessageSubmit}>
          <div class="flex relative bg-white shadow">
            <div class="sm:w-3/12 md:w-2/12 lg:w-1/12 text-blue-600 bg-white hover:text-blue-500 mr-2 ml-1 my-4 px-3 py-1 transistion-color duration-100 focus:outline-none">
              <label for="allfilesMessage" style={{ cursor: "pointer" }}>
                <a>
                  <em class="fa fa-upload"></em>{" "}
                  <p class="text-2xl">
                    <MdAttachFile />
                  </p>
                </a>
              </label>
              <input
                type="file"
                name="allfilesMessage"
                id="allfilesMessage"
                onChange={(e) => onFilesChange(e)}
                style={{ display: "none" }}
                multiple
                accept="image/png, image/jpeg,.pdf,.doc,.docx,.xml,.txt,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
            </div>

            {/* Form for  message */}
            <div class="sm:w-9/12 md:w-10/12 lg:w-11/12">
              <div style={{ height: "4rem" }} class="flex mx-1">
                <div class="w-9/12 mx-3">
                  <input
                    type="text"
                    name="message"
                    placeholder="Type your message ..."
                    class="bg-gray-100 py-1 px-2 my-3 rounded-full focus:outline-none h-10 w-full"
                    value={msgInfo.message}
                    onChange={onMessageChange}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    class="absolute right-0 bottom-0 text-blue-600 bg-white  hover:text-blue-500 mr-1 my-4 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none"
                  >
                    <p class="text-2xl">
                      <MdSend />
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div
        class="show-chat mx-10 mb-6 mt-4 text-blue-500 hover:text-blue-600 flex justify-center items-center cursor-pointer"
        onClick={() => handleShowChats(true)}
      >
        <svg
          width="3em"
          height="3em"
          viewBox="0 0 16 16"
          class="bi bi-chat-text-fill"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"
          />
        </svg>
        {/* <p class="text-6xl text-blue-500"><HiChatAlt2 /></p> */}
      </div>
    </div>
  );
};

export default ChatClientSide;