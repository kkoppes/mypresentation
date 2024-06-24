// src/components/Sidebar.js

import React, { useState, useEffect } from 'react';
import { useGraph } from '../contexts/GraphContext';
import './Sidebar.css';

const Sidebar = () => {
  const { selectedNode, handleApply, addAttribute } = useGraph();
  const [nodeData, setNodeData] = useState({});
  const [newAttribute, setNewAttribute] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode);
    }
  }, [selectedNode]);

  const handleChange = (key, value) => {
    setNodeData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleApplyClick = () => {
    handleApply(nodeData);
  };

  const handleAddAttribute = () => {
    if (newAttribute && newValue) {
      addAttribute(newAttribute, newValue);
      setNewAttribute('');
      setNewValue('');
    }
  };

  return (
    <div className={`sidebar ${selectedNode ? 'open' : 'closed'}`}>
      <div className={`toggle-btn ${selectedNode ? 'open' : 'closed'}`}></div>
      {selectedNode && (
        <div className="sidebar-content">
          {Object.keys(nodeData).map((key) => (
            <div key={key}>
              <label>
                {key}:
                <input
                  type="text"
                  value={nodeData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </label>
            </div>
          ))}
          <button onClick={handleApplyClick}>Apply</button>
          <div className="add-attribute">
            <h3>Add Attribute</h3>
            <label>
              Attribute:
              <input
                type="text"
                value={newAttribute}
                onChange={(e) => setNewAttribute(e.target.value)}
              />
            </label>
            <label>
              Value:
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </label>
            <button onClick={handleAddAttribute}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
