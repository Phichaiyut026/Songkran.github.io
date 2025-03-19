// Songkran decorations component with traditional elements
import React from "react";
import { motion } from "framer-motion";

const SongkranDecorations = () => {
  // Flower patterns for decoration
  const flowerPatterns = [
    {
      position: "top-0 left-0",
      rotate: 0,
      scale: 1.2,
    },
    {
      position: "top-0 right-0",
      rotate: 90,
      scale: 1.2,
    },
    {
      position: "bottom-0 left-0",
      rotate: 270,
      scale: 1.2,
    },
    {
      position: "bottom-0 right-0",
      rotate: 180,
      scale: 1.2,
    },
  ];

  // Floating flowers
  const floatingFlowers = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    rotate: Math.random() * 360,
    size: Math.random() * 30 + 20,
    duration: Math.random() * 10 + 20,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Corner flower patterns */}
      {flowerPatterns.map((pattern, index) => (
        <div
          key={index}
          className={`absolute ${pattern.position} w-40 h-40 opacity-30 dark:opacity-20 pointer-events-none`}
          style={{
            transform: `rotate(${pattern.rotate}deg) scale(${pattern.scale})`,
          }}
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g fill="#FF6B6B">
              <path d="M50,20 C60,10 70,15 75,25 C80,35 70,50 50,50 C30,50 20,35 25,25 C30,15 40,10 50,20 Z" />
              <path d="M50,20 C60,10 70,15 75,25 C80,35 70,50 50,50 C30,50 20,35 25,25 C30,15 40,10 50,20 Z" transform="rotate(72 50 50)" />
              <path d="M50,20 C60,10 70,15 75,25 C80,35 70,50 50,50 C30,50 20,35 25,25 C30,15 40,10 50,20 Z" transform="rotate(144 50 50)" />
              <path d="M50,20 C60,10 70,15 75,25 C80,35 70,50 50,50 C30,50 20,35 25,25 C30,15 40,10 50,20 Z" transform="rotate(216 50 50)" />
              <path d="M50,20 C60,10 70,15 75,25 C80,35 70,50 50,50 C30,50 20,35 25,25 C30,15 40,10 50,20 Z" transform="rotate(288 50 50)" />
            </g>
            <circle cx="50" cy="50" r="10" fill="#FFBE0B" />
          </svg>
        </div>
      ))}

      {/* Floating flowers */}
      {floatingFlowers.map((flower) => (
        <motion.div
          key={flower.id}
          className="absolute opacity-40 dark:opacity-30 pointer-events-none"
          style={{
            left: `${flower.x}vw`,
            top: `${flower.y}vh`,
            width: `${flower.size}px`,
            height: `${flower.size}px`,
          }}
          animate={{
            y: [0, -20, 0, 20, 0],
            x: [0, 15, 0, -15, 0],
            rotate: [flower.rotate, flower.rotate + 20, flower.rotate, flower.rotate - 20, flower.rotate],
          }}
          transition={{
            duration: flower.duration,
            delay: flower.delay,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <circle cx="50" cy="50" r="40" fill="#FFC0CB" opacity="0.7" />
              <circle cx="50" cy="50" r="30" fill="#FF85A2" opacity="0.5" />
              <circle cx="50" cy="50" r="15" fill="#FFF7B5" />
            </g>
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default SongkranDecorations;