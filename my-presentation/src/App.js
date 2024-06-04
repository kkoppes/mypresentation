// src/App.js
import React, { useState, useEffect } from 'react';
import Slide from './components/Slide';
import FamilySlide from './components/FamilySlide';
import Map from './components/Map';
import Graph from './components/Graph'; // Correct import statement
import MekkoChart from './components/MekkoChart'; // Correct import statement
import { fetchData } from './dataLoader';
import './App.css';

const slides = [
  { title: "Welcome", text: "This is the first slide" },
  { title: "Family", text: "Meet my family" },
];

function App() {
  const [step, setStep] = useState(0);
  const [slidesData, setSlidesData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [mekkoData, setMekkoData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const slidesData = await fetchData('/slides.json');
      const locationsData = await fetchData('/locations.json');
      const graphData = await fetchData('/graph.json');
      const mekkoData = await fetchData('/mekkoData.json');

      setSlidesData(slidesData);
      setLocations(locationsData);
      setGraph(graphData);
      setMekkoData(mekkoData);
    };

    loadData();
  }, []);

  const handleNext = () => {
    setStep(prev => (prev < 5 ? prev + 1 : 0)); // Loop back to the beginning after the last slide
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return slidesData.length > 0 && <Slide content={slides[0]} image="images/image_1.webp" />;
      case 1:
        return <FamilySlide />;
      case 2:
        return <Map />;
      case 3:
        return graph.nodes.length > 0 && <Graph graph={graph} />;
      case 4:
        return mekkoData.length > 0 && <MekkoChart data={mekkoData} />;
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
