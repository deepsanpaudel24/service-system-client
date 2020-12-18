import React, { useState, useEffect, useLayoutEffect } from "react";
import { GrStripe } from "react-icons/gr";
import { HiInformationCircle } from "react-icons/hi";
import axios from "axios";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";
import {
  FaTachometerAlt,
  FaGem,
  FaUsers,
  FaRegListAlt,
  FaServicestack,
  FaTasks,
  FaWpforms,
} from "react-icons/fa";

const Dashboard = ({ t }) => {
  const history = useHistory();
  //dashboard stats state
  const [ total_no_cases, setTotal_no_cases] = useState(0)
  const [ total_no_employees, setTotal_no_employees] = useState(0)
  const [ total_no_closed_cases, setTotal_no_closed_cases] = useState(0)
  const [ total_no_users, setTotal_no_users] = useState(0)
  const [ total_no_active_users, setTotal_no_active_users] = useState(0)
  const [ total_no_onprogress_cases, setTotal_no_onprogress_cases] = useState(0)


  useLayoutEffect(() => {
    // call the dashboard stats api
    const config4 = {
      method: 'get',
      url: '/api/v1/sa-dashboard/stats'
    }
    axios(config4)
    .then((res) => {
        setTotal_no_cases(res.data['total_no_cases'])
        setTotal_no_employees(res.data['total_no_employees'])
        setTotal_no_closed_cases(res.data['total_no_closed_cases'])
        setTotal_no_users(res.data['total_no_users'])
        setTotal_no_active_users(res.data['total_no_active_users'])
        setTotal_no_onprogress_cases(res.data['total_onprogress_cases'])
    })
    .catch((error) => {
        console.log(error.response)
    })
  }, []);

  useEffect(() => {}, [total_no_active_users]);

  return (
    <div>
        <div class="my-3">
            <div class="flex flex-wrap mb-2">
                <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pr-2">
                    <div class="bg-green-100 border-l-4 border-green-500 text-green-600 rounded shadow p-2">
                        <div class="flex flex-row items-center">
                            <div class="flex pl-1 pr-1"><span class="text-green-400 text-3xl">< FaGem/></span></div>
                            <div class="flex-1 text-right">
                                <h5 class="">Total Cases</h5>
                                <h3 class="text-3xl">{total_no_cases}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pl-2">
                    <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-600 rounded shadow p-2">
                        <div class="flex flex-row items-center">
                            <div class="flex-shrink pl-1 pr-4"><span class="text-blue-400 text-3xl">< FaUsers/></span></div>
                            <div class="flex-1 text-right">
                                <h5 class="">Total Employees</h5>
                                <h3 class="text-3xl">{total_no_employees}<span class="text-blue-400"><i class="fas fa-caret-up"></i></span></h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pr-2 xl:pr-3 xl:pl-1">
                    <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-600 rounded shadow p-2">
                        <div class="flex flex-row items-center">
                            <div class="flex-shrink pl-1 pr-4"><span class="text-orange-400 text-3xl">< FaGem/></span></div>
                            <div class="flex-1 text-right pr-1">
                                <h5 class="">Total Closed Cases </h5>
                                <h3 class="text-3xl">{total_no_closed_cases}<span class="text-orange-400"><i class="fas fa-caret-up"></i></span></h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pl-2 xl:pl-3 xl:pr-2">
                    <div class="bg-purple-100 border-l-4 border-purple-500 text-purple-600 rounded shadow p-2">
                        <div class="flex flex-row items-center">
                            <div class="flex-shrink pl-1 pr-4"><span class="text-purple-400 text-3xl">< FaUsers/></span></div>
                            <div class="flex-1 text-right">
                                <h5 class="">Total Accounts</h5>
                                <h3 class="text-3xl">{total_no_users}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pr-2 xl:pl-2 xl:pr-3">
                    <div class="bg-red-100 border-l-4 border-red-500 text-red-600 rounded shadow p-2">
                        <div class="flex flex-row items-center">
                            <div class="flex-shrink pl-1 pr-4"><span class="text-red-400 text-3xl">< FaUsers/></span></div>
                            <div class="flex-1 text-right">
                                <h5 class="">Total Active Accounts</h5>
                                <h3 class="text-3xl">{total_no_active_users}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pl-2 xl:pl-1">
                    <div class="bg-pink-100 border-l-4 border-pink-500 text-pink-600 rounded shadow p-2">
                        <div class="flex flex-row items-center">
                            <div class="flex-shrink pl-1 pr-4"><span class="text-pink-400 text-3xl">< FaGem/></span></div>
                            <div class="flex-1 text-right">
                                <h5 class="">On-progres Cases</h5>
                                <h3 class="text-3xl">{total_no_onprogress_cases}<span class="text-pink-400"></span></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default withTranslation()(Dashboard);
