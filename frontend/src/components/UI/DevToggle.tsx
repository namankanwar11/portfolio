"use client";

import { motion } from "framer-motion";
import { Terminal, Activity } from "lucide-react";
import { useDeveloper } from "@/hooks/useDeveloper";

export default function DevToggle() {
  const { isDeveloperMode, toggleDeveloperMode, latency } = useDeveloper();

  return (
    <motion.button
      onClick={toggleDeveloperMode}
      className={`fixed bottom-6 right-6 z-50 rounded-full flex items-center gap-2 backdrop-blur-md border border-white/10 shadow-lg transition-colors p-3 hover:scale-105 active:scale-95 ${
        isDeveloperMode
          ? "bg-cyan-500/20 text-cyan-400"
          : "bg-black/50 text-white/50 hover:bg-black/80 hover:text-white"
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      <Terminal size={20} />
      {isDeveloperMode && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          className="flex items-center gap-3 overflow-hidden text-xs font-mono whitespace-nowrap"
        >
          <span className="font-semibold uppercase tracking-wider pl-1">
            Dev Mode
          </span>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-1.5 min-w-[50px] pr-2">
            <Activity
              size={12}
              className={latency > 0 ? "animate-pulse" : ""}
            />
            <span>{latency > 0 ? `${latency}ms` : "OFFLINE"}</span>
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}
