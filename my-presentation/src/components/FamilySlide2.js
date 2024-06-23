import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import './FamilySlide.css';

const images = [
  'images/stairs.jpg'];

const initialShortEdge = 700; // You can adjust this value to set the initial size
const maxDistanceFromCenter = 500; // Maximum distance from the center
const minDistanceBetweenImages = 400; // Minimum distance between image centers
const speed = 0.5; // Speed of movement

const FamilySlide2 = () => {
  const [orientations, setOrientations] = useState([]);
  const [positions, setPositions] = useState([]);
  const [velocities, setVelocities] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [containerSizes, setContainerSizes] = useState([]);
  const imageRefs = useRef([]);
  const animationFrameId = useRef(null);

  const loadImage = (src, index) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ index, isLandscape: img.width > img.height, width: img.width, height: img.height });
      };
      img.src = src;
    });
  };

  const generatePositionsAndVelocities = () => {
    const positions = [];
    const velocities = [];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    const isFarEnough = (x, y, width, height) => {
      const imageCenterX = x + width / 2;
      const imageCenterY = y + height / 2;
      return positions.every(pos => {
        const posCenterX = pos.x + pos.width / 2;
        const posCenterY = pos.y + pos.height / 2;
        return Math.hypot(posCenterX - imageCenterX, posCenterY - imageCenterY) > minDistanceBetweenImages;
      });
    };

    for (let i = 0; i < images.length; i++) {
      let x, y;
      let attempts = 0;
      const { width, height } = containerSizes[i] || { width: initialShortEdge, height: initialShortEdge }; // Default sizes if not loaded yet
      const containerWidth = orientations[i] ? initialShortEdge * zoom : (initialShortEdge * zoom) / 1.5;
      const containerHeight = orientations[i] ? (initialShortEdge * zoom) / 1.5 : initialShortEdge * zoom;
      do {
        x = centerX + (Math.random() * 2 - 1) * maxDistanceFromCenter - containerWidth / 2;
        y = centerY + (Math.random() * 2 - 1) * maxDistanceFromCenter - containerHeight / 2;
        attempts++;
        if (attempts > 100) { // Safety break to prevent infinite loop in edge cases
          break;
        }
      } while (!isFarEnough(x, y, containerWidth, containerHeight));
      // Ensure the positions are within bounds
      x = Math.max(0, Math.min(viewportWidth - containerWidth, x));
      y = Math.max(0, Math.min(viewportHeight - containerHeight, y));
      positions.push({ x, y, width: containerWidth, height: containerHeight });
      velocities.push({
        vx: (Math.random() * 2 - 1) * speed,
        vy: (Math.random() * 2 - 1) * speed
      });
    }

    return { positions, velocities };
  };

  useEffect(() => {
    // Initial load
    Promise.all(images.map((image, index) => loadImage(image, index))).then((results) => {
      const newOrientations = results.sort((a, b) => a.index - b.index).map((result) => result.isLandscape);
      setOrientations(newOrientations);
      setContainerSizes(results.map(result => ({ width: result.width, height: result.height })));
      const { positions, velocities } = generatePositionsAndVelocities();
      setPositions(positions);
      setVelocities(velocities);
    });

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  useEffect(() => {
    const updatePositions = () => {
      setPositions((prevPositions) => {
        return prevPositions.map((pos, index) => {
          if (!velocities[index]) return pos; // Handle missing velocities
          let { x, y, width, height } = pos;
          const { vx, vy } = velocities[index];
          x += vx;
          y += vy;

          // Bounce off the edges
          if (x <= 0 || x >= window.innerWidth - width) {
            velocities[index].vx *= -1;
            x = Math.max(0, Math.min(window.innerWidth - width, x));
          }
          if (y <= 0 || y >= window.innerHeight - height) {
            velocities[index].vy *= -1;
            y = Math.max(0, Math.min(window.innerHeight - height, y));
          }

          return { ...pos, x, y };
        });
      });
      animationFrameId.current = requestAnimationFrame(updatePositions);
    };

    animationFrameId.current = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [velocities]);

  useEffect(() => {
    const { positions, velocities } = generatePositionsAndVelocities();
    setPositions(positions);
    setVelocities(velocities);
  }, [zoom]);

  const reshuffle = () => {
    // Recalculate positions during reshuffle
    const { positions, velocities } = generatePositionsAndVelocities();
    setPositions(positions);
    setVelocities(velocities);
  };

  const increaseSize = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 2)); // Max zoom 2x
  };

  const decreaseSize = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5)); // Min zoom 0.5x
  };

  return (
    <div className="family-slide">
      {positions.length > 0 && images.map((image, index) => {
        const isLandscape = orientations[index];
        const containerWidth = isLandscape ? initialShortEdge * zoom : (initialShortEdge * zoom) / 1.5;
        const containerHeight = isLandscape ? (initialShortEdge * zoom) / 1.5 : initialShortEdge * zoom;

        return (
          <Draggable key={index} nodeRef={imageRefs.current[index]}>
            <div
              ref={el => imageRefs.current[index] = el}
              className="image-container"
              style={{
                top: positions[index].y,
                left: positions[index].x,
                width: containerWidth,
                height: containerHeight,
                transformOrigin: 'top left',
                position: 'absolute'
              }}
            >
              <img
                src={image}
                alt={`Family ${index + 1}`}
                className="family-image"
              />
            </div>
          </Draggable>
        );
      })}
      <div className="controls">
        <button className="control-button" onClick={reshuffle}><i className="fas fa-random"></i></button>
        <button className="control-button" onClick={increaseSize}><i className="fas fa-search-plus"></i></button>
        <button className="control-button" onClick={decreaseSize}><i className="fas fa-search-minus"></i></button>
      </div>
    </div>
  );
};

export default FamilySlide2;
