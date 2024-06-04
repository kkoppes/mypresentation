# PowerShell script to set up the folder structure and generate necessary files

# Define project name
$projectName = "my-presentation"

# Create project directories
mkdir $projectName
cd $projectName
mkdir public
mkdir public/images
mkdir src
mkdir src/components

# Create JSON data files
@"
[
  { "title": "Welcome", "text": "This is the first slide" },
  { "title": "About Me", "text": "This is the second slide" }
]
"@ | Out-File public/slides.json -Encoding utf8

@"
[
  { "name": "London", "position": [51.505, -0.09] },
  { "name": "Paris", "position": [48.8566, 2.3522] }
]
"@ | Out-File public/locations.json -Encoding utf8

@"
{
  "nodes": [
    { "id": 1, "label": "Node 1" },
    { "id": 2, "label": "Node 2" }
  ],
  "edges": [
    { "from": 1, "to": 2 }
  ]
}
"@ | Out-File public/graph.json -Encoding utf8

@"
[
  { "name": "Category 1", "value": 50 },
  { "name": "Category 2", "value": 30 }
]
"@ | Out-File public/mekkoData.json -Encoding utf8

# Create image placeholder
Out-File public/images/your-gif.gif -Encoding utf8

# Create React component files
@"
import React from 'react';
import './Slide.css';

const Slide = ({ content }) => (
  <div className="slide">
    <h1>{content.title}</h1>
    <p>{content.text}</p>
  </div>
);

export default Slide;
"@ | Out-File src/components/Slide.js -Encoding utf8

@"
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ locations }) => {
  const [step, setStep] = useState(0);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={4} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.slice(0, step + 1).map((loc, idx) => (
        <Marker key={idx} position={loc.position}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
"@ | Out-File src/components/Map.js -Encoding utf8

@"
import React from 'react';
import { Graph } from 'react-graph-vis';

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
    <Graph
      graph={graph}
      options={options}
    />
  );
};

export default GraphComponent;
"@ | Out-File src/components/Graph.js -Encoding utf8

@"
import React from 'react';
import { Chart } from 'react-google-charts';

const MekkoChartComponent = ({ data }) => {
  const chartData = [
    ['Category', 'Value'],
    ...data.map(item => [item.name, item.value])
  ];

  const options = {
    title: 'Mekko Chart',
    hAxis: { title: 'Category' },
    vAxis: { title: 'Value' },
    seriesType: 'bars',
    legend: { position: 'none' }
  };

  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="400px"
      data={chartData}
      options={options}
    />
  );
};

export default MekkoChartComponent;
"@ | Out-File src/components/MekkoChart.js -Encoding utf8

# Create data loader utility
@"
export const fetchData = async (path) => {
  const response = await fetch(path);
  const data = await response.json();
  return data;
};
"@ | Out-File src/dataLoader.js -Encoding utf8

# Create main App component
@"
import React, { useState, useEffect } from 'react';
import Slide from './components/Slide';
import Map from './components/Map';
import GraphComponent from './components/Graph';
import MekkoChartComponent from './components/MekkoChart';
import { fetchData } from './dataLoader';
import './App.css';

function App() {
  const [step, setStep] = useState(0);
  const [slides, setSlides] = useState([]);
  const [locations, setLocations] = useState([]);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [mekkoData, setMekkoData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const slidesData = await fetchData('/slides.json');
      const locationsData = await fetchData('/locations.json');
      const graphData = await fetchData('/graph.json');
      const mekkoData = await fetchData('/mekkoData.json');

      setSlides(slidesData);
      setLocations(locationsData);
      setGraph(graphData);
      setMekkoData(mekkoData);
    };

    loadData();
  }, []);

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const renderContent = () => {
    switch (step) {
      case 0:
      case 1:
        return slides.length > 0 && <Slide content={slides[step]} />;
      case 2:
        return locations.length > 0 && <Map locations={locations} />;
      case 3:
        return graph.nodes.length > 0 && <GraphComponent graph={graph} />;
      case 4:
        return mekkoData.length > 0 && <MekkoChartComponent data={mekkoData} />;
      default:
        return <div><img src="/images/your-gif.gif" alt="Conclusion" /></div>;
    }
  };

  return (
    <div className="app" onClick={handleNext} onKeyPress={(e) => { if (e.code === 'Space') handleNext(); }} tabIndex="0">
      {renderContent()}
    </div>
  );
}

export default App;
"@ | Out-File src/App.js -Encoding utf8

# Create App CSS file
@"
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}

.slide {
  text-align: center;
}
"@ | Out-File src/App.css -Encoding utf8

# Create main index file
@"
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
"@ | Out-File src/index.js -Encoding utf8

# Initialize package.json and install dependencies
npm init -y
npm install react react-dom react-scripts react-slick slick-carousel react-leaflet leaflet d3 react-graph-vis react-google-charts

# Create README file
@"
# My Presentation

This is a React-based personal presentation application.

## Setup

1. Clone the repository
2. Run \`npm install\` to install dependencies
3. Run \`npm start\` to start the application

## Folder Structure

- \`public\`: Contains public assets and JSON data files
- \`src\`: Contains React components and styles

## Components

- \`Slide.js\`: Component for traditional slides
- \`Map.js\`: Component for the map of Europe
- \`Graph.js\`: Component for the interactive graph
- \`MekkoChart.js\`: Component for the Mekko chart
"@ | Out-File README.md -Encoding utf8

# Create .gitignore file
@"
node_modules/
build/
"@ | Out-File .gitignore -Encoding utf8

Write-Output "Project setup complete. Navigate to the project directory and run 'npm start' to start the application."
