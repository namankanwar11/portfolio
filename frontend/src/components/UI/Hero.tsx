"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import SceneWrapper from "@/components/Canvas/SceneWrapper";
import NeuralNetwork from "@/components/Canvas/NeuralNetwork";
import { useInView } from "@/hooks/usePerformance";

const roles = [
  "AI Systems Developer",
  "Data Science Enthusiast",
  "Backend Engineer",
  "Cybersecurity Researcher",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useInView(sectionRef);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const ticker = setInterval(
      () => {
        const currentRole = roles[currentRoleIndex];
        const updatedText = isDeleting
          ? currentRole.substring(0, displayText.length - 1)
          : currentRole.substring(0, displayText.length + 1);

        setDisplayText(updatedText);

        if (!isDeleting && updatedText === currentRole) {
          clearInterval(ticker);
          setTimeout(() => setIsDeleting(true), 2500);
        } else if (isDeleting && updatedText === "") {
          setIsDeleting(false);
          setCurrentRoleIndex((currentRoleIndex + 1) % roles.length);
        }
      },
      isDeleting ? 40 : 120,
    );

    return () => clearInterval(ticker);
  }, [displayText, isDeleting, currentRoleIndex]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {}
      <div className="absolute inset-0 z-0">
        <SceneWrapper cameraPosition={[0, 0, 12]} active={isVisible}>
          <NeuralNetwork />
        </SceneWrapper>
      </div>

      {}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,#030712_70%)]" />

      {}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40vh] z-[1] opacity-20"
        style={{
          background: "linear-gradient(to bottom, transparent, #030712)",
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "bottom",
        }}
      />

      <div className="z-10 text-center px-4 max-w-5xl">
        {}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/30 bg-neon-green/5 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-neon-green font-mono text-xs tracking-widest uppercase">
            System Online
          </span>
        </motion.div>

        {}
        <motion.h1
          className="text-6xl sm:text-7xl md:text-9xl font-black mb-4 tracking-tighter leading-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            NAMAN
          </span>
          <br />
          <span className="text-gradient drop-shadow-[0_0_40px_rgba(168,85,247,0.5)]">
            KANWAR
          </span>
        </motion.h1>

        {}
        <motion.div
          className="h-10 md:h-14 flex items-center justify-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="font-mono text-lg md:text-2xl tracking-wide">
            <span className="text-gray-500">{">"} </span>
            <span className="text-gray-200">{displayText}</span>
            <span className="inline-block w-3 h-6 bg-neon-blue ml-1 animate-pulse" />
          </div>
        </motion.div>

        {}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <button
            onClick={() => scrollTo("projects")}
            className="group relative px-8 py-3.5 rounded-xl overflow-hidden font-bold tracking-wide text-sm uppercase"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
            <span className="relative z-10 text-white">View Projects</span>
          </button>
          <button className="px-8 py-3.5 rounded-xl border border-white/20 text-white font-bold tracking-wide text-sm uppercase hover:border-white/40 hover:bg-white/5 transition-all backdrop-blur-sm">
            Download Resume
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="px-8 py-3.5 rounded-xl border border-neon-pink/30 text-neon-pink font-bold tracking-wide text-sm uppercase hover:border-neon-pink/60 hover:bg-neon-pink/5 transition-all"
          >
            Contact Me
          </button>
        </motion.div>
      </div>

      {}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-mono">
          Scroll
        </span>
        <motion.div
          className="w-5 h-8 rounded-full border border-gray-600 flex justify-center pt-1.5"
          animate={{
            borderColor: [
              "rgba(100,100,100,0.5)",
              "rgba(0,212,255,0.5)",
              "rgba(100,100,100,0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-neon-blue"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
