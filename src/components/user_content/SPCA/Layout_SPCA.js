import React, { useState } from 'react';
import Aside from './Aside_SPCA';
import SPCAMain from './Main_SPCA';
import SPCANavbar from './UpperNavbar_SPCA';

function SPCALayout() {
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
        <SPCANavbar />
      </div>
    </div>
  );
}

export default SPCALayout;
