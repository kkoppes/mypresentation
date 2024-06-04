// src/components/Slide.js
import React from 'react';
import './Slide.css';

const Slide = ({ content, image }) => (
  <div className="slide">
    <img src={image} alt="Slide" className="slide-image" />
    <h1>{content.title}</h1>
    <p>{content.text}</p>
  </div>
);

export default Slide;
