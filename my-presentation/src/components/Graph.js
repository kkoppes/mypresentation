// src/components/Graph.js

// Importing necessary modules and components
import React from 'react';
import Graph from 'react-graph-vis';
import { fetchData } from '../dataLoader';

// Define the GraphComponent that receives a `graph` prop
const GraphComponent = ({ graph }) => {
  // Define options for the graph visualization
  const options = {
    layout: {
      hierarchical: false // Disable hierarchical layout
    },
    edges: {
      color: "#000000" // Set edge color to black
    },
    height: "100%" // Set the height of the graph visualization
  };

  // Return the JSX to render the graph visualization
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Graph
        graph={graph} // Pass the graph data as a prop
        options={options} // Pass the visualization options as a prop
      />
    </div>
  );
};

// Export the GraphComponent as the default export
export default GraphComponent;
