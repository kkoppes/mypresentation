// src/App.js

import React, { useState, useEffect } from 'react';
import Slide from './components/Slide';
import FamilySlide from './components/FamilySlide';
import FamilySlide2 from './components/FamilySlide2';
import Map from './components/Map';
import Graph from './components/Graph';
import MekkoChart from './components/MekkoChart';
import Sidebar from './components/Sidebar';
import Conclusion from './components/Conclusion';
import { GraphProvider } from './contexts/GraphContext';
import { fetchData } from './dataLoader';
import './App.css';

const slides = [
  { title: 'Welcome', text: 'Kristiaan Koppes' },
  { title: 'Family', text: 'Meet my family' },
];

function App() {
  const [step, setStep] = useState(0);
  const [slidesData, setSlidesData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [mekkoData, setMekkoData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const slidesData = await fetchData('/slides.json');
      const locationsData = await fetchData('/locations.json');
      const mekkoData = await fetchData('/mekkoData.json');

      setSlidesData(slidesData);
      setLocations(locationsData);
      setMekkoData(mekkoData);
    };

    loadData();
  }, []);

  const handleNext = () => {
    setStep((prev) => (prev < 6 ? prev + 1 : 0));
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return slidesData.length > 0 && (
          <Slide content={slides[0]} image="images/front-image.jpg" />
        );
      case 1:
        return <FamilySlide />;
      case 2:
        return <Map />;
      case 3:
        return <FamilySlide2 />;
      case 4:
        return (
          <GraphProvider>
            <div className="main-content">
              <Graph />
              <Sidebar />
            </div>
          </GraphProvider>
        );
      case 5:
        return mekkoData.length > 0 && <MekkoChart data={mekkoData} />;
      case 6:
        return <Conclusion />;
      default:
        return null;
    }
  };

  return (
    <div className="app" onKeyPress={(e) => { if (e.code === 'Space') handleNext(); }} tabIndex="0">
      {renderContent()}
    </div>
  );
}

export default App;
