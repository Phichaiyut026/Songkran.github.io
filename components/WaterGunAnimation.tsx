"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const WaterGunAnimation = () => {
  const [showWaterGun, setShowWaterGun] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: 50 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [waterDrops, setWaterDrops] = useState<
    { id: string; x: number; y: number; speedX: number; speedY: number; size: number; opacity: number }[]
  >([]);
  const dropIdCounter = useRef(0);

  // Show water gun occasionally
  useEffect(() => {
    // For testing, make the gun appear immediately and more frequently
    setShowWaterGun(true);
    const randomInterval = Math.floor(Math.random() * 5000) + 5000; // Every 5-10 seconds
    
    const interval = setInterval(() => {
      setShowWaterGun(true);
      setPosition({
        x: -100,
        y: Math.floor(Math.random() * 60) + 20, // Random position between 20% and 80% of viewport height
      });

      // Start animating after a short delay
      setTimeout(() => {
        setIsAnimating(true);
      }, 500);

      // Hide after animation completes
      setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setShowWaterGun(false);
          setWaterDrops([]);
          dropIdCounter.current = 0;
        }, 1000);
      }, 3000);
    }, randomInterval);

    return () => clearInterval(interval);
  }, []);

  // Create water spray effect
  useEffect(() => {
    if (isAnimating) {
      const createDropInterval = setInterval(() => {
        setWaterDrops((prev) => {
          // Calculate the current position of the gun nozzle
          const gunCurrentX = isAnimating ? 50 : -100; // Based on the animation state
          
          // Create new drops from the current position of the gun
          const newDrop = {
            id: `drop-${Date.now()}-${dropIdCounter.current++}`,
            x: gunCurrentX + 100, // Start from the tip of the water gun
            y: position.y + 25,
            speedX: Math.random() * 10 + 15, // Increased horizontal speed
            speedY: (Math.random() - 0.5) * 8, // Vertical speed (random up/down)
            size: Math.random() * 8 + 5, // Increased size between 5-13px
            opacity: Math.random() * 0.7 + 0.3, // Random opacity between 0.3-1.0
          };
          
          return [...prev.slice(-40), newDrop]; // Keep more drops for better effect
        });
      }, 30); // Create drops more frequently

      return () => clearInterval(createDropInterval);
    }
  }, [isAnimating, position]);

  // Animation for water drops
  useEffect(() => {
    if (waterDrops.length > 0 && isAnimating) {
      const moveInterval = setInterval(() => {
        setWaterDrops(prev => 
          prev.map(drop => ({
            ...drop,
            x: drop.x + drop.speedX,
            y: drop.y + drop.speedY,
            opacity: drop.opacity > 0.05 ? drop.opacity - 0.05 : 0,
          })).filter(drop => drop.opacity > 0) // Remove invisible drops
        );
      }, 50);
      
      return () => clearInterval(moveInterval);
    }
  }, [waterDrops, isAnimating]);

  if (!showWaterGun) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Water gun */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: isAnimating ? 50 : -100 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}%`,
          transform: "translateY(-50%)",
        }}
      >
        <svg
          width="100"
          height="50"
          viewBox="0 0 100 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Water gun body */}
          <rect x="10" y="15" width="70" height="20" rx="5" fill="#FF6D6A" />
          {/* Handle */}
          <rect x="20" y="35" width="15" height="15" rx="3" fill="#FF6D6A" />
          {/* Nozzle */}
          <rect x="80" y="20" width="10" height="10" fill="#FFD700" />
        </svg>
      </motion.div>

      {/* Water drops - render as absolute positioned divs */}
      {waterDrops.map((drop) => (
        <div
          key={drop.id}
          style={{
            position: "absolute",
            left: `${drop.x}px`,
            top: `${drop.y}%`,
            width: `${drop.size}px`,
            height: `${drop.size}px`,
            backgroundColor: "#87CEEB",
            borderRadius: "50%",
            opacity: drop.opacity,
            transition: "opacity 0.05s linear",
          }}
        />
      ))}
    </div>
  );
};

export default WaterGunAnimation;