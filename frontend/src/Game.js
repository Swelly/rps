import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

const Game = () => {
  const [numIcons, setNumIcons] = useState(0);
  const canvasRef = useRef(null);
  const [icons, setIcons] = useState([]);
  
  // Implement the following state variables to track the game's start time and duration.
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (numIcons > 0 && numIcons % 3 === 0) {
      setIcons(generateIcons(numIcons));
      setStartTime(Date.now());
    }
  }, [numIcons]);

  // Implement the following effect to render the icons on the canvas.
  useLayoutEffect(() => {
    if (icons.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const gameInterval = setInterval(() => {
        updateIcons(icons);
        checkCollisions(icons);
        renderIcons(ctx, icons);
  
        // Check if there's only one type of icon left
        const iconTypes = new Set(icons.map((icon) => icon.type));
        if (iconTypes.size === 1 && startTime !== null) {
          const endTime = Date.now();
          setDuration((endTime - startTime) / 1000);
          setStartTime(null);
          clearInterval(gameInterval);
        }
      }, 1000 / 60);
  
      return () => clearInterval(gameInterval);
    }
  }, [icons]);
  

  function generateIcons(numIcons) {
    const iconTypes = ['rock', 'paper', 'scissors'];
    const icons = [];
  
    for (let i = 0; i < numIcons; i++) {
      const type = iconTypes[Math.floor(i % 3)];
      const x = Math.random() * canvasRef.current.width;
      const y = Math.random() * canvasRef.current.height;
      const dx = Math.random() * 2 - 1; // Velocity in x direction
      const dy = Math.random() * 2 - 1; // Velocity in y direction
  
      icons.push({ type, x, y, dx, dy });
    }
  
    return icons;
  }

  function updateIcons(icons) {
    for (const icon of icons) {
      icon.x += icon.dx;
      icon.y += icon.dy;

      // Bounce off the edges of the canvas
      if (icon.x < 0 || icon.x > canvasRef.current.width) icon.dx = -icon.dx;
      if (icon.y < 0 || icon.y > canvasRef.current.height) icon.dy = -icon.dy;
    }
  }

  function checkCollisions(icons) {
    const iconTypes = new Set();
    
    // Check for collisions with the edge of the canvas
    for (let i = 0; i < icons.length; i++) {
      iconTypes.add(icons[i].type);

      // Check for collisions with other icons
      for (let j = i + 1; j < icons.length; j++) {
        const iconA = icons[i];
        const iconB = icons[j];
        const dx = iconA.x - iconB.x;
        const dy = iconA.y - iconB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = 40; // 2 * icon radius
        
        // If two icons collide, the winner is the one with the larger icon type
        if (distance < minDistance) {
          const winner = getWinner(iconA.type, iconB.type);
          if (winner === iconA.type) {
            iconB.type = winner;
          } else if (winner === iconB.type) {
            iconA.type = winner;
          }
        }
      }
      // If there is only one icon type left, the game is over
      if (iconTypes.size === 1 || startTime !== null) {
        const endTime = Date.now();
        setDuration((endTime - startTime) / 1000);
        setStartTime(null);
      }
    }
  }
  
  function getWinner(typeA, typeB) {
    if (typeA === typeB) {
      return null;
    }
  
    if (
      (typeA === 'rock' && typeB === 'scissors') ||
      (typeA === 'scissors' && typeB === 'paper') ||
      (typeA === 'paper' && typeB === 'rock')
    ) {
      return typeA;
    } else {
      return typeB;
    }
  }
  

  function renderIcons(ctx, icons) {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    for (const icon of icons) {
      ctx.beginPath();
      ctx.arc(icon.x, icon.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = getIconColor(icon.type);
      ctx.fill();
      ctx.closePath();
    }
  }

  function getIconColor(type) {
    switch (type) {
      case 'rock':
        return '#f00'; // red
      case 'paper':
        return '#0f0'; // green
      case 'scissors':
        return '#00f'; // blue
      default:
        return 'black';
    }
  }

  return (
    <div className="game-container">
      <h1>Rock, Paper, Scissors Game</h1>
      <input
        type="number"
        value={numIcons}
        onChange={(e) => setNumIcons(parseInt(e.target.value))}
        placeholder="Enter the number of icons"
      />
      <canvas ref={canvasRef} width="800" height="600"></canvas>
      {duration && <p>It took {duration} seconds for a winner to emerge.</p>}
    </div>
  );
};

export default Game;
