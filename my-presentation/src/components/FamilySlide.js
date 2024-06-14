import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Draggable from 'react-draggable';
import './FamilySlide.css';

const images = [
  'images/1000000425.jpg',
  'images/20190608_161125.jpg',
  'images/20220621_151023.jpg',
  'images/20240426_081214.jpg',
  'images/IMG-20240420-WA0000.jpg',
  'images/IMG-20240509-WA0010.jpg',
  'images/IMG_20231224_223928.jpg',
  'images/IMG_20240303_131748.jpg',
  'images/IMG_20240303_131813.jpg',
  'images/VideoCapture_20221002-190623.jpg'
];

const FamilySlide = () => {
  const [orientations, setOrientations] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const loadImage = (src, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({ index, isLandscape: img.width > img.height });
        };
        img.src = src;
      });
    };

    Promise.all(images.map((image, index) => loadImage(image, index))).then((results) => {
      const newOrientations = results.sort((a, b) => a.index - b.index).map((result) => result.isLandscape);
      setOrientations(newOrientations);

      // Calculate random positions with spacing
      const generatePositions = () => {
        const positions = [];
        const minDistance = 150; // Minimum distance between images

        const isFarEnough = (x, y) => {
          return positions.every(pos => Math.hypot(pos.x - x, pos.y - y) > minDistance);
        };

        for (let i = 0; i < images.length; i++) {
          let x, y;
          let attempts = 0;
          do {
            x = Math.random() * (window.innerWidth - 200); // Adjust the 200 to fit the maximum width of your images
            y = Math.random() * (window.innerHeight - 200); // Adjust the 200 to fit the maximum height of your images
            attempts++;
            if (attempts > 100) { // Safety break to prevent infinite loop in edge cases
              break;
            }
          } while (!isFarEnough(x, y));
          positions.push({ x, y });
        }

        return positions;
      };

      setPositions(generatePositions());
    });
  }, []);

  return (
    <div className="family-slide">
      {positions.length > 0 && images.map((image, index) => {
        const props = useSpring({
          to: { opacity: 1, transform: `translate(${positions[index].x}px, ${positions[index].y}px) rotate(0deg)` },
          from: { opacity: 0, transform: `translate(${Math.random() * 500 - 250}px, ${Math.random() * 500 - 250}px) rotate(${Math.random() * 360}deg)` },
          delay: index * 150,
          config: { tension: 200, friction: 10 }
        });

        const isLandscape = orientations[index];

        return (
          <Draggable key={index}>
            <animated.div
              className={`image-container ${isLandscape ? 'landscape' : 'portrait'}`}
              style={props}
            >
              <img
                src={image}
                alt={`Family ${index + 1}`}
                className="family-image"
              />
            </animated.div>
          </Draggable>
        );
      })}
    </div>
  );
};

export default FamilySlide;
