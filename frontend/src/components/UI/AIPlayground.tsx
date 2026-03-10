"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import SceneWrapper from "@/components/Canvas/SceneWrapper";
import AILabRoom from "@/components/Canvas/AILabRoom";
import { useInView } from "@/hooks/usePerformance";

export default function AIPlayground() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useInView(sectionRef);

  return (
    <section
      id="ailab"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="absolute inset-0 z-0">
        <SceneWrapper cameraPosition={[0, 2, 8]} active={isVisible}>
          <AILabRoom />
        </SceneWrapper>
      </div>

      {}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-dark-bg/50 via-transparent to-dark-bg/80" />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-pink/30 bg-neon-pink/5 mb-6"
            animate={{
              borderColor: [
                "rgba(255,0,110,0.2)",
                "rgba(255,0,110,0.6)",
                "rgba(255,0,110,0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
            <span className="text-neon-pink font-mono text-xs tracking-widest uppercase">
              Experimental
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-4">
            AI <span className="text-gradient">Lab</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto px-6 text-sm leading-relaxed">
            Interactive neural core visualization. The floating data nodes
            represent asynchronous optimization routines in the MicroSwarm
            architecture.
          </p>
        </motion.div>
      </div>

      {}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-neon-blue/30 z-10 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-neon-blue/30 z-10 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-neon-blue/30 z-10 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-neon-blue/30 z-10 rounded-br-lg" />

      {}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 px-6 py-2 glassmorphism font-mono text-xs tracking-widest uppercase flex items-center gap-3"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
        <span className="text-neon-green">Simulation Running</span>
      </motion.div>
    </section>
  );
}
