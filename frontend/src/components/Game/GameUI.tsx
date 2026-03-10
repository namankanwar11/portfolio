"use client";

import { motion, AnimatePresence } from "framer-motion";

interface GameUIProps {
  score: number;
  health: number;
  isPlaying: boolean;
  gameOver: boolean;
  wave: number;
  onStart: () => void;
  onRestart: () => void;
}

export default function GameUI({
  score,
  health,
  isPlaying,
  gameOver,
  wave,
  onStart,
  onRestart,
}: GameUIProps) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {}
      {isPlaying && !gameOver && (
        <>
          {}
          <div className="absolute top-5 left-5 pointer-events-auto">
            <div className="glassmorphism px-5 py-3 border border-amber-500/20">
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-amber-400/70 mb-1">
                Rebel Kills
              </p>
              <p className="text-3xl font-black text-amber-400 font-mono tabular-nums">
                {score}
              </p>
            </div>
          </div>

          {}
          <div className="absolute top-5 left-1/2 -translate-x-1/2">
            <div className="glassmorphism px-5 py-2 border border-white/10">
              <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-gray-400 text-center">
                Wave
              </p>
              <p className="text-xl font-black text-white font-mono text-center">
                {wave}
              </p>
            </div>
          </div>

          {}
          <div className="absolute top-5 right-5 pointer-events-auto">
            <div className="glassmorphism px-5 py-3 min-w-[220px] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400">
                  Shield Power
                </p>
                <p
                  className="text-sm font-mono font-bold tabular-nums"
                  style={{
                    color:
                      health > 60
                        ? "#39ff14"
                        : health > 30
                          ? "#fbbf24"
                          : "#ef4444",
                  }}
                >
                  {health}%
                </p>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    background:
                      health > 60
                        ? "linear-gradient(to right, #39ff14, #22d3ee)"
                        : health > 30
                          ? "linear-gradient(to right, #fbbf24, #f97316)"
                          : "linear-gradient(to right, #ef4444, #dc2626)",
                    width: `${health}%`,
                    boxShadow: `0 0 10px ${health > 60 ? "#39ff14" : health > 30 ? "#fbbf24" : "#ef4444"}40`,
                  }}
                  animate={{ width: `${health}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </div>

          {}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              className="opacity-50"
            >
              <circle
                cx="20"
                cy="20"
                r="12"
                stroke="#fbbf24"
                strokeWidth="1"
                fill="none"
                opacity="0.4"
              />
              <line
                x1="20"
                y1="4"
                x2="20"
                y2="12"
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <line
                x1="20"
                y1="28"
                x2="20"
                y2="36"
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <line
                x1="4"
                y1="20"
                x2="12"
                y2="20"
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <line
                x1="28"
                y1="20"
                x2="36"
                y2="20"
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <circle cx="20" cy="20" r="2" fill="#fbbf24" opacity="0.6" />
            </svg>
          </div>

          {}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
            <div className="glassmorphism px-6 py-2 border border-white/5 flex items-center gap-6">
              <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">
                Click to Fire
              </span>
              <div className="w-[1px] h-4 bg-white/10" />
              <span className="text-[9px] font-mono tracking-widest text-amber-400/60 uppercase">
                Protect the Station
              </span>
            </div>
          </div>
        </>
      )}

      {}
      <AnimatePresence>
        {!isPlaying && !gameOver && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-lg">
              <motion.div
                className="mb-6"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-amber-400/80 font-mono text-[10px] tracking-[0.5em] uppercase mb-1">
                  A long time ago in a codebase far, far away...
                </p>
              </motion.div>

              <h3
                className="text-5xl md:text-6xl font-black text-amber-400 mb-2 tracking-tight"
                style={{ textShadow: "0 0 30px rgba(251,191,36,0.3)" }}
              >
                DEFEND THE
              </h3>
              <h3
                className="text-5xl md:text-6xl font-black mb-4 tracking-tight"
                style={{
                  background:
                    "linear-gradient(to bottom, #fbbf24, #f59e0b, #92400e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                }}
              >
                AI CORE
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed mb-8 px-4">
                Corrupted data packets are attacking the station. Fire defense
                pulses to destroy them before they breach the core shields.
              </p>

              <button
                onClick={onStart}
                className="group relative px-12 py-4 rounded-lg overflow-hidden font-bold tracking-widest text-sm uppercase cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400 blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
                <span className="relative z-10 text-black font-black">
                  ⚔ Launch Attack
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.p
                className="text-red-500 font-mono text-xs tracking-[0.4em] uppercase mb-3"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⚠ STATION DESTROYED
              </motion.p>
              <h3 className="text-5xl font-black text-white mb-1">
                Core Breached
              </h3>
              <p className="text-gray-500 text-xs font-mono mb-2">
                Wave {wave} Reached
              </p>
              <p
                className="text-6xl font-black font-mono mb-8"
                style={{
                  background: "linear-gradient(to bottom, #fbbf24, #92400e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {score}
              </p>

              <button
                onClick={onRestart}
                className="group relative px-12 py-4 rounded-lg overflow-hidden font-bold tracking-widest text-sm uppercase cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 text-white font-black">
                  ↻ Restart Mission
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
