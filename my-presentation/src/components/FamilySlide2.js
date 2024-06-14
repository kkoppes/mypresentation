// src/components/FamilySlide.js
import React from 'react';
import { useSpring, animated } from 'react-spring';
import './FamilySlide.css';

const images = [
  'images/image_2.webp',
  'images/image_3.webp',
  'images/image_4.webp'
];

const FamilySlide2 = () => {
  return (
    <div className="family-slide">
      {images.map((image, index) => {
        const props = useSpring({
          opacity: 1,
          from: { opacity: 0 },
          delay: index * 500, // 15 seconds interval with overlap
          config: { duration: 500 } // Animation duration
        });

        return (
          <animated.img
            key={index}
            src={image}
            alt={`Family ${index + 1}`}
            className="family-image"
            style={props}
          />
        );
      })}
    </div>
  );
};

export default FamilySlide2;
