"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import SceneWrapper from "@/components/Canvas/SceneWrapper";
import ParticleField from "@/components/Canvas/ParticleField";
import { useInView } from "@/hooks/usePerformance";

const experiences = [
  {
    role: "Cybersecurity Intern",
    company: "C-DAC, NOIDA",
    period: "Jul 2025 – Aug 2025",
    description: "Completed training in Ethical Hacking and Penetration Testing under the Cyber Gyan Project, Ministry of Electronics & IT.",
    color: "#00d4ff"
  },
  {
    role: "Software Developer Intern",
    company: "Loan Hundi",
    period: "2025",
    description: "Developed AI chatbots to assist loan onboarding and automate tier-1 customer support, reducing response latency and improving conversion rates.",
    color: "#a855f7"
  }
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useInView(sectionRef);

  return (
    <section ref={sectionRef} id="about" className="relative w-full py-32 px-6 md:px-12 overflow-hidden">
      {}
      <div className="absolute inset-0 z-0 opacity-40">
        <SceneWrapper cameraPosition={[0, 0, 10]} active={isVisible}>
          <ParticleField color="#00d4ff" count={150} spread={15} />
        </SceneWrapper>
      </div>

      {}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 -right-40 w-80 h-80 bg-neon-purple/10 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-neon-blue" />
            <span className="text-neon-blue font-mono text-sm tracking-widest uppercase">System Profile</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            About <span className="text-gradient">Me</span>
          </h2>
        </motion.div>

        {}
        <motion.div 
          className="glassmorphism p-8 md:p-12 mb-16 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-neon-blue font-mono text-lg">$</span> whoami
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                B.Tech <span className="text-white font-semibold">Information Technology</span> student at <span className="text-neon-blue font-semibold">NSUT Dwarka</span>, graduating 2026.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Building intelligent systems at the intersection of <span className="text-neon-purple">AI development</span>, <span className="text-neon-blue">data science</span>, and <span className="text-neon-pink">cybersecurity</span>. Experienced in algorithmic optimization, autonomous agent systems, and quantum computing experimentation.
              </p>
            </div>
            <div className="flex-shrink-0 glassmorphism p-4 font-mono text-xs text-gray-400 leading-relaxed min-w-[280px]">
              <div className="text-neon-green mb-2">
                <div>{"{"}</div>
                <div className="pl-4"><span className="text-neon-blue">&quot;location&quot;</span>: <span className="text-neon-pink">&quot;New Delhi&quot;</span>,</div>
                <div className="pl-4"><span className="text-neon-blue">&quot;university&quot;</span>: <span className="text-neon-pink">&quot;NSUT&quot;</span>,</div>
                <div className="pl-4"><span className="text-neon-blue">&quot;focus&quot;</span>: <span className="text-neon-pink">&quot;AI + Security&quot;</span>,</div>
                <div className="pl-4"><span className="text-neon-blue">&quot;status&quot;</span>: <span className="text-neon-green">&quot;Open to Work&quot;</span></div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              className="glassmorphism p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${exp.color}, transparent)` }} />
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: exp.color }} />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: exp.color, boxShadow: `0 0 10px ${exp.color}` }} />
                <span className="font-mono text-xs tracking-widest uppercase" style={{ color: exp.color }}>{exp.period}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{exp.role}</h3>
              <p className="text-lg mb-4" style={{ color: exp.color }}>{exp.company}</p>
              <p className="text-gray-400 leading-relaxed">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
