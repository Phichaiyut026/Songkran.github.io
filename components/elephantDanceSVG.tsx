// Thai elephant SVG animation
import React from "react";
import { motion } from "framer-motion";

export const elephantDanceSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <g id="elephant">
    <path d="M50,100 Q70,90 90,100 Q110,110 130,100 Q150,90 160,100 Q170,110 170,120 L160,130 L150,135 L140,137 L120,138 L100,140 L80,138 L60,136 L50,130 L45,125 Z" fill="#A68CB4" />
    <path d="M70,100 Q90,105 100,110 Q110,105 130,100 L125,90 L110,85 L90,85 L75,90 Z" fill="#9370DB" />
    <ellipse cx="100" cy="90" rx="30" ry="20" fill="#A68CB4" />
    <circle cx="90" cy="85" r="3" fill="#333" />
    <circle cx="110" cy="85" r="3" fill="#333" />
    <path d="M95,95 Q100,100 105,95" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" />
    <path d="M65,75 Q60,60 65,40 Q70,30 80,35 Q85,40 80,50" fill="#A68CB4" />
    <path d="M135,75 Q140,60 135,40 Q130,30 120,35 Q115,40 120,50" fill="#A68CB4" />
    <path d="M70,138 L65,150" stroke="#A68CB4" stroke-width="8" stroke-linecap="round" />
    <path d="M90,139 L90,150" stroke="#A68CB4" stroke-width="8" stroke-linecap="round" />
    <path d="M110,139 L110,150" stroke="#A68CB4" stroke-width="8" stroke-linecap="round" />
    <path d="M130,138 L135,150" stroke="#A68CB4" stroke-width="8" stroke-linecap="round" />
    <path d="M100,110 L100,125 Q95,130 100,135 Q105,130 100,125" fill="#9370DB" />
  </g>
  <g id="decorations">
    <path d="M75,55 L85,50 L95,55 L85,60 Z" fill="#FFD700" />
    <path d="M105,55 L115,50 L125,55 L115,60 Z" fill="#FF6D6A" />
    <circle cx="100" cy="40" r="5" fill="#FFC0CB" />
    <rect x="70" y="65" width="60" height="5" rx="2" fill="#FFD700" />
    <circle cx="70" cy="130" r="3" fill="#FF6D6A" />
    <circle cx="130" cy="130" r="3" fill="#FFD700" />
  </g>
</svg>
`;

const DancingElephant = () => {
  return (
    <motion.div
      className="absolute bottom-4 left-4 w-24 h-24 sm:w-32 sm:h-32 z-10 opacity-80 pointer-events-none"
      animate={{
        x: [0, 10, 0, -10, 0],
        y: [0, -5, 0, -5, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "mirror",
      }}
      dangerouslySetInnerHTML={{ __html: elephantDanceSVG }}
    />
  );
};

export default DancingElephant;