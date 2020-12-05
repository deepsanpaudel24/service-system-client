import React from "react"
import {Link} from "react-router-dom"

const NavAccount = () => {
    const handleLanguageChange = e => {
        localStorage.setItem("lang", e.target.value)
        window.location.reload()
    }
    return(
        <div>
                <nav class="flex items-center justify-between flex-wrap bg- p-6 bg-white">
                    <div class="flex items-center flex-shrink-0 text-black mr-6">
                        <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg>
                        <Link to={"/"}>
                            <span class="font-semibold text-xl tracking-tight text-black">Service System Platform</span>
                        </Link>
                    </div>
                    <div class="block lg:hidden">
                        <button class="flex items-center px-3 py-2 border rounded text-orange-200 border-orange-400 hover:text-black hover:border-black">
                        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                        </button>
                    </div>
                    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                        <div class="text-sm lg:flex-grow">
                            
                        </div>
                        <div>
                            <select
                                class="form-select bg-white text-sm mx-2 py-1 px-3 text-black border-black focus:outline-none"
                                style={{marginRight: "3rem"}}
                                defaultValue={localStorage.getItem("lang")}
                                onChange={e => handleLanguageChange(e)}
                            >
                                <option value="en">English</option>
                                <option value="de">German</option>
                            </select>
                            <Link to="/user/register">
                                <p class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-black hover:border-transparent hover:text-white hover:bg-black mt-4 lg:mt-0">Sign Up</p>
                            </Link>
                            <Link to="/user/login">
                                <p class="inline-block text-sm mx-2 px-4 py-2 leading-none border rounded text-black border-black hover:border-transparent hover:text-white hover:bg-black mt-4 lg:mt-0">Sign In</p>
                            </Link>
                        </div>
                    </div>
                </nav>
        </div>
    )
}

export default NavAccount