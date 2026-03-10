"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { levels } from "./puzzleSystem";
import { audioManager } from "@/audio/audioManager";

interface HackUIProps {
  levelIndex: number;
  activated: number;
  total: number;
  phase: "rules" | "question" | "puzzle" | "solved";
  onNextLevel: () => void;
  onSkip: () => void;
  onStartQuestion: () => void;
  onStartPuzzle: () => void;
}

export default function HackUI({
  levelIndex,
  activated,
  total,
  phase,
  onNextLevel,
  onSkip,
  onStartQuestion,
  onStartPuzzle,
}: HackUIProps) {
  const level = levels[levelIndex];
  const isLastLevel = levelIndex === levels.length - 1;
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showWrong, setShowWrong] = useState(false);

  const scrollToSection = (sectionName: string) => {
    audioManager.play("click");
    let id = "hero";
    if (sectionName.toLowerCase().includes("project")) id = "projects";
    if (sectionName.toLowerCase().includes("skill")) id = "skills";
    if (sectionName.toLowerCase().includes("experience")) id = "timeline";
    if (sectionName.toLowerCase().includes("contact")) id = "contact";
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const answerQuestion = (index: number) => {
    selectedAnswer !== null ? null : audioManager.play("click");
    setSelectedAnswer(index);
    if (index === level.question.correctAnswer) {
      setTimeout(() => {
        setSelectedAnswer(null);
        audioManager.play("unlock");
        onStartPuzzle();
      }, 500);
    } else {
      setShowWrong(true);
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowWrong(false);
      }, 800);
    }
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {}
      <AnimatePresence>
        {phase === "puzzle" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-6 left-6 pointer-events-auto"
          >
            <div className="glassmorphism px-6 py-4 border border-neon-blue/30 backdrop-blur-md bg-[#0a0f1e]/80">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                <h3 className="text-neon-blue font-mono text-sm tracking-widest uppercase">
                  Security Level {levelIndex + 1}
                </h3>
              </div>
              <p className="text-white text-xl font-black tracking-tight mb-1">
                {level.name}
              </p>
              <p className="text-gray-400 text-xs font-mono">
                Target: {level.unlocks}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {phase === "puzzle" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 pointer-events-auto"
          >
            <div className="glassmorphism px-6 py-4 border border-neon-purple/30 backdrop-blur-md bg-[#0a0f1e]/80 min-w-[200px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
                  Nodes Active
                </span>
                <span className="text-sm font-mono font-bold text-neon-purple tabular-nums">
                  {activated} / {total}
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${(activated / total) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {phase === "puzzle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-4"
          >
            <div className="glassmorphism px-8 py-3 border border-white/10 text-center backdrop-blur-md bg-[#0a0f1e]/80">
              <p className="text-[11px] font-mono tracking-[0.15em] text-gray-300 uppercase">
                Click nodes or use ARROW KEYS + ENTER to unlock
              </p>
            </div>
            <button
              onClick={() => {
                audioManager.play("click");
                onSkip();
              }}
              onMouseEnter={() => audioManager.play("hover")}
              className="text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              [ Skip Security Puzzle ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {phase === "rules" && (
          <motion.div
            className="absolute inset-0 bg-[#050b14]/90 backdrop-blur-md flex items-center justify-center pointer-events-auto z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glassmorphism max-w-lg w-full p-8 border border-neon-blue/30"
            >
              <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                <span className="w-3 h-3 bg-red-500 rounded-sm animate-pulse" />
                Security Overwrite
              </h2>

              <div className="space-y-4 mb-8 text-sm font-mono text-gray-300">
                <p>{">"} WARNING: UNAUTHORIZED ACCESS DETECTED</p>
                <p>{">"} INITIATING COUNTER-MEASURES...</p>
                <div className="h-px bg-white/10 my-4" />
                <p className="text-neon-blue font-bold">
                  PROTOCOL BYPASS RULES:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-400">
                  <li>
                    Before each hack, you must bypass a security question
                    module.
                  </li>
                  <li>
                    Questions cover domains:{" "}
                    <span className="text-white">
                      AI, Machine Learning, Python
                    </span>
                    .
                  </li>
                  <li>
                    If correct, the hardware firewall (node puzzle) is revealed.
                  </li>
                  <li>
                    Connect hardware nodes sequentially using{" "}
                    <span className="text-white">Click</span> or{" "}
                    <span className="text-white">Arrows+Enter</span>.
                  </li>
                </ol>
              </div>

              <button
                onClick={() => {
                  audioManager.play("click");
                  onStartQuestion();
                }}
                onMouseEnter={() => audioManager.play("hover")}
                className="w-full group relative px-8 py-4 bg-neon-blue/10 rounded-lg overflow-hidden font-bold tracking-widest text-xs uppercase border border-neon-blue hover:bg-neon-blue/20 transition-all font-mono"
              >
                <span className="text-neon-blue group-hover:text-white transition-colors">
                  Acknowledge {">"} Start Hack
                </span>
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    audioManager.play("click");
                    onSkip();
                  }}
                  onMouseEnter={() => audioManager.play("hover")}
                  className="text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-white"
                >
                  [ Skip Puzzle Entirely ]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {phase === "question" && (
          <motion.div
            className="absolute inset-0 bg-[#050b14]/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glassmorphism max-w-2xl w-full p-8 border border-neon-purple/30 text-center"
            >
              <p className="text-neon-purple font-mono text-xs tracking-widest uppercase mb-2">
                Security Module {levelIndex + 1}
              </p>
              <h2 className="text-2xl font-black text-white mb-8">
                {level.question.text}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {level.question.options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === level.question.correctAnswer;

                  let bgColor =
                    "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30";
                  if (isSelected && !showWrong)
                    bgColor = "bg-neon-green/20 border-neon-green";
                  if (isSelected && showWrong)
                    bgColor = "bg-red-500/20 border-red-500";
                  if (showWrong && isCorrect)
                    bgColor = "bg-neon-green/20 border-neon-green";

                  return (
                    <button
                      key={i}
                      onClick={() => answerQuestion(i)}
                      onMouseEnter={() => audioManager.play("hover")}
                      disabled={selectedAnswer !== null}
                      className={`px-6 py-4 rounded-lg border text-sm font-mono transition-all text-left ${bgColor}`}
                    >
                      <span className="text-gray-500 mr-2">[{i + 1}]</span>
                      <span className="text-gray-200">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showWrong && (
                <p className="text-red-500 font-mono text-xs animate-pulse">
                  ACCESS DENIED. RE-EVALUATING...
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {phase === "solved" && (
          <motion.div
            className="absolute inset-0 bg-[#0a0f1e]/90 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => audioManager.play("transition")}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center"
            >
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-green/10 border border-neon-green/30">
                <svg
                  className="w-10 h-10 text-neon-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
                ACCESS GRANTED
              </h2>
              <p className="text-neon-green font-mono text-sm tracking-widest uppercase mb-10">
                {level.unlocks} Unlocked
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => scrollToSection(level.unlocks)}
                  onMouseEnter={() => audioManager.play("hover")}
                  className="px-8 py-3 rounded-lg border border-neon-blue/30 text-neon-blue font-bold tracking-widest text-xs uppercase hover:bg-neon-blue/10 transition-colors"
                >
                  View {level.unlocks}
                </button>

                {!isLastLevel && (
                  <button
                    onClick={() => {
                      audioManager.play("click");
                      onNextLevel();
                    }}
                    onMouseEnter={() => audioManager.play("hover")}
                    className="group relative px-8 py-3 rounded-lg overflow-hidden font-bold tracking-widest text-xs uppercase"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-90 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 text-white">
                      Proceed to Level {levelIndex + 2}
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
