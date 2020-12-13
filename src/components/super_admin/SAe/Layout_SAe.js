import React, { useState } from 'react';
import Aside from './Aside_SAe';
import SAeNavbar from './UpperNavbar_SAe';

function SAeLayout() {
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
        <SAeNavbar />
      </div>
    </div>
  );
}

export default SAeLayout;
