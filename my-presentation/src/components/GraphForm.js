// src/components/GraphForm.js

import React, { useState } from 'react';

const GraphForm = ({ onGraphChange }) => {
  const [nodes, setNodes] = useState('');
  const [edges, setEdges] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const parsedNodes = JSON.parse(nodes);
    const parsedEdges = JSON.parse(edges);
    onGraphChange({ nodes: parsedNodes, edges: parsedEdges });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Nodes (JSON format):
          <textarea
            value={nodes}
            onChange={(e) => setNodes(e.target.value)}
            rows="10"
            cols="50"
          />
        </label>
      </div>
      <div>
        <label>
          Edges (JSON format):
          <textarea
            value={edges}
            onChange={(e) => setEdges(e.target.value)}
            rows="10"
            cols="50"
          />
        </label>
      </div>
      <button type="submit">Update Graph</button>
    </form>
  );
};

export default GraphForm;
