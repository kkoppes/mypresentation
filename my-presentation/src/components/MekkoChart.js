// src/components/MekkoChart.js
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { fetchData } from '../dataLoader';

const MekkoChartComponent = () => {
  const [mekkoData, setMekkoData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadMekkoData = async () => {
      const data = await fetchData('/mekkoData.json');
      if (isMounted) {
        setMekkoData(data);
      }
    };

    loadMekkoData();

    return () => {
      isMounted = false;
    };
  }, []);

  const chartData = [
    ['Location', 'Parent', 'Market trade volume (size)', 'Market increase/decrease (color)'],
    ['Global', null, 0, 0],
    ...mekkoData.map(item => [item.name, 'Global', item.value, item.value])
  ];

  const options = {
    // title: 'Proportional Area Chart',
    highlightOnMouseOver: true,
    maxDepth: 1,
    maxPostDepth: 2,
    minHighlightColor: '#FBB4AE', // Light Red  
    midHighlightColor: '#F8766D', // Medium Red 
    maxHighlightColor: '#DE2D26', // Dark Red   
    minColor: '#B3CDE3', // Light Blue
    midColor: '#6497B1', // Medium Blue
    maxColor: '#005B96', // Dark Blue
    headerHeight: 15,
    showScale: true,
    useWeightedAverageForAggregation: true,
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '75vh', height: '75vh' }}>
        <Chart
          chartType="TreeMap"
          width="100%"
          height="100%"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default MekkoChartComponent;
