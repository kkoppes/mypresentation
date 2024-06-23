// src/components/Sidebar.js

import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <button onClick={toggleSidebar} style={{ marginBottom: '10px' }}>
        {isOpen ? 'Hide Menu' : 'Show Menu'}
      </button>
      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label>
              Field 1:
              <input type="text" placeholder="Placeholder Field 1" />
            </label>
          </div>
          <div>
            <label>
              Field 2:
              <input type="text" placeholder="Placeholder Field 2" />
            </label>
          </div>
          <div>
            <label>
              Field 3:
              <input type="text" placeholder="Placeholder Field 3" />
            </label>
          </div>
          <div>
            <label>
              Field 4:
              <input type="text" placeholder="Placeholder Field 4" />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
