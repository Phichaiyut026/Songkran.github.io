"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

type Drop = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
};

export default function WaterDrops() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const idCounter = useRef(0); // ตัวนับสำหรับสร้าง id ที่ unique

  useEffect(() => {
    // Create initial drops
    const initialDrops: Drop[] = [];
    for (let i = 0; i < 20; i++) {
      initialDrops.push(createDrop());
    }
    setDrops(initialDrops);

    // Add new drops periodically
    const interval = setInterval(() => {
      setDrops((prevDrops) => {
        // Remove some old drops
        const filtered = prevDrops.filter((_, i) => i > prevDrops.length - 15);
        // Add new drop with unique id
        return [...filtered, createDrop()];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const createDrop = (): Drop => {
    return {
      id: idCounter.current++, // เพิ่ม counter ขึ้นเรื่อย ๆ
      x: Math.random() * 100, // percentage across screen
      y: -10, // start above viewport
      size: Math.random() * 20 + 10, // size between 10-30px
      delay: Math.random() * 2,
      duration: Math.random() * 5 + 5, // fall duration between 5-10s
    };
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {drops.map((drop) => (
        <motion.div
          key={drop.id} // ใช้ id ที่ unique จาก counter
          className="absolute rounded-full bg-blue-400 dark:bg-blue-500 opacity-30"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
            width: `${drop.size}px`,
            height: `${drop.size}px`,
          }}
          initial={{ y: "-10%", opacity: 0.7 }}
          animate={{
            y: "110%",
            opacity: 0,
            transition: {
              duration: drop.duration,
              delay: drop.delay,
              ease: "easeIn",
            },
          }}
        />
      ))}
    </div>
  );
}