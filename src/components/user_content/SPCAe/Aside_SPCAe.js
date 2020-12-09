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
import { FaTachometerAlt, FaGem, FaUsers, FaTasks, FaWpforms  } from 'react-icons/fa';
import axios from "axios";
import { Link, Redirect } from "react-router-dom";

const Aside = ({ collapsed, toggled, handleToggleSidebar }, props) => {
  
  const [SM, setSM] = useState(false)  
  const [CM, setCM] = useState(false)
  const [CustomTask, setCustomTask] = useState(false)
  const [IntakeForm, setIntakeForm] = useState(false)

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
          setSM(res.data['serviceManagement'])
          setCM(res.data['clientManagement'])
          setCustomTask(res.data['CustomTask'])
          setIntakeForm(res.data['IntakeForm'])
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
            SERVICE SYSTEM
          </div>
        </SidebarHeader>
        <SidebarContent>
              <Menu iconShape="circle">
                <MenuItem
                  icon={<FaTachometerAlt />}
                >
                  Dashboard
                </MenuItem>
                <MenuItem icon={<FaGem />}><Link to="/user/cases">Cases</Link></MenuItem>
                {
                  SM ?
                   <MenuItem icon={<FaGem />}><Link to="/user/services"> Service </Link></MenuItem>
                   :
                   <></>
                }
                {
                  CM ? 
                  <MenuItem icon={<FaUsers />}><Link to="/user/clients">Client </Link></MenuItem>
                  :
                  <></>
                }
                {
                  CustomTask ? 
                  <MenuItem icon={<FaTasks />}><Link to="/user/tasks">Tasks</Link></MenuItem>
                  :
                  <></>
                }
                {
                  IntakeForm ? 
                  <MenuItem icon={<FaWpforms />}><Link to="/user/intake-form/list">Intake Form</Link></MenuItem>
                  :
                  <></>
                }
              </Menu>
            </SidebarContent>

      </ProSidebar>
    </div>
  );
};

export default Aside;
