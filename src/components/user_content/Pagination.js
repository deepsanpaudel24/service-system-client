import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

const Pagination = (props) => {
    const { pageChanger, totalRows, activePage } = props
    const numberofPages = Math.ceil(totalRows/10)
    var pages = []
    for (var i = 1; i <= numberofPages; i++) {
        pages.push(i)
    }
    return (
        <nav>
            <div class="max-w-7xl mx-auto">
                <div class="relative flex items-center justify-between h-16">
                    <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                    </div>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div class="ml-3 relative">
                            <ul class="flex pl-0 list-none rounded my-2">
                                {
                                    activePage == 1 ?
                                    <li class="py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 ml-0 rounded-l disabled cursor-not-allowed"><p>Previous</p></li>
                                    :
                                    <li class="py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 ml-0 rounded-l hover:bg-gray-200"><Link class="page-link" onClick={() => pageChanger(activePage-1)}>Previous</Link></li>
                                }
                                {
                                    pages.map((page) => {
                                        return(
                                            activePage !== page ?
                                            <li class="py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0"><Link class="page-link" onClick={() => pageChanger(page)}>{page}</Link></li>
                                            :
                                            <li class="py-2 px-3 leading-tight bg-blue-500 border border-blue-500 text-white border-r-0"><Link class="page-link" onClick={() => pageChanger(page)}>{page}</Link></li>  
                                        )
                                    })
                                }
                                {
                                    activePage == numberofPages ? 
                                    <li class=" py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 rounded-r disabled cursor-not-allowed"><p>Next</p></li>
                                    :
                                    <li class=" py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 rounded-r hover:bg-gray-200"><Link class="page-link" onClick={() => pageChanger(activePage+1)}>Next</Link></li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Pagination