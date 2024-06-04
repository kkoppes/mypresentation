// src/components/Graph.js
import React, { useEffect, useState } from 'react';
import Graph from 'react-graph-vis';
import { fetchData } from '../dataLoader';

const GraphComponent = ({ graph }) => {
  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#000000"
    },
    height: "500px"
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Graph
        graph={graph}
        options={options}
      />
    </div>
  );
};

export default GraphComponent;
