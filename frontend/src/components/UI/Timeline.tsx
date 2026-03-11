"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import SceneWrapper from "@/components/Canvas/SceneWrapper";
import ParticleField from "@/components/Canvas/ParticleField";
import { useInView } from "@/hooks/usePerformance";

const timelineData = [
  {
    year: "2025",
    title: "Cybersecurity Intern",
    subtitle: "C-DAC, NOIDA",
    description:
      "Ethical Hacking and Penetration Testing under the Cyber Gyan Project, Ministry of Electronics & IT.",
    color: "#00d4ff",
    icon: "🔐",
  },
  {
    year: "2025",
    title: "Software Developer Intern",
    subtitle: "Loan Hundi",
    description:
      "Built AI chatbots for onboarding and automated tier-1 customer support.",
    color: "#a855f7",
    icon: "🤖",
  },
  {
    year: "2025",
    title: "Hackathon Finalist",
    subtitle: "NSUT SIH 2025 — Top 25",
    description:
      "Ranked among the Top 25 teams in the Smart India Hackathon at the internal round.",
    color: "#ff006e",
    icon: "🏆",
  },
  {
    year: "2024",
    title: "DSA Certification",
    subtitle: "Coding Ninjas",
    description: "Completed Data Structures and Algorithms in C++.",
    color: "#39ff14",
    icon: "📜",
  },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative w-full py-32 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-30">
        <SceneWrapper cameraPosition={[0, 0, 10]} active={isVisible}>
          <ParticleField color="#ff006e" count={100} spread={15} />
        </SceneWrapper>
      </div>

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="absolute top-40 right-0 w-80 h-80 bg-neon-blue/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gray-500" />
            <span className="text-gray-400 font-mono text-sm tracking-widest uppercase">
              Journey
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            System <span className="text-gradient">Logs</span>
          </h2>
        </motion.div>

        <div className="relative">
          {}
          <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-neon-blue/50 via-neon-purple/30 to-transparent" />

          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              className="mb-12 ml-12 relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {}
              <div className="absolute -left-[33px] top-4 flex items-center justify-center">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg glassmorphism"
                  style={{
                    borderColor: `${item.color}30`,
                    boxShadow: `0 0 15px ${item.color}20`,
                  }}
                >
                  {item.icon}
                </div>
              </div>

              <div className="glassmorphism p-6 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                <div
                  className="absolute top-0 left-0 w-full h-[1px]"
                  style={{
                    background: `linear-gradient(to right, ${item.color}40, transparent)`,
                  }}
                />

                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="font-mono text-xs px-2 py-0.5 rounded border"
                    style={{
                      borderColor: `${item.color}30`,
                      color: item.color,
                    }}
                  >
                    {item.year}
                  </span>
                  <span className="text-gray-600 text-xs">•</span>
                  <span className="text-gray-400 text-sm">{item.subtitle}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
