// src/components/Graph.js

import React from 'react';
import Graph from 'react-graph-vis';
import { useGraph } from '../contexts/GraphContext';

const GraphComponent = () => {
  const { graph, handleNodeClick } = useGraph();

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
    height: '100%',
  };

  const events = {
    select: ({ nodes }) => {
      if (nodes.length > 0) {
        const selectedNode = graph.nodes.find((node) => node.id === nodes[0]);
        handleNodeClick(selectedNode);
      }
    },
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Graph graph={graph} options={options} events={events} />
    </div>
  );
};

export default GraphComponent;
