// src/components/Map.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchData } from '../dataLoader';

const Map = () => {
  const [steps, setSteps] = useState(0);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const loadLocations = async () => {
      const locationsData = await fetchData('/locations.json');
      setLocations(locationsData);
    };

    loadLocations();
  }, []);

  useEffect(() => {
    if (locations.length > 0) {
      const interval = setInterval(() => {
        setSteps(prev => (prev < routes.length ? prev + 1 : routes.length));
      }, 1000); // 1 seconds interval for each step

      return () => clearInterval(interval);
    }
  }, [locations]);

  if (locations.length === 0) {
    return null;
  }

  const routes = [
    [locations[0].coordinates, locations[1].coordinates], // Amsterdam to Munich
    [locations[1].coordinates, locations[2].coordinates], // Munich to Bremen
    [locations[2].coordinates, locations[3].coordinates], // Bremen to Ankara
    [locations[3].coordinates, locations[4].coordinates], // Ankara to Toulouse
    [locations[4].coordinates, locations[5].coordinates], // Toulouse to Augsburg
    [locations[5].coordinates, locations[6].coordinates], // Augsburg to Hamburg
    [locations[6].coordinates, locations[7].coordinates], // Hamburg to Nordenham
    [locations[7].coordinates, locations[2].coordinates]  // Nordenham to Bremen
  ];

  return (
    <MapContainer center={[51.505, -0.09]} zoom={4} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routes.slice(0, steps).map((route, index) => (
        <Polyline key={index} positions={route} color="blue" />
      ))}
    </MapContainer>
  );
};

export default Map;
