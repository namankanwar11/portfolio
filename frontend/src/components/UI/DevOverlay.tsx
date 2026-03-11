"use client";

import { motion } from "framer-motion";
import { useDeveloper } from "@/hooks/useDeveloper";
import { Copy, Terminal } from "lucide-react";

interface DevOverlayProps {
  data: Record<string, string | number | boolean | React.ReactNode>;
  className?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";
}

export default function DevOverlay({ data, className = "", position = "top-right" }: DevOverlayProps) {
  const { isDeveloperMode } = useDeveloper();

  if (!isDeveloperMode) return null;

  const positionClasses = {
    "top-right": "top-2 right-2",
    "top-left": "top-2 left-2",
    "bottom-right": "bottom-2 right-2",
    "bottom-left": "bottom-2 left-2",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`absolute z-40 bg-black/90 backdrop-blur-xl border border-cyan-500/40 rounded-md p-3 font-mono text-xs w-[240px] shadow-[0_0_15px_rgba(6,182,212,0.15)] ${positionClasses[position]} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-cyan-500/30 text-cyan-400">
        <div className="flex items-center gap-1.5">
          <Terminal size={12} />
          <span className="font-semibold tracking-wider text-[10px]">SYS.INSPECTOR</span>
        </div>
        <Copy 
          size={12} 
          className="cursor-pointer hover:text-white transition-colors" 
          onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
        />
      </div>

      <div className="space-y-1.5 text-gray-300">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start gap-4">
            <span className="text-cyan-500/80 whitespace-nowrap">{key}:</span>
            <span className="text-right break-words w-full font-medium text-[10px] text-green-400">
              {value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
