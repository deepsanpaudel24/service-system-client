import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { FaTachometerAlt, FaGem, FaUsers, FaGithub, FaRegLaughWink, FaHeart } from 'react-icons/fa';
import axios from "axios";
import { Link, Redirect } from "react-router-dom";

const Aside = ({ collapsed, toggled, handleToggleSidebar }, props) => {
  const [SM, setSM] = useState(false)  
  const [CM, setCM] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
          console.log("employee dashboard", res.data)
          setSM(res.data['serviceManagement'])
          setCM(res.data['clientManagement'])
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
        {
          SM ? 
            CM ?
            <SidebarContent>
              <Menu iconShape="circle">
                <MenuItem
                  icon={<FaTachometerAlt />}
                  suffix={<span className="badge red">New</span>}
                >
                  Dashboard
                </MenuItem>
                <MenuItem icon={<FaGem />}> Cases</MenuItem>
                <MenuItem icon={<FaUsers />}><Link to="/user/clients">Client Management</Link></MenuItem>
                <MenuItem icon={<FaGem />}><Link to="/user/services"> Service Management </Link></MenuItem>
              </Menu>
            </SidebarContent>
            :
            <SidebarContent>
              <Menu iconShape="circle">
                <MenuItem
                  icon={<FaTachometerAlt />}
                  suffix={<span className="badge red">New</span>}
                >
                  Dashboard
                </MenuItem>
                <MenuItem icon={<FaGem />}> Cases</MenuItem>
                <MenuItem icon={<FaGem />}><Link to="/user/services"> Service Management </Link></MenuItem>
              </Menu>
            </SidebarContent>
          :
          CM ? 
          <SidebarContent>
              <Menu iconShape="circle">
                <MenuItem
                  icon={<FaTachometerAlt />}
                  suffix={<span className="badge red">New</span>}
                >
                  Dashboard
                </MenuItem>
                <MenuItem icon={<FaGem />}> Cases</MenuItem>
                <MenuItem icon={<FaUsers />}><Link to="/user/clients"> Client Management </Link></MenuItem>
              </Menu>
            </SidebarContent>
            :
          <SidebarContent>
            <Menu iconShape="circle">
              <MenuItem
                icon={<FaTachometerAlt />}
                suffix={<span className="badge red">New</span>}
              >
                Dashboard
              </MenuItem>
              <MenuItem icon={<FaGem />}> Cases</MenuItem>
            </Menu>
          </SidebarContent>
        }

        <SidebarFooter style={{ textAlign: 'center' }}>
          <div
            className="sidebar-btn-wrapper"
            style={{
              padding: '20px 24px',
            }}
          >
            <a
              href="https://github.com/azouaoui-med/react-pro-sidebar"
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

export default Aside;
