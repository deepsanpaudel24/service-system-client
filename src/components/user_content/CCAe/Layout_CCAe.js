import React, { useState } from 'react';
import Aside from './Aside_CCAe';
import SPCANavbar from './UpperNavbar_CCAe';

function CCAeLayout() {
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
        <SPCANavbar />
      </div>
    </div>
  );
}

export default CCAeLayout;
