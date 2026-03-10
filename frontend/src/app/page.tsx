"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/UI/Hero";
import About from "@/components/UI/About";
import Skills from "@/components/UI/Skills";
import Projects from "@/components/UI/Projects";
import AIPlayground from "@/components/UI/AIPlayground";
import Timeline from "@/components/UI/Timeline";
import Contact from "@/components/UI/Contact";
import GameSection from "@/components/UI/GameSection";
import SmoothScroll from "@/components/UI/SmoothScroll";
import ChatBot from "@/components/UI/ChatBot";
import SoundToggle from "@/components/UI/SoundToggle";
import { audioManager } from "@/audio/audioManager";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "AI Lab", href: "#ailab" },
  { label: "Timeline", href: "#timeline" },
  { label: "Game", href: "#game" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-dark-bg/80 backdrop-blur-xl border-b border-white/5"
          : "py-6 bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a
          href="#hero"
          className="text-xl font-black tracking-tight"
          onMouseEnter={() => audioManager.play("hover")}
          onClick={() => audioManager.play("click")}
        >
          <span className="text-white">N</span>
          <span className="text-gradient">K</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-colors font-mono"
              onMouseEnter={() => audioManager.play("hover")}
              onClick={() => audioManager.play("click")}
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-mono border border-white/10 text-white hover:border-neon-blue/50 hover:bg-neon-blue/5 transition-all"
          onMouseEnter={() => audioManager.play("hover")}
          onClick={() => audioManager.play("click")}
        >
          Hire Me
        </a>
      </div>
    </motion.nav>
  );
}

const bootMessages = [
  { text: "KANWAR AI SYSTEM v2.0", delay: 0, color: "#a855f7" },
  { text: "─────────────────────────────────", delay: 200, color: "#333" },
  { text: "[BOOT] Initializing core modules...", delay: 400, color: "#00d4ff" },
  { text: "[  OK  ] AI Core Reactor online", delay: 800, color: "#39ff14" },
  { text: "[  OK  ] Neural Memory loaded", delay: 1200, color: "#39ff14" },
  { text: "[  OK  ] Optimization Engine ready", delay: 1600, color: "#39ff14" },
  { text: "[LOAD] Importing skill matrices...", delay: 2000, color: "#00d4ff" },
  {
    text: "[  OK  ] Python, C++, JavaScript, AI/ML",
    delay: 2400,
    color: "#39ff14",
  },
  { text: "[LOAD] Mounting project modules...", delay: 2800, color: "#00d4ff" },
  {
    text: "[  OK  ] Quantum Traffic Optimization",
    delay: 3100,
    color: "#39ff14",
  },
  { text: "[  OK  ] MicroSwarm Agent System", delay: 3400, color: "#39ff14" },
  { text: "[LOAD] Starting simulation lab...", delay: 3700, color: "#00d4ff" },
  { text: "[  OK  ] Defense systems armed", delay: 4000, color: "#39ff14" },
  { text: "[BOOT] Launching interface...", delay: 4300, color: "#a855f7" },
  { text: "", delay: 4600, color: "" },
  { text: "Welcome to the Kanwar AI System ▓", delay: 4800, color: "#ffffff" },
];

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bootMessages.forEach((msg, i) => {
      setTimeout(() => {
        setVisibleLines(i + 1);
        setProgress(((i + 1) / bootMessages.length) * 100);
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, msg.delay);
    });

    const finishTimer = setTimeout(onComplete, 5500);
    return () => clearTimeout(finishTimer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#010409] flex flex-col items-center justify-center px-4"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
    >
      {}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />

      <div className="w-full max-w-xl">
        {}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-t-lg border border-white/10 border-b-0">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-gray-500 text-xs font-mono">
            kanwar-ai-system — boot
          </span>
        </div>

        {}
        <div
          ref={terminalRef}
          className="bg-[#0a0f1e]/80 backdrop-blur-sm border border-white/10 rounded-b-lg p-4 h-[300px] overflow-auto font-mono text-sm leading-relaxed"
        >
          {bootMessages.slice(0, visibleLines).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              style={{ color: msg.color }}
              className={msg.text === "" ? "h-2" : ""}
            >
              {msg.text}
            </motion.div>
          ))}
          {visibleLines < bootMessages.length && (
            <span className="inline-block w-2 h-4 bg-neon-blue/80 animate-pulse" />
          )}
        </div>

        {}
        <div className="mt-4 w-full">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
              System Boot Progress
            </span>
            <span className="text-[10px] font-mono text-neon-blue">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [booting, setBooting] = useState(true);

  return (
    <>
      <AnimatePresence>
        {booting && <BootSequence onComplete={() => setBooting(false)} />}
      </AnimatePresence>

      <SmoothScroll>
        <main className="min-h-screen bg-dark-bg relative">
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <AIPlayground />
          <Timeline />
          <GameSection />
          <Contact />
          <ChatBot />
          <SoundToggle />

          <footer className="w-full py-10 text-center border-t border-white/5 relative z-10">
            <p className="text-gray-600 font-mono text-xs tracking-widest">
              © 2026 NAMAN KANWAR — Built with Next.js & Three.js
            </p>
          </footer>
        </main>
      </SmoothScroll>
    </>
  );
}
