import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaGem, FaUsers, FaRegListAlt } from "react-icons/fa";
import axios from "axios";
import { withTranslation } from "react-i18next";

const SAeAside = ({ t, collapsed, toggled, handleToggleSidebar }) => {

  const [SM, setSM] = useState(false)  

  useLayoutEffect(() => {
      const config = {
          method: 'get',
          url: '/api/v1/user/validity',
          headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
              }
      }
      axios(config)
      .then((res) => {
          setSM(res.data['serviceManagement'])
      })
      .catch((error) => {
          localStorage.removeItem('access_token')
          window.location.reload(true)
      })
  }, [])

  useEffect(() => {
  
  }, [SM])

  return (
    <div className="flex h-screen">
      <ProSidebar
        collapsed={collapsed}
        toggled={toggled}
        breakPoint="md"
        onToggle={handleToggleSidebar}
      >
        <SidebarHeader>
          <div
            style={{
              padding: "24px",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: 14,
              letterSpacing: "1px",
              overflow: "auto",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {t("caps_service_system")}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem icon={<FaTachometerAlt />}>
              <Link to="/sadmin/home">{t("dashboard")}</Link>
            </MenuItem>
            <MenuItem icon={<FaGem />}>
              <Link to="/sadmin/cases">{t("cases")}</Link>
            </MenuItem>
            {
              SM ?
              <MenuItem icon={<FaUsers />}>
                <Link to="/sadmin/peoples">{t("accounts")}</Link>
              </MenuItem>
              :
              <></>
            }
          </Menu>
        </SidebarContent>

        <SidebarFooter style={{ textAlign: "center" }}>
          <div
            className="sidebar-btn-wrapper"
            style={{
              padding: "20px 24px",
            }}
          ></div>
        </SidebarFooter>
      </ProSidebar>
    </div>
  );
};

export default withTranslation()(SAeAside);
