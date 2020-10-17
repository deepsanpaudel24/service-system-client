import React from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaGem, FaUsers, FaGithub, FaServicestack, FaClock } from 'react-icons/fa';

const SPCAAside = ({ collapsed, toggled, handleToggleSidebar }) => {
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
              padding: '24px',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontSize: 14,
              letterSpacing: '1px',
              overflow: 'auto',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Sidebar Title
          </div>
        </SidebarHeader>

        <SidebarContent>
        <Menu iconShape="circle">
            <MenuItem
              icon={<FaTachometerAlt />}
              suffix={<span className="badge red">New</span>}
            >
              <Link to="/user/home">Dashboard</Link>
            </MenuItem>
            <MenuItem icon={<FaGem />}><Link to="/user/cases">Cases</Link></MenuItem>
            <MenuItem icon={<FaUsers />}><Link to="/user/employees">Employees</Link></MenuItem>
            <MenuItem icon={<FaServicestack />}><Link to="/user/services">Services</Link></MenuItem>
            <MenuItem icon={<FaUsers />}><Link to="/user/clients">Clients</Link></MenuItem>
            <MenuItem icon={<FaClock />}><Link to="/user/timers">Timers</Link></MenuItem>
          </Menu>
        </SidebarContent>

        <SidebarFooter style={{ textAlign: 'center' }}>
          <div
            className="sidebar-btn-wrapper"
            style={{
              padding: '20px 24px',
            }}
          >
            <a
              href="#"
              target="_blank"
              className="sidebar-btn"
              rel="noopener noreferrer"
            >
              <FaGithub />
              <span>View Sources</span>
            </a>
          </div>
        </SidebarFooter>
      </ProSidebar>
    </div>
  );
};

export default SPCAAside;
