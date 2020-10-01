import React , {useState} from "react";
import _ from "lodash";

const EmployeeRoles = (props) => {
    return (
        <div>
            <div class="px-4 sm:px-8">
                <div class="flex">
                    <div class="w-4/5">
                        <div class="flex"> 
                            <img style={{height: '7em'}} class="rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80" alt="" />
                            <div class="ml-5 y-5" style={{marginTop: "1.5em", marginLeft: "2em"}}>
                                <h1 class="text-2xl font-bold">Roshan Katel</h1>
                                <h1 class="text-1xl my-1">paradise98425@gmail.com</h1>
                                <p class="flex mt-8 text-base text-gray-600">
                                    TOTAL CASES <p class="ml-3 mr-10 text-base text-black">3</p>
                                    USER SINCE<p class="ml-3 mr-10 text-base text-black">2020-09-14</p>
                                    STATUS<p class="ml-3 text-base text-green-600">ACTIVE</p>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="w-1/5 flex justify-end">
                        <button class="focus:outline-none">
                            <div class="h-12 w-auto px-5 py-5 flex items-center justify-center bg-white text-blue-00 shadow-md hover:shadow-lg">Manage Roles</div>
                        </button>
                    </div>
                </div>
                <div class="my-8">
                    <h1 class="text-2xl text-gray-800">Roles and Permissions</h1>
                        <p class="text-sm text-gray-600 flex items-center">
                            <svg class="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                            </svg>
                            Admin only
                        </p>
                    <div class="flex my-3">
                        <div class="w-3/5">
                            <div class="flex"> 
                                <div>
                                    <input class="my-3" type="checkbox" checked/>
                                </div>
                                <div style={{marginLeft: "2em"}}>
                                    <div class="mb-8">
                                        <div class="flex text-gray-800 font-bold text-xl mb-2">
                                            Service Management
                                        </div>
                                        <hr class="border-gray-400" />
                                        <p class="text-gray-700 text-sm my-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="flex"> 
                                <div>
                                    <input class="my-3" type="checkbox" />
                                </div>
                                <div style={{marginLeft: "2em"}}>
                                    <div class="mb-8">
                                        <div class="text-gray-800 font-bold text-xl mb-2">Client Management</div>
                                        <hr class="border-gray-400" />
                                        <p class="text-gray-700 text-sm my-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeRoles