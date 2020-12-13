import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LogoutUser from "../../actions/UserLogoutAction";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import SAContent from "./Content_SA";
import { NotificationChangeStatusDispacther } from "../../actions/notifications/Notification_change_status_action";
import { MdNotificationsNone } from "react-icons/md";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";
import ProfilePicAvatar from "../../../images/profile_pic_avatar2.png";

const SANavbar = ({ t }) => {
  const history = useHistory();
  const [showOptions, setShowOptions] = useState(false);

  // For notification modules
  const [showNotifications, setShowNotifications] = useState(false);
  const [notification, setNotification] = useState([]);
  const [numberOfNotifications, setNumberOfNotifications] = useState(0);
  const [sendFirstNotification, setSendFirstNotification] = useState(true);

  // const [logout, setLogout] = useState(false)
  const dispatch = useDispatch();
  const logoutResponse = useSelector((state) => state.logoutUserResponse);

  const config = {
    method: "get",
    url: "/api/v1/notifications",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  };

  useEffect(() => {
    const checkNotification = async () => {
      try {
        const resp = await axios(config);
        setNotification(resp.data);
        setNumberOfNotifications(resp.data.length);
        return resp;
      } catch (error) {
        return error;
      }
    };

    if (sendFirstNotification) {
      checkNotification();
      setSendFirstNotification(false);
    } else {
      const interval = setInterval(checkNotification, 9000);
      return () => clearInterval(interval);
    }
  }, [sendFirstNotification]);

  const handleShowNotifications = () => {
    if (showNotifications) {
      setShowNotifications(false);
    } else {
      setShowOptions(false);
      setShowNotifications(true);
    }
  };

  const handleNotificationClick = (notification_id) => {
    setShowNotifications(false);
    dispatch(NotificationChangeStatusDispacther(notification_id));
  };

  const handleLogout = () => {
    dispatch(LogoutUser());
  };

  const LogoutUserResponse = () => {
    if (!_.isEmpty(logoutResponse.data)) {
      history.push("/user/login")
    }
  };

  const handleShowOptions = () => {
    if (showOptions) {
      setShowOptions(false);
    } else {
      setShowOptions(true);
    }
  };

  return (
    <div>
      {LogoutUserResponse()}
      <nav style={{ backgroundColor: "#273238" }}>
        <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div class="relative flex items-center justify-between h-16">
            <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div class="hidden sm:block sm:ml-6">
                <div class="flex"></div>
              </div>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div class="ml-3 relative">
                {numberOfNotifications == 0 ? (
                  <button
                    onClick={() => handleShowNotifications()}
                    class="relative text-white focus:outline-none mr-4 mt-1"
                  >
                    <MdNotificationsNone
                      style={{
                        fontSize: "1.7rem",
                        marginRight: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => handleShowNotifications()}
                    class="relative text-white focus:outline-none mr-3 mt-3"
                  >
                    <MdNotificationsNone
                      style={{
                        fontSize: "1.8rem",
                        marginRight: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                    />
                    {numberOfNotifications == 0 ? (
                      ""
                    ) : (
                      <div class="static mb-3">
                        <div class="absolute top-0 right-0">
                          <span
                            class="badge bg-red-800 text-center text-white text-sm"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {numberOfNotifications}
                          </span>
                        </div>
                      </div>
                    )}
                  </button>
                )}
                {showNotifications ? (
                  <div
                    class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg z-10"
                    style={{ width: "20rem" }}
                  >
                    <div class="rounded-md bg-white shadow-xs">
                      <div
                        class=""
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        {_.isEmpty(notification) ? (
                          <span class="flex items-center px-4 py-3 border-b hover:bg-gray-100 ">
                            <p class="text-gray-600 text-sm mx-2">
                              <span class="font-bold" href="#">
                                {t("no_new_notification")}
                              </span>
                            </p>
                          </span>
                        ) : (
                          notification.map((item, index) => {
                            return (
                              <Link
                                to={item.link}
                                class="flex items-center px-4 py-3 border-b hover:bg-gray-100 "
                                onClick={() =>
                                  handleNotificationClick(item._id.$oid)
                                }
                              >
                                <p class="text-gray-600 text-sm mx-2">
                                  <span class="font-bold" href="#">
                                    {item.title}
                                  </span>
                                </p>
                              </Link>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div class="ml-3 relative">
                <div>
                  <button
                    onClick={() => handleShowOptions()}
                    class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out"
                    id="user-menu"
                    aria-label="User menu"
                    aria-haspopup="true"
                  >
                    <img
                      class="h-8 w-8 rounded-full"
                      src={ProfilePicAvatar}
                    />
                  </button>
                </div>
                {showOptions ? (
                  <div
                    class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg"
                    style={{ zIndex: 1 }}
                  >
                    <div class="rounded-md bg-white shadow-xs">
                      <div
                        class="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <a
                          href="#"
                          class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                          role="menuitem"
                        >
                          {t("profile")}
                        </a>
                        <Link
                          to="/sadmin/change-password"
                          onClick={() => handleShowOptions()}
                          class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                          role="menuitem"
                        >
                          {t("change_password")}
                        </Link>
                        <div class="border-t border-gray-200"></div>
                        <button
                          type="submit"
                          onClick={() => handleLogout()}
                          class="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                          role="menuitem"
                        >
                          {t("sign_out")}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div class="container max-w-full py-4">
        <div
          class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mx-4"
          style={{ minHeight: "52rem" }}
        >
          <SAContent />
        </div>
      </div>
    </div>
  );
};

export default withTranslation() (SANavbar);
