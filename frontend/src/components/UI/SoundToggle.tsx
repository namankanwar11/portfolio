"use client";

import { useEffect, useState } from "react";
import { audioManager } from "@/audio/audioManager";
import { motion } from "framer-motion";

export default function SoundToggle() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    audioManager.init();
    setIsMuted(audioManager.getMuted());
  }, []);

  const handleToggle = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audioManager.play("click");
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      onClick={handleToggle}
      onMouseEnter={() => !isMuted && audioManager.play("hover")}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full glassmorphism border border-white/10 hover:bg-white/5 transition-all group"
      aria-label={isMuted ? "Enable Sound" : "Disable Sound"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isMuted ? (
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              clipRule="evenodd"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-neon-blue group-hover:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9px a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </div>
      <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 group-hover:text-white hidden sm:block">
        Sound {isMuted ? "Off" : "On"}
      </span>
    </motion.button>
  );
}
