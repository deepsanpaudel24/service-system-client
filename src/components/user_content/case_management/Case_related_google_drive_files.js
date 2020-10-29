import React, {useState, useLayoutEffect, useEffect} from "react"
import axios from "axios"

const GoogleDriveRelatedFiles = () => {

    const [googleAccountLinked, setGoogleAccountLinked] = useState(false)
    const [showGOptions, setShowGOPtions] = useState(false)
    const [showGDocsForm, setShowGDocsForm] = useState(false)

    useLayoutEffect(() => {
        var config = {
            method: "get",
            url: "/api/v1/google-credentials-details",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            }
          }
          axios(config)
          .then((res) => {
            setGoogleAccountLinked(true)
          })
          .catch((error) => {
            setGoogleAccountLinked(false)
          })    
      }, []);
    
    useEffect(() => {}, [googleAccountLinked]);    

    const handleLinkGoogleAccount = () => {
        var config = {
            method: "get",
            url: "/api/v1/authorize",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
              }
        }
        axios(config)
        .then((res) => {
            console.log('Response from then', res.data)
        })
        .catch((error) => {
            //console.log(error.response)
        })
    }

    const handleLinkWithDrive = () => {
        setShowGOPtions(true)
    }

    const handleGDocsOption = () => {
        setShowGOPtions(false)
        setShowGDocsForm(true)
    }

    const handleGSlidesOption = () => {
        setShowGOPtions(false)
        setShowGDocsForm(true)
    }

    const handleGSheetsOption = () => {
        setShowGOPtions(false)
        setShowGDocsForm(true)
    }

    return(
        <div>
            {
                googleAccountLinked ? 
                <div>
                    <button class="focus:outline-none" onClick={() => handleLinkWithDrive()}><h1 class="text-blue-400 underline">Create a new google drive document</h1></button>
                    {
                        showGOptions ? 
                        <div class="flex my-2">
                            <button class="bg-gray-200 px-2 py-2 mx-2 focus:outline-none" onClick={() => handleGDocsOption()}>Docs</button>
                            <button class="bg-gray-200 px-2 py-2 mx-2 focus:outline-none" onClick={() => handleGSlidesOption()}>Slide</button>
                            <button class="bg-gray-200 px-2 py-2 mx-2 focus:outline-none" onClick={() => handleGSheetsOption()}>SpreadSheet</button>
                        </div>
                        :
                        ""
                    }
                    {
                        showGDocsForm ? 
                        <div>
                            <div class="mt-6 mb-5" >
                                <label class="block text-gray-700 text-sm" for="title">
                                    Title:
                                </label>
                                <input 
                                    class="shadow appearance-none border rounded w-40 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="title" 
                                    type="text"
                                />
                            </div>
                            <div class="flex justify-start my-5">
                                <button 
                                    class="hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="button" 
                                    style={{backgroundColor: "#3490ff"}}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                        :
                        ""
                    }
                </div>
                :
                <div>
                    <button class="focus:outline-none" onClick={() => handleLinkGoogleAccount()}><h1 class="text-blue-400 underline">Link with your google account</h1></button>
                </div>
            }
        </div>
    )
}

export default GoogleDriveRelatedFiles