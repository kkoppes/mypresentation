// src/App.js

// Importing necessary modules and components
import React, { useState, useEffect } from 'react';
import Slide from './components/Slide';
import FamilySlide from './components/FamilySlide';
import FamilySlide2 from './components/FamilySlide2';
import Map from './components/Map';
import Graph from './components/Graph'; // Correct import statement
import MekkoChart from './components/MekkoChart'; // Correct import statement
import { fetchData } from './dataLoader';
import './App.css';

// Array of slides to be displayed in the app
const slides = [
  { title: "Welcome", text: "Kristiaan Koppes" },
  { title: "Family", text: "Meet my family" },
];

function App() {
  // useState hooks to manage various pieces of state
  const [step, setStep] = useState(0); // Current step in the slideshow
  const [slidesData, setSlidesData] = useState([]); // Data for the slides
  const [locations, setLocations] = useState([]); // Data for the locations map
  const [graph, setGraph] = useState({ nodes: [], edges: [] }); // Data for the graph
  const [mekkoData, setMekkoData] = useState([]); // Data for the Mekko chart

  // useEffect hook to load data when the component mounts
  useEffect(() => {
    const loadData = async () => {
      // Fetch data from JSON files
      const slidesData = await fetchData('/slides.json');
      const locationsData = await fetchData('/locations.json');
      const graphData = await fetchData('/graph.json');
      const mekkoData = await fetchData('/mekkoData.json');

      // Set the fetched data into state
      setSlidesData(slidesData);
      setLocations(locationsData);
      setGraph(graphData);
      setMekkoData(mekkoData);
    };

    loadData(); // Call the loadData function to fetch data
  }, []); // Empty dependency array ensures this runs only once

  // Function to handle moving to the next step in the slideshow
  const handleNext = () => {
    setStep(prev => (prev < 5 ? prev + 1 : 0)); // Loop back to the beginning after the last slide
  };

  // Function to render content based on the current step
  const renderContent = () => {
    switch (step) {
      case 0:
        return slidesData.length > 0 && <Slide content={slides[0]} image="images/front-image.jpg" />;
      case 1:
        return <FamilySlide />;
      case 2:
        return <Map />;
      case 3:
        return <FamilySlide2 />;
      case 4:
        return graph.nodes.length > 0 && <Graph graph={graph} />;
      case 5:
        return mekkoData.length > 0 && <MekkoChart data={mekkoData} />;
      default:
        return <div><img src="/images/starry_sky.gif" alt="Conclusion" /></div>; // Default case for any undefined step
    }
  };

  // JSX to render the application
  return (
    <div className="app" onKeyPress={(e) => { if (e.code === 'Space') handleNext(); }} tabIndex="0">
      {renderContent()} {/* Render the content based on the current step */}
    </div>
  );
}

export default App; // Export the App component as the default export
