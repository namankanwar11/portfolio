"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneWrapper from "@/components/Canvas/SceneWrapper";
import HackTheSystem from "@/components/Game/HackTheSystem";
import HackUI from "@/components/Game/HackUI";
import { useInView } from "@/hooks/usePerformance";
import { audioManager } from "@/audio/audioManager";

export default function GameSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useInView(sectionRef);

  useEffect(() => {
    if (isVisible) {
      audioManager.play("transition");
    }
  }, [isVisible]);

  const [levelIndex, setLevelIndex] = useState(0);
  const [activated, setActivated] = useState(0);
  const [total, setTotal] = useState(3);
  const [phase, setPhase] = useState<
    "rules" | "question" | "puzzle" | "solved"
  >("rules");
  const [showError, setShowError] = useState(false);

  const handleProgress = (act: number, tot: number) => {
    setActivated(act);
    setTotal(tot);
  };

  const handleSolve = () => {
    setPhase("solved");
  };

  const handleFail = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 200);
  };

  const nextLevel = () => {
    setLevelIndex((prev) => prev + 1);
    setPhase("question");
  };

  const skipPuzzle = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartQuestion = () => setPhase("question");
  const handleStartPuzzle = () => setPhase("puzzle");

  return (
    <section
      id="game"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#050b14]"
    >
      {}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />

      {}
      <AnimatePresence>
        {showError && (
          <motion.div
            className="absolute inset-0 z-30 bg-red-500/15 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      {}
      <div className="absolute inset-0 z-0">
        <SceneWrapper cameraPosition={[0, 0, 7]} active={isVisible}>
          {}
          <ambientLight intensity={0.1} color="#4444ff" />
          <HackTheSystem
            levelIndex={levelIndex}
            phase={phase}
            onSolve={handleSolve}
            onFail={handleFail}
            onProgress={handleProgress}
          />
        </SceneWrapper>
      </div>

      {}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,#050b14_100%)] pointer-events-none" />

      {}
      <HackUI
        levelIndex={levelIndex}
        activated={activated}
        total={total}
        phase={phase}
        onNextLevel={nextLevel}
        onSkip={skipPuzzle}
        onStartQuestion={handleStartQuestion}
        onStartPuzzle={handleStartPuzzle}
      />
    </section>
  );
}
