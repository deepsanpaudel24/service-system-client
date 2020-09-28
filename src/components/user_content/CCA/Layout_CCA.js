import React, { useState } from 'react';
import Aside from './Aside_CCA';
import CCANavbar from './UpperNavbar_CCA';

function CCALayout() {
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
      <div class="w-full" style={{marginLeft: "16.9em"}}>
        <CCANavbar />
      </div>
    </div>
  );
}

export default CCALayout;
