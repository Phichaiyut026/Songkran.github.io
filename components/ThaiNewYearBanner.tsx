// Thai New Year celebration banner component
import React from "react";
import { motion } from "framer-motion";

const ThaiNewYearBanner = () => {
  return (
    <motion.div 
      className="absolute top-24 left-0 right-0 mx-auto w-full max-w-screen-lg z-20 pointer-events-none px-4"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="bg-gradient-to-r from-blue-500/60 via-purple-500/60 to-pink-500/60 backdrop-blur-md rounded-lg p-3 sm:p-4 text-center shadow-lg border border-white/20">
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-1"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          สวัสดีปีใหม่ไทย 2568
        </motion.h2>
        <p className="text-white/90 text-sm sm:text-base">
          ขอให้ทุกท่านมีความสุข สดชื่น และโชคดีตลอดปี
        </p>
      </div>
    </motion.div>
  );
};

export default ThaiNewYearBanner;