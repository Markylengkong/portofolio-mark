"use client";

import React, { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

// ... sisa kode LanyardCard kamu di bawahnya ...



function LanyardCard() {
  const [isSwinging, setIsSwinging] = useState(false);

  const handleClick = () => {
    if (!isSwinging) {
      setIsSwinging(true);
      setTimeout(() => setIsSwinging(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none pt-4">
      {/* Paku/Gantungan Atas (Statis) */}
      <div className="w-3 h-3 rounded-full bg-neutral-600 border border-neutral-500 z-30 -mb-1 shadow-md" />

      {/* PARENT MOTION: Tali & Kartu Ditarik & Berayun Bersama */}
      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -30, bottom: 120 }}
        dragElastic={0.4}
        dragSnapToOrigin={true}
        onClick={handleClick}
        initial={{ rotate: 0 }}
        animate={
          isSwinging
            ? {
                rotate: [0, 18, -14, 10, -5, 0],
                transition: { duration: 1.8, ease: "easeInOut" },
              }
            : { rotate: 0 }
        }
        whileHover={{ scale: 1.02 }}
        whileTap={{ cursor: "grabbing" }}
        style={{ transformOrigin: "top center" }}
        className="flex flex-col items-center cursor-grab active:cursor-grabbing z-20 origin-top"
      >
        {/* Tali Lanyard */}
        <div className="w-1.5 h-24 bg-gradient-to-b from-neutral-600 to-neutral-700 rounded-full shadow-inner" />

        {/* Ring Besi Pengikat */}
        <div className="w-5 h-5 rounded-full border-2 border-neutral-500 bg-neutral-800 -mt-2 z-10 shadow-md flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
        </div>

        {/* Kartu ID Card */}
        <div className="w-64 bg-gradient-to-b from-neutral-800/90 to-neutral-900/95 border border-neutral-700/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md -mt-1 pointer-events-none">
          <div className="w-10 h-2.5 bg-neutral-700 rounded-full mx-auto mb-3 border border-neutral-600 shadow-inner" />

          <div className="w-full h-72 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden relative mb-3 flex items-center justify-center">
            <span className="text-xs text-neutral-500 font-mono">[Foto Profil]</span>
          </div>

          <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono pt-1">
            <span>FRONTEND DEV</span>
            <span>ID CARD</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}