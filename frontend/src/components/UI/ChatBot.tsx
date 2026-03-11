"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import DevOverlay from "@/components/UI/DevOverlay";

function sanitizeChatInput(str: string): string {
  return str.replace(/<[^>]*>/g, "").slice(0, 500).trim();
}

interface Message {
  role: "user" | "ai";
  content: string;
}

const knowledgeBase: Record<string, string> = {
  hello:
    "Hey there! 👋 I'm KANWAR AI, Naman's intelligent assistant. Ask me about his projects, skills, experience, or anything else!",
  hi: "Hello! Welcome to Naman Kanwar's portfolio. How can I help? Try asking about projects, skills, or experience.",
  hey: "Hey! 👋 I'm here to help you explore Naman's work. What would you like to know?",

  who: "Naman Kanwar is a B.Tech IT student at NSUT Dwarka (Class of 2026), specializing in AI systems, data science, cybersecurity, and backend engineering.",
  about:
    "Naman is an AI developer and IT student at NSUT Dwarka. He builds intelligent systems, optimization algorithms, and autonomous agent swarms. He's interned at C-DAC NOIDA and Loan Hundi.",
  education:
    "Naman is pursuing B.Tech in Information Technology at Netaji Subhas University of Technology (NSUT), Dwarka, graduating in 2026.",

  quantum:
    "The Quantum Traffic Optimization project uses IBM Qiskit's QAOA algorithm integrated with SUMO traffic simulator to optimize traffic signal timings in real-time. It's a hybrid quantum-classical approach.",
  microswarm:
    "MicroSwarm is a heterogeneous AI agent swarm that autonomously plans, generates, and validates software using evolutionary genetic algorithms, quantized LLMs (Phi-3, Qwen 2.5), and real-time telemetry.",
  chatbot:
    "The Enterprise AI Chatbot is a production-grade conversational system built for enterprise customer interaction with NLP, context-aware dialogue, and FastAPI backend.",
  "security camera":
    "The Security Camera System uses computer vision with OpenCV for real-time object detection, motion tracking, and automated alert generation.",
  project:
    "Naman's key projects include: 1) Quantum Traffic Optimization (Qiskit + SUMO) 2) MicroSwarm AI Agent System (C++17 + LLMs) 3) Enterprise AI Chatbot 4) Security Camera System 5) Kerala Ayurveda RAG 6) E-Commerce Platform. Which one would you like to know more about?",

  skill:
    "Naman's tech stack: Python, C/C++, JavaScript | ML: TensorFlow, PyTorch, Scikit-learn, OpenCV | Web: React, Next.js, Django, FastAPI, Flask, Node.js | Databases: MongoDB, MySQL | DevOps: Docker, Git, GitHub Actions.",
  python:
    "Naman is highly proficient in Python, using it for AI/ML development, data science, backend APIs (Django, FastAPI, Flask), and automation.",
  language:
    "Naman works with Python, C, C++, JavaScript, and SQL. He's strongest in Python for AI/ML and C++ for performance-critical systems.",

  experience:
    "Naman has interned at: 1) C-DAC NOIDA — Ethical Hacking & Penetration Testing under Cyber Gyan Project (Jul-Aug 2025) 2) Loan Hundi — AI chatbot development for customer support automation.",
  cdac: "At C-DAC NOIDA, Naman completed training in Ethical Hacking and Penetration Testing under the Cyber Gyan Project, Ministry of Electronics & IT (July-August 2025).",
  intern:
    "Naman has two internships: Cybersecurity Intern at C-DAC NOIDA (Ethical Hacking) and Software Developer at Loan Hundi (AI Chatbots).",
  "loan hundi":
    "At Loan Hundi, Naman developed AI chatbots for customer onboarding and automated tier-1 support, improving conversion rates and reducing response latency.",

  contact:
    "You can reach Naman at: Email: namankanwar11@gmail.com | LinkedIn: linkedin.com/in/naman-kanwar-355061232 | GitHub: github.com/namankanwar11. Or scroll down to the Contact section!",
  email: "Naman's email is namankanwar11@gmail.com",
  linkedin:
    "Naman's LinkedIn: https://www.linkedin.com/in/naman-kanwar-355061232/",
  github:
    "Naman's GitHub: https://github.com/namankanwar11 — Check out his pinned repos!",
  hire: "Interested in hiring Naman? He's open to opportunities in AI/ML, backend engineering, and cybersecurity. Reach out at namankanwar11@gmail.com or use the contact form below!",

  game: "Try the 'Defend the AI Core' mini-game! It's a cyberpunk defense simulation where you protect an AI core from corrupted data packets. Scroll to the Game section or click 'Game' in the navbar.",

  navigate:
    "I can help you explore! Available sections: About, Skills, Projects, AI Lab, Timeline, Game, Contact. Which one interests you?",
  help: "I can tell you about: 📋 Projects | 🧠 Skills | 💼 Experience | 📧 Contact | 🎮 Game | 🏫 Education. Just ask!",
};

function findResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  for (const [key, val] of Object.entries(knowledgeBase)) {
    if (lower.includes(key)) return val;
  }

  if (lower.includes("work") || lower.includes("job"))
    return knowledgeBase["experience"];
  if (lower.includes("tech") || lower.includes("stack"))
    return knowledgeBase["skill"];
  if (
    lower.includes("university") ||
    lower.includes("college") ||
    lower.includes("study")
  )
    return knowledgeBase["education"];
  if (lower.includes("resume") || lower.includes("cv"))
    return "You can download Naman's resume from the hero section! Click the 'Download Resume' button at the top.";
  if (lower.includes("what") && lower.includes("do"))
    return knowledgeBase["about"];
  if (lower.includes("thank"))
    return "You're welcome! Feel free to explore the portfolio. The mini-game is especially fun! 🎮";

  return "I'm not sure about that, but I can tell you about Naman's projects, skills, experience, or contact info. Try asking about one of those! 💡";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Welcome to the Kanwar AI System. I'm KANWAR AI — ask me about Naman's projects, skills, or experience. 🤖",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: sanitizeChatInput(input) };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(
      () => {
        const response = findResponse(sanitizeChatInput(input));
        setMessages((prev) => [...prev, { role: "ai", content: response }]);
      },
      400 + Math.random() * 400,
    );
  };

  return (
    <>
      {}
      <motion.button
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: "linear-gradient(135deg, #00d4ff, #a855f7)",
          boxShadow:
            "0 0 20px rgba(168,85,247,0.4), 0 0 60px rgba(0,212,255,0.2)",
        }}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-[60] w-[380px] max-h-[500px] flex flex-col rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              background: "rgba(10,15,30,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(168,85,247,0.1)",
            }}
          >
            <DevOverlay 
              data={{
                "Model": "Heuristic NLP Pattern Matcher",
                "Sanitization": "Regex HTML strip (0-500 chars)",
                "Analytics": "socket.io (event: chatbot_message)",
                "Latency": "Simulated 400ms-800ms",
                "Knowledge Base": "Local O(1) Hash Map"
              }} 
              position="top-left" 
              className="-ml-[260px] top-4 pointer-events-none hidden md:block" 
            />
            {}
            <div className="px-5 py-3.5 flex items-center gap-3 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-neon-blue to-neon-purple">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">KANWAR AI</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                  <span className="text-[10px] text-gray-500 font-mono">
                    Online
                  </span>
                </div>
              </div>
            </div>

            {}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px] min-h-[200px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-white border border-neon-purple/20"
                        : "bg-white/5 text-gray-300 border border-white/5"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-3 border-t border-white/5 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/40 transition-colors"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
