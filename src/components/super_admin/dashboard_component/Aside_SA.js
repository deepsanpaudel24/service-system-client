import React from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaGem, FaUsers, FaRegListAlt } from "react-icons/fa";
import { withTranslation } from "react-i18next";

const SAAside = ({ t, collapsed, toggled, handleToggleSidebar }) => {
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
            <MenuItem icon={<FaUsers />}>
              <Link to="/sadmin/employees">{t("employees")}</Link>
            </MenuItem>
            <MenuItem icon={<FaUsers />}>
              <Link to="/sadmin/peoples">{t("accounts")}</Link>
            </MenuItem>
            <MenuItem icon={<FaRegListAlt />}>
              <Link to="/sadmin/transactions">{t("transactions")}</Link>
            </MenuItem>
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

export default withTranslation()(SAAside);
