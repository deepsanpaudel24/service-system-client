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
import { FaTachometerAlt, FaGem, FaRegListAlt, FaUsers } from 'react-icons/fa';
import { Link } from "react-router-dom";

const CCAAside = ({ collapsed, toggled, handleToggleSidebar }) => {
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
            SERVICE SYSTEM
          </div>
        </SidebarHeader>

        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem
              icon={<FaTachometerAlt />}
            >
              <Link to="/user/home">Dashboard</Link>
            </MenuItem>
            <MenuItem icon={<FaGem />}><Link to="/user/cases">Cases</Link></MenuItem>
            <MenuItem icon={<FaUsers />}><Link to="/user/employees">Employees</Link></MenuItem>
            <MenuItem icon={<FaRegListAlt />}><Link to="/user/transactions">Transactions</Link></MenuItem>
          </Menu>
        </SidebarContent>

        <SidebarFooter style={{ textAlign: 'center' }}>
          <div
            className="sidebar-btn-wrapper"
            style={{
              padding: '20px 24px',
            }}
          >
            
          </div>
        </SidebarFooter>
      </ProSidebar>
    </div>
  );
};

export default CCAAside;
