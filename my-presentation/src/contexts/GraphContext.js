// src/contexts/GraphContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchData } from '../dataLoader';

const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const graphData = await fetchData('/graph2.json');
      setGraph(graphData);
      positionNodes(graphData);
    };
    loadData();
  }, []);

  const positionNodes = (graphData) => {
    const nodes = [...graphData.nodes];
    const edges = [...graphData.edges];
    const nodesByYear = {};
    const nodesWithoutYear = [];

    nodes.forEach((node) => {
      if (node.year) {
        if (!nodesByYear[node.year]) {
          nodesByYear[node.year] = [];
        }
        nodesByYear[node.year].push(node);
      } else {
        nodesWithoutYear.push(node);
      }
    });

    const sortedYears = Object.keys(nodesByYear).sort((a, b) => a - b);
    const spacingX = 100;
    sortedYears.forEach((year, index) => {
      nodesByYear[year].forEach((node, nodeIndex) => {
        node.x = index * spacingX;
        node.y = nodeIndex * spacingX;
      });
    });

    nodesWithoutYear.forEach((node) => {
      const connectedEdges = edges.filter((edge) => edge.from === node.id || edge.to === node.id);
      if (connectedEdges.length > 0) {
        const connectedNode = nodes.find((n) => n.id === (connectedEdges[0].from === node.id ? connectedEdges[0].to : connectedEdges[0].from));
        if (connectedNode) {
          node.x = connectedNode.x + Math.random() * 50 - 25;
          node.y = connectedNode.y + Math.random() * 50 - 25;
        }
      }
    });

    setGraph({ nodes, edges });
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleApply = (updatedNode) => {
    setGraph((prevGraph) => {
      const nodes = prevGraph.nodes.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      );
      return { ...prevGraph, nodes };
    });
    setSelectedNode(updatedNode);
  };

  const addAttribute = (attribute, value) => {
    if (selectedNode) {
      const updatedNode = { ...selectedNode, [attribute]: value };
      handleApply(updatedNode);
    }
  };

  return (
    <GraphContext.Provider
      value={{ graph, selectedNode, handleNodeClick, handleApply, addAttribute }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => useContext(GraphContext);
