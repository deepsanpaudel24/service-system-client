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
import {
  FaTachometerAlt,
  FaGem,
  FaUsers,
  FaRegListAlt,
  FaServicestack,
  FaTasks,
  FaWpforms,
} from "react-icons/fa";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";

const SPCAAside = ({ t, collapsed, toggled, handleToggleSidebar }) => {
  const history = useHistory();
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
              <Link to="/user/home">{t("dashboard")}</Link>
            </MenuItem>
            <MenuItem icon={<FaGem />}>
              <Link to="/user/cases">{t("cases")}</Link>
            </MenuItem>
            <MenuItem icon={<FaUsers />}>
              <Link to="/user/employees">{t("employees")}</Link>
            </MenuItem>
            <MenuItem icon={<FaServicestack />}>
              <Link to="/user/services">{t("services")}</Link>
            </MenuItem>
            <MenuItem icon={<FaUsers />}>
              <Link to="/user/clients">{t("clients")}</Link>
            </MenuItem>
            <MenuItem icon={<FaTasks />}>
              <Link to="/user/tasks">{t("tasks")}</Link>
            </MenuItem>
            <MenuItem icon={<FaWpforms />}>
              <Link to="/user/intake-form/list">{t("intake_form")}</Link>
            </MenuItem>
            <MenuItem icon={<FaRegListAlt />}>
              <Link to="/user/transactions">{t("transactions")}</Link>
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

export default withTranslation()(SPCAAside);
