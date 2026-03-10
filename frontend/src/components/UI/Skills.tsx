"use client";

import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Languages",
    items: ["Python", "C", "C++", "JavaScript", "ES6", "SQL"],
    icon: "⚡",
    color: "#00d4ff",
  },
  {
    title: "ML & Data Science",
    items: [
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "Matplotlib",
      "OpenCV",
      "Streamlit",
    ],
    icon: "🧠",
    color: "#a855f7",
  },
  {
    title: "AI APIs",
    items: ["OpenAI GPT", "Google Gemini", "RAG Pipelines"],
    icon: "🤖",
    color: "#ff006e",
  },
  {
    title: "Web Frameworks",
    items: [
      "React",
      "Next.js",
      "React Native",
      "Redux",
      "Django",
      "FastAPI",
      "Flask",
      "Node.js",
      "Express",
    ],
    icon: "🌐",
    color: "#39ff14",
  },
  {
    title: "Databases & DevOps",
    items: [
      "MySQL",
      "MongoDB",
      "Git",
      "GitHub Actions",
      "Docker",
      "Vercel",
      "Netlify",
    ],
    icon: "💾",
    color: "#00d4ff",
  },
  {
    title: "Design & Analytics",
    items: [
      "Tailwind CSS",
      "Bootstrap",
      "Radix UI",
      "Figma",
      "Power BI",
      "Excel",
    ],
    icon: "📊",
    color: "#a855f7",
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative w-full py-32 px-6 md:px-12 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[150px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-neon-purple" />
            <span className="text-neon-purple font-mono text-sm tracking-widest uppercase">
              Tech Stack
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            Core <span className="text-gradient">Skills</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={idx}
              className="glassmorphism p-6 relative overflow-hidden group hover:scale-[1.03] transition-all duration-500 cursor-default"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div
                className="absolute top-0 left-0 w-full h-[2px] opacity-60"
                style={{
                  background: `linear-gradient(to right, transparent, ${cat.color}, transparent)`,
                }}
              />
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: cat.color }}
              />

              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-lg font-bold text-white">{cat.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.items.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: `${cat.color}30`,
                      color: cat.color,
                      background: `${cat.color}08`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
