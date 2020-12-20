import React, { useState, useEffect, useLayoutEffect } from "react";
import { GrStripe } from "react-icons/gr";
import { HiInformationCircle } from "react-icons/hi";
import axios from "axios";
import SubscriptionCheckout from "../payments/Subscription_Checkout";
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
  const [ total_no_services, setTotal_no_services] = useState(0)
  const [ total_no_clients, setTotal_no_clients] = useState(0)
  const [ total_no_tasks, setTotal_no_tasks] = useState(0)
  const [ total_no_forms, setTotal_no_forms] = useState(0)

  const [UserDetails, setUserDetails] = useState([]);
  const [expiryDate, setExpiryDate] = useState();
  const [remainingDays, setRemainingDays] = useState();
  const [showOnBoard, setShowOnBoard] = useState(false);
  const [stipeDetailsSubmited, setStripeDetailsSubmited] = useState(true);
  const [
    stripeOnboardUrlForIncomplete,
    setStripeOnboardUrlForIncomplete,
  ] = useState();

  useLayoutEffect(() => {
    const config = {
      method: "get",
      url: "/api/v1/user/profile-details",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then((res) => {
        setUserDetails(res.data);
        var exp_date = new Date(res.data["expiryDate"]);
        setExpiryDate(exp_date);
        var current_date = new Date();
        var diff = Math.abs(exp_date - current_date);
        var diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        setRemainingDays(diffDays);
      })
      .catch((error) => {});

    // getting stripe acc info of login user
    const config2 = {
      method: "get",
      url: "/api/v1/user/stripe-acc-info",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios(config2)
      .then((res) => {
        if (res.data.hasOwnProperty("showOnboard")) {
          setShowOnBoard(res.data["showOnboard"]);
          setStripeDetailsSubmited(false);
        } else {
          if (!res.data["details_submitted"]) {
            setStripeOnboardUrlForIncomplete(res.data["url"]);
            setStripeDetailsSubmited(res.data["details_submitted"]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // call the dashboard stats api
    const config4 = {
      method: 'get',
      url: '/api/v1/sp-dashboard/stats'
    }
    axios(config4)
    .then((res) => {
      setTotal_no_cases(res.data['total_no_cases'])
      setTotal_no_employees(res.data['total_no_employees'])
      setTotal_no_services(res.data['total_no_services'])
      setTotal_no_clients(res.data['total_no_clients'])
      setTotal_no_tasks(res.data['total_no_tasks'])
      setTotal_no_forms(res.data['total_no_forms'])
    })
    .catch((error) => {
      console.log(error.response)
    })
  }, []);

  useEffect(() => {}, [UserDetails]);

  const handleOnboardStripe = () => {
    const config = {
      method: "post",
      url: "/api/v1/onboard",
    };
    axios(config)
      .then((res) => {
        window.location = res.data.url;
      })
      .catch((error) => {
        console.log("error", error.response);
      });
  };

  const handleContinueOnboardStripe = () => {
    window.location = stripeOnboardUrlForIncomplete;
  };

  return (
    <div>
      {showOnBoard ? (
        // "redirect the user to onboarding from the begining"
        <div
          class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
          role="alert"
        >
          <div class="flex">
            <p class=" text-2xl mr-1">
              <HiInformationCircle />
            </p>
            <p>{t("stripe_onboard_info")}</p>
          </div>
          <div>
            <button
              class="focus:outline-none mt-3 mx-1"
              onClick={() => handleOnboardStripe()}
            >
              <div class="flex w-auto px-3 py-2 flex items-center justify-center bg-indigo-600 text-white shadow-md hover:shadow-lg">
                <span>
                  <p class="font-bold">{t("onboard_with_stripe")}</p>
                </span>
                <span class="ml-2">
                  <p class="text-xl">
                    <GrStripe />
                  </p>
                </span>
              </div>
            </button>
          </div>
        </div>
      ) : stipeDetailsSubmited ? (
        " "
      ) : (
        // "Continue the user onboarding"
        <div
          class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
          role="alert"
        >
          <div class="flex">
            <p class=" text-2xl mr-1">
              <HiInformationCircle />
            </p>
            <p>{t("stripe_acc_info_not_completed")}</p>
          </div>
          <div>
            <button
              class="focus:outline-none mt-3 mx-1"
              onClick={() => handleContinueOnboardStripe()}
            >
              <div class="flex w-auto px-3 py-2 flex items-center justify-center bg-indigo-600 text-white shadow-md hover:shadow-lg">
                <span>
                  <p class="font-bold">{t("continue_onboarding")}</p>
                </span>
                <span class="ml-2">
                  <p class="text-xl">
                    <GrStripe />
                  </p>
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* alert box to show for the subsription of the service system if the expiry date is less than a week */}
      {remainingDays < 8 ? (
        <div
          class="bg-orange-100 border-l-4 border-orange-500 text-orange-600 p-4 my-3"
          role="alert"
        >
          <div class="flex">
            <p class=" text-2xl mr-1">
              <HiInformationCircle />
            </p>
            <p>
              {t("acc_expire_on")} <b>{UserDetails["expiryDate"]}. </b>{" "}
              {t("get_subscription_info")}
            </p>
          </div>
          <div>
            <SubscriptionCheckout />
          </div>
        </div>
      ) : (
        ""
      )}

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
                                <div class="flex-shrink pl-1 pr-4"><span class="text-orange-400 text-3xl">< FaServicestack/></span></div>
                                <div class="flex-1 text-right pr-1">
                                    <h5 class="">Services </h5>
                                    <h3 class="text-3xl">{total_no_services}<span class="text-orange-400"><i class="fas fa-caret-up"></i></span></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pl-2 xl:pl-3 xl:pr-2">
                        <div class="bg-purple-100 border-l-4 border-purple-500 text-purple-600 rounded shadow p-2">
                            <div class="flex flex-row items-center">
                                <div class="flex-shrink pl-1 pr-4"><span class="text-purple-400 text-3xl">< FaUsers/></span></div>
                                <div class="flex-1 text-right">
                                    <h5 class="">Clients</h5>
                                    <h3 class="text-3xl">{total_no_clients}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pr-2 xl:pl-2 xl:pr-3">
                        <div class="bg-red-100 border-l-4 border-red-500 text-red-600 rounded shadow p-2">
                            <div class="flex flex-row items-center">
                                <div class="flex-shrink pl-1 pr-4"><span class="text-red-400 text-3xl">< FaTasks/></span></div>
                                <div class="flex-1 text-right">
                                    <h5 class="">Tasks</h5>
                                    <h3 class="text-3xl">{total_no_tasks}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pl-2 xl:pl-1">
                        <div class="bg-pink-100 border-l-4 border-pink-500 text-pink-600 rounded shadow p-2">
                            <div class="flex flex-row items-center">
                                <div class="flex-shrink pl-1 pr-4"><span class="text-pink-400 text-3xl">< FaWpforms/></span></div>
                                <div class="flex-1 text-right">
                                    <h5 class="">Intake Forms</h5>
                                    <h3 class="text-3xl">{total_no_forms}<span class="text-pink-400"></span></h3>
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
