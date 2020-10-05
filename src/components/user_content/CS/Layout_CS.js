import React, { useState } from 'react';
import Aside from './Aside_CS';
import CSNavbar from './UpperNavbar_CS';

function CSLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = (checked) => {
    setCollapsed(checked);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <div className={`app ${toggled ? 'toggled' : ''}`}>
      <div class="fixed">
        <Aside
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
        />  
      </div>
      <div class="w-full" style={{marginLeft: "16.5em"}}>
        <CSNavbar />
      </div>
    </div>
  );
}

export default CSLayout;
