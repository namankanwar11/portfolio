"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github, Play, X, Zap } from "lucide-react";
import { useRef, useState } from "react";
import SceneWrapper from "@/components/Canvas/SceneWrapper";
import QuantumTrafficDemo from "@/components/Canvas/QuantumTrafficDemo";
import MicroSwarmDemo from "@/components/Canvas/MicroSwarmDemo";
import ChatbotArchitectureDemo from "@/components/Canvas/ChatbotArchitectureDemo";
import SecurityCameraDemo from "@/components/Canvas/SecurityCameraDemo";
import RagVectorDemo from "@/components/Canvas/RagVectorDemo";
import EcommerceDemo from "@/components/Canvas/EcommerceDemo";
import DataGridScene from "@/components/Canvas/DataGridScene";
import DevOverlay from "@/components/UI/DevOverlay";
import { useInView } from "@/hooks/usePerformance";

interface ProjectProps {
  title: string;
  description: string;
  techStack: string[];
  color: string;
  github: string;
  num: string;
  devData?: Record<string, string | number>;
}

const projects: ProjectProps[] = [
  {
    title: "Quantum Traffic Optimization",
    description:
      "Hybrid quantum-classical approach to optimize traffic signal timings in real-time. It leverages the Quantum Approximate Optimization Algorithm (QAOA), simulated via IBM Qiskit, to determine optimal signal phases that minimize congestion and vehicle wait times. Integrated with SUMO (Simulation of Urban Mobility).",
    techStack: ["Python", "Qiskit", "SUMO", "QAOA"],
    color: "#00d4ff",
    github: "https://github.com/namankanwar11/Quantum-Traffic-Optimization",
    num: "01",
    devData: {
      "Arc": "Hybrid QAOA + Classical",
      "Qubits": "12 Simulated",
      "Cost Func": "MaxCut",
      "O(n) Space": "O(N²)"
    }
  },
  {
    title: "MicroSwarm AI Agent System",
    description:
      "Heterogeneous AI agent swarm that autonomously plans, generates, and validates software using evolutionary genetic algorithms, quantized LLMs (Phi-3, Qwen 2.5), vulnerability scanning, and real-time telemetry dashboard.",
    techStack: ["C++17", "Python", "LLMs", "Telemetry"],
    color: "#a855f7",
    github: "#",
    num: "02",
    devData: {
      "Arch": "Actor Model Swarm",
      "LLMs": "Quantized GGUF 4-bit",
      "Telemetry": "WebSockets 60Hz",
      "Memory": "ChromaDB VectorStore"
    }
  },
  {
    title: "Enterprise AI Chatbot",
    description:
      "A robust, full-stack Enterprise AI Chatbot capable of Sentiment Analysis (RoBERTa), Intent Recognition, RAG (FAISS), Multi-Language Support, and Voice Interaction (STT/TTS). Built with a modular architecture for scalability and real-time analytics.",
    techStack: ["Streamlit", "Transformers", "FAISS", "SQLite3"],
    color: "#ff006e",
    github: "https://github.com/namankanwar11/enterprise-ai-chatbot",
    num: "03",
    devData: {
      "NLP": "Transformer RoBERTa",
      "Vector": "FAISS Indexing",
      "Storage": "SQLite3",
      "UI": "Streamlit App"
    }
  },
  {
    title: "Security Camera System",
    description:
      "AI-powered security camera surveillance system using computer vision (YOLOv8) for real-time object detection, DeepSORT for motion tracking, and automated alert generation.",
    techStack: ["Python", "OpenCV", "YOLOv8", "DeepSORT"],
    color: "#39ff14",
    github: "https://github.com/namankanwar11/security-camera-project-python",
    num: "04",
    devData: {
      "Model": "YOLOv8 Nano",
      "FPS": "30 FPS Real-time",
      "Tracker": "DeepSORT",
      "Stream": "RTSP Protocol"
    }
  },
  {
    title: "Kerala Ayurveda RAG",
    description:
      "A prototype Retrieval-Augmented Generation (RAG) system for safety information retrieval. It features safety-first search to prevent hallucinations and automatic compliance disclaimer appending for medical guidelines.",
    techStack: ["Streamlit", "RAG", "Python", "Vector DB"],
    color: "#00d4ff",
    github: "https://github.com/namankanwar11/kerala-ayurveda-assignment",
    num: "05",
    devData: {
      "Safety": "Precautions-First",
      "Compliance": "Auto-Disclaimer",
      "UI": "Streamlit App",
      "Retrieval": "Hybrid-Style"
    }
  },
  {
    title: "E-Commerce Platform",
    description:
      "Product showcase and e-commerce platform built with React and Vite. Features a minimal, high-performance setup with Hot Module Replacement (HMR) and ESLint integration.",
    techStack: ["React", "Vite", "JavaScript", "Tailwind"],
    color: "#a855f7",
    github: "https://github.com/namankanwar11/ecommerce-assignment",
    num: "06",
    devData: {
      "Template": "Vite + React",
      "HMR": "Active",
      "Linter": "ESLint + Rules",
      "Styling": "Tailwind CSS"
    }
  },
];

function TiltCard({ project, onOpenDemo }: { project: ProjectProps, onOpenDemo: (title: string) => void }) {
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
      {project.devData && (
        <DevOverlay data={project.devData} position="top-right" className="scale-[0.8] origin-top-right group-hover:opacity-20 transition-opacity" />
      )}

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
        className="flex gap-4 items-center mt-6"
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
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDemo(project.title);
          }}
          className="ml-auto flex items-center gap-2 text-xs font-bold text-black bg-[#00d4ff] hover:bg-white transition-colors px-3 py-1.5 rounded-sm uppercase tracking-wide cursor-pointer"
        >
          <Play className="w-3.5 h-3.5" /> Live Demo
        </button>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useInView(sectionRef);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full py-32 px-6 md:px-12 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-40">
        <SceneWrapper cameraPosition={[0, 1, 6]} active={isVisible}>
          <DataGridScene />
        </SceneWrapper>
      </div>

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-40 -left-40 w-80 h-80 bg-neon-purple/5 rounded-full blur-[150px] pointer-events-none" />

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
         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <TiltCard project={project} onOpenDemo={setActiveDemo} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeDemo === "Quantum Traffic Optimization" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.95, y: 20 }}
               className="relative w-full max-w-6xl h-[80vh] bg-[#0a0f1e] border border-[#00d4ff]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,212,255,0.1)] flex flex-col"
            >
               <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-[#00d4ff]/20 flex items-center justify-center">
                     <Zap className="w-4 h-4 text-[#00d4ff]" />
                   </div>
                   <div>
                     <h3 className="text-white font-bold">Quantum Traffic Simulation</h3>
                     <p className="text-xs text-gray-500 font-mono">React Three Fiber • QAOA Visualization</p>
                   </div>
                 </div>
                 <button onClick={() => setActiveDemo(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer text-white">
                   <X size={18} />
                 </button>
               </div>

               <div className="flex-1 relative">
                 <SceneWrapper cameraPosition={[0, 15, 20]} active={true}>
                   <QuantumTrafficDemo isOptimized={isOptimized} />
                 </SceneWrapper>
               </div>

               <div className="p-6 bg-black/60 border-t border-white/10 flex flex-col md:flex-row items-center gap-6 justify-between">
                 <div>
                   <h4 className="text-white font-medium mb-1">Algorithm State: {isOptimized ? <span className="text-[#00d4ff]">Optimized (MaxCut)</span> : <span className="text-[#ff006e]">Standard (Linear)</span>}</h4>
                   <p className="text-sm text-gray-400 max-w-2xl">Toggle the QAOA algorithm to see how the quantum circuit minimizes intersection wait times by calculating optimal lane flows instantly instead of cyclically.</p>
                 </div>
                 <button 
                   onClick={() => setIsOptimized(!isOptimized)}
                   className={`px-8 py-3 rounded uppercase font-bold tracking-wider transition-all min-w-[200px] cursor-pointer ${isOptimized ? 'bg-[#00d4ff] text-black shadow-[0_0_20px_rgba(0,212,255,0.4)]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                 >
                   {isOptimized ? "Disable QAOA" : "Execute QAOA"}
                 </button>
               </div>
            </motion.div>
          </motion.div>
        )}

        {activeDemo === "MicroSwarm AI Agent System" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.95, y: 20 }}
               className="relative w-full max-w-6xl h-[80vh] bg-[#0a0f1e] border border-[#a855f7]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)] flex flex-col"
            >
               <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-[#a855f7]/20 flex items-center justify-center">
                     <Zap className="w-4 h-4 text-[#a855f7]" />
                   </div>
                   <div>
                     <h3 className="text-white font-bold">MicroSwarm Telemetry</h3>
                     <p className="text-xs text-gray-500 font-mono">React Three Fiber • WebGL Network Graph</p>
                   </div>
                 </div>
                 <button onClick={() => setActiveDemo(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer text-white">
                   <X size={18} />
                 </button>
               </div>

               <div className="flex-1 relative">
                 <SceneWrapper cameraPosition={[0, 8, 12]} active={true}>
                   <MicroSwarmDemo isAttacked={isOptimized} />
                 </SceneWrapper>
               </div>

               <div className="p-6 bg-black/60 border-t border-white/10 flex flex-col md:flex-row items-center gap-6 justify-between">
                 <div>
                   <h4 className="text-white font-medium mb-1">Swarm State: {isOptimized ? <span className="text-[#ff006e]">Under Attack (Isolating)</span> : <span className="text-[#39ff14]">Nominal Telemetry</span>}</h4>
                   <p className="text-sm text-gray-400 max-w-2xl">Visualize the heterogeneous Swarm architecture. The central Commander node orchestrates Validators and Workers. Toggle a simulated vulnerability to watch the swarm isolate the threat.</p>
                 </div>
                 <button 
                   onClick={() => setIsOptimized(!isOptimized)}
                   className={`px-8 py-3 rounded uppercase font-bold tracking-wider transition-all min-w-[200px] cursor-pointer ${isOptimized ? 'bg-[#ff006e] text-white shadow-[0_0_20px_rgba(255,0,110,0.4)]' : 'bg-[#a855f7] text-white hover:bg-purple-400 border border-transparent'}`}
                 >
                   {isOptimized ? "Clear Threat" : "Inject Vulnerability"}
                 </button>
               </div>
            </motion.div>
          </motion.div>
        )}

        {activeDemo === "Enterprise AI Chatbot" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.95, y: 20 }}
               className="relative w-full max-w-6xl h-[80vh] bg-[#0a0f1e] border border-[#ff006e]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,0,110,0.1)] flex flex-col"
            >
               <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-[#ff006e]/20 flex items-center justify-center">
                     <Zap className="w-4 h-4 text-[#ff006e]" />
                   </div>
                   <div>
                     <h3 className="text-white font-bold">RAG Architecture Flow</h3>
                     <p className="text-xs text-gray-500 font-mono">React Three Fiber • Backend Simulation</p>
                   </div>
                 </div>
                 <button onClick={() => setActiveDemo(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer text-white">
                   <X size={18} />
                 </button>
               </div>

               <div className="flex-1 relative">
                 <SceneWrapper cameraPosition={[0, 8, 12]} active={true}>
                   <ChatbotArchitectureDemo isSimulating={isOptimized} />
                 </SceneWrapper>
               </div>

               <div className="p-6 bg-black/60 border-t border-white/10 flex flex-col md:flex-row items-center gap-6 justify-between">
                 <div>
                   <h4 className="text-white font-medium mb-1">Status: {isOptimized ? <span className="text-[#00d4ff]">Processing Queries</span> : <span className="text-gray-400">Idle</span>}</h4>
                   <p className="text-sm text-gray-400 max-w-2xl">Watch the lifecycle of a user query as it hits the FastAPI Gateway, retrieves context from Pinecone, passes through NLP intent classification, and streams back from the LLM.</p>
                 </div>
                 <button 
                   onClick={() => setIsOptimized(!isOptimized)}
                   className={`px-8 py-3 rounded uppercase font-bold tracking-wider transition-all min-w-[200px] cursor-pointer ${isOptimized ? 'bg-[#ff006e] text-white shadow-[0_0_20px_rgba(255,0,110,0.4)]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                 >
                   {isOptimized ? "Stop Traffic" : "Simulate Queries"}
                 </button>
               </div>
            </motion.div>
          </motion.div>
        )}

        {activeDemo === "Security Camera System" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.95, y: 20 }}
               className="relative w-full max-w-6xl h-[80vh] bg-[#0a0f1e] border border-[#39ff14]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(57,255,20,0.1)] flex flex-col"
            >
               <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-[#39ff14]/20 flex items-center justify-center">
                     <Zap className="w-4 h-4 text-[#39ff14]" />
                   </div>
                   <div>
                     <h3 className="text-white font-bold">YOLOv8 Edge Tracking</h3>
                     <p className="text-xs text-gray-500 font-mono">React Three Fiber • CV Simulation</p>
                   </div>
                 </div>
                 <button onClick={() => setActiveDemo(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer text-white">
                   <X size={18} />
                 </button>
               </div>

               <div className="flex-1 relative">
                 <SceneWrapper cameraPosition={[0, 5, 10]} active={true}>
                   <SecurityCameraDemo isTracking={isOptimized} />
                 </SceneWrapper>
               </div>

               <div className="p-6 bg-black/60 border-t border-white/10 flex flex-col md:flex-row items-center gap-6 justify-between">
                 <div>
                   <h4 className="text-white font-medium mb-1">State: {isOptimized ? <span className="text-[#39ff14]">Object Detection Active (confidence: 85%+)</span> : <span className="text-white">Raw Camera Feed</span>}</h4>
                   <p className="text-sm text-gray-400 max-w-2xl">Toggle the YOLOv8 model to overlay bounding boxes onto the 3D scene. This simulates how the deep learning pipeline tracks vehicles and people in real-time across the camera feed.</p>
                 </div>
                 <button 
                   onClick={() => setIsOptimized(!isOptimized)}
                   className={`px-8 py-3 rounded uppercase font-bold tracking-wider transition-all min-w-[200px] cursor-pointer ${isOptimized ? 'bg-[#39ff14] text-black shadow-[0_0_20px_rgba(57,255,20,0.4)]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                 >
                   {isOptimized ? "Disable YOLO" : "Activate Inference"}
                 </button>
               </div>
            </motion.div>
          </motion.div>
        )}
        {activeDemo === "Kerala Ayurveda RAG" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.95, y: 20 }}
               className="relative w-full max-w-6xl h-[80vh] bg-[#0a0f1e] border border-[#00d4ff]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,212,255,0.1)] flex flex-col"
            >
               <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-[#00d4ff]/20 flex items-center justify-center">
                     <Zap className="w-4 h-4 text-[#00d4ff]" />
                   </div>
                   <div>
                     <h3 className="text-white font-bold">Semantic Vector Space</h3>
                     <p className="text-xs text-gray-500 font-mono">React Three Fiber • RAG Visualization</p>
                   </div>
                 </div>
                 <button onClick={() => setActiveDemo(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer text-white">
                   <X size={18} />
                 </button>
               </div>

               <div className="flex-1 relative">
                 <SceneWrapper cameraPosition={[0, 8, 12]} active={true}>
                   <RagVectorDemo isSearchActive={isOptimized} />
                 </SceneWrapper>
               </div>

               <div className="p-6 bg-black/60 border-t border-white/10 flex flex-col md:flex-row items-center gap-6 justify-between">
                 <div>
                   <h4 className="text-white font-medium mb-1">Retrieval State: {isOptimized ? <span className="text-[#39ff14]">Query Active</span> : <span className="text-white">Idle Knowledge Graph</span>}</h4>
                   <p className="text-sm text-gray-400 max-w-2xl">Explore the embeddings of traditional Ayurvedic terms in high-dimensional vector space. Toggle "Execute Search" to visualize how the RAG pipeline calculates cosine similarity to retrieve relevant medical context.</p>
                 </div>
                 <button 
                   onClick={() => setIsOptimized(!isOptimized)}
                   className={`px-8 py-3 rounded uppercase font-bold tracking-wider transition-all min-w-[200px] cursor-pointer ${isOptimized ? 'bg-[#00d4ff] text-black shadow-[0_0_20px_rgba(0,212,255,0.4)]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                 >
                   {isOptimized ? "Stop Search" : "Execute Search"}
                 </button>
               </div>
            </motion.div>
          </motion.div>
        )}

        {activeDemo === "E-Commerce Platform" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.95, y: 20 }}
               className="relative w-full max-w-6xl h-[80vh] bg-[#0a0f1e] border border-[#a855f7]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)] flex flex-col"
            >
               <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-[#a855f7]/20 flex items-center justify-center">
                     <Zap className="w-4 h-4 text-[#a855f7]" />
                   </div>
                   <div>
                     <h3 className="text-white font-bold">Microservices Auto-Scaling</h3>
                     <p className="text-xs text-gray-500 font-mono">React Three Fiber • System Architecture</p>
                   </div>
                 </div>
                 <button onClick={() => setActiveDemo(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer text-white">
                   <X size={18} />
                 </button>
               </div>

               <div className="flex-1 relative">
                 <SceneWrapper cameraPosition={[0, 8, 15]} active={true}>
                   <EcommerceDemo isTrafficSpike={isOptimized} />
                 </SceneWrapper>
               </div>

               <div className="p-6 bg-black/60 border-t border-white/10 flex flex-col md:flex-row items-center gap-6 justify-between">
                 <div>
                   <h4 className="text-white font-medium mb-1">Deployment Status: {isOptimized ? <span className="text-[#ff006e]">Traffic Spike (Scaling Out)</span> : <span className="text-[#00d4ff]">Stable Load Balancing</span>}</h4>
                   <p className="text-sm text-gray-400 max-w-2xl">Visualize the containerized Docker architecture. Trigger a traffic spike to watch the load balancer spin up additional backend replicas to maintain 99.9% uptime during shopping surges.</p>
                 </div>
                 <button 
                   onClick={() => setIsOptimized(!isOptimized)}
                   className={`px-8 py-3 rounded uppercase font-bold tracking-wider transition-all min-w-[200px] cursor-pointer ${isOptimized ? 'bg-[#ff006e] text-white shadow-[0_0_20px_rgba(255,0,110,0.4)]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                 >
                   {isOptimized ? "Normalize Traffic" : "Trigger Spike"}
                 </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
