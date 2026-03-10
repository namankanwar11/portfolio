"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

interface ProjectProps {
  title: string;
  description: string;
  techStack: string[];
  color: string;
  github: string;
  num: string;
}

const projects: ProjectProps[] = [
  {
    title: "Quantum Traffic Optimization",
    description:
      "Hybrid quantum-classical approach to optimize traffic signal timings in real-time. Leverages the Quantum Approximate Optimization Algorithm (QAOA), simulated via IBM Qiskit, integrated with SUMO traffic simulator.",
    techStack: ["Python", "Qiskit", "SUMO", "QAOA"],
    color: "#00d4ff",
    github: "https://github.com/namankanwar11/Quantum-Traffic-Optimization",
    num: "01",
  },
  {
    title: "MicroSwarm AI Agent System",
    description:
      "Heterogeneous AI agent swarm that autonomously plans, generates, and validates software using evolutionary genetic algorithms, quantized LLMs (Phi-3, Qwen 2.5), vulnerability scanning, and real-time telemetry dashboard.",
    techStack: ["C++17", "Python", "LLMs", "Telemetry"],
    color: "#a855f7",
    github: "#",
    num: "02",
  },
  {
    title: "Enterprise AI Chatbot",
    description:
      "Production-grade AI chatbot built for enterprise-level customer interaction, featuring natural language understanding, context-aware dialogue management, and seamless integration with business workflows.",
    techStack: ["Python", "NLP", "FastAPI", "AI APIs"],
    color: "#ff006e",
    github: "https://github.com/namankanwar11/enterprise-ai-chatbot",
    num: "03",
  },
  {
    title: "Security Camera System",
    description:
      "AI-powered security camera surveillance system using computer vision for real-time object detection, motion tracking, and automated alert generation for security monitoring.",
    techStack: ["Python", "OpenCV", "Deep Learning"],
    color: "#39ff14",
    github: "https://github.com/namankanwar11/security-camera-project-python",
    num: "04",
  },
  {
    title: "Kerala Ayurveda RAG",
    description:
      "A safety-focused RAG (Retrieval Augmented Generation) prototype for Kerala Ayurveda content retrieval, combining traditional knowledge bases with modern AI retrieval systems.",
    techStack: ["Python", "RAG", "LLMs", "Vector DB"],
    color: "#00d4ff",
    github: "https://github.com/namankanwar11/kerala-ayurveda-assignment",
    num: "05",
  },
  {
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce web application with product listings, shopping cart, user authentication, and payment integration built with modern JavaScript frameworks.",
    techStack: ["JavaScript", "React", "Node.js", "MongoDB"],
    color: "#a855f7",
    github: "https://github.com/namankanwar11/ecommerce-assignment",
    num: "06",
  },
];

function TiltCard({ project }: { project: ProjectProps }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glassmorphism p-7 relative overflow-hidden group cursor-pointer"
    >
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{
          background: `linear-gradient(to right, transparent, ${project.color}, transparent)`,
        }}
      />
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[100px] opacity-0 group-hover:opacity-15 transition-opacity duration-700"
        style={{ background: project.color }}
      />

      <div style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold border"
            style={{
              borderColor: `${project.color}40`,
              color: project.color,
              background: `${project.color}10`,
            }}
          >
            {project.num}
          </div>
          <div
            className="flex-1 h-[1px]"
            style={{
              background: `linear-gradient(to right, ${project.color}30, transparent)`,
            }}
          />
        </div>

        <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
        <p className="text-gray-400 leading-relaxed mb-6 text-sm line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono border"
              style={{
                borderColor: `${project.color}20`,
                color: `${project.color}cc`,
                background: `${project.color}08`,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div
        className="flex gap-4 items-center"
        style={{ transform: "translateZ(20px)" }}
      >
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors font-mono"
        >
          <Github className="w-3.5 h-3.5" /> Source
        </a>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative w-full py-32 px-6 md:px-12 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-40 -left-40 w-80 h-80 bg-neon-purple/5 rounded-full blur-[150px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-neon-pink" />
            <span className="text-neon-pink font-mono text-sm tracking-widest uppercase">
              Portfolio
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            Featured <span className="text-gradient">Projects</span>
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <TiltCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
