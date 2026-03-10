"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

interface TerminalLine {
  type: "system" | "input" | "output" | "error" | "success";
  text: string;
}

const socialLinks = [
  {
    icon: Mail,
    label: "namankanwar.nsut@gmail.com",
    href: "mailto:namankanwar.nsut@gmail.com",
    color: "#ff006e",
  },
  {
    icon: Linkedin,
    label: "linkedin.com/in/naman-kanwar",
    href: "https://www.linkedin.com/in/naman-kanwar-355061232/",
    color: "#00d4ff",
  },
  {
    icon: Github,
    label: "github.com/namankanwar11",
    href: "https://github.com/namankanwar11",
    color: "#a855f7",
  },
];

export default function Contact() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "system", text: "KANWAR AI Communication Interface v2.0" },
    { type: "system", text: "─────────────────────────────────────" },
    { type: "system", text: "Available commands:" },
    { type: "output", text: "  connect    — Send a connection request" },
    { type: "output", text: "  message    — Send a message" },
    { type: "output", text: "  socials    — View social links" },
    { type: "output", text: "  clear      — Clear terminal" },
    { type: "output", text: "  help       — Show this menu" },
    { type: "system", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [formStep, setFormStep] = useState<
    "idle" | "name" | "email" | "msg" | "sending"
  >("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [lines]);

  const addLine = (type: TerminalLine["type"], text: string) => {
    setLines((prev) => [...prev, { type, text }]);
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    addLine("input", `> ${cmd}`);

    if (formStep === "name") {
      setFormData((p) => ({ ...p, name: cmd.trim() }));
      addLine("success", `Name: ${cmd.trim()}`);
      addLine("system", "Enter your email:");
      setFormStep("email");
      setInput("");
      return;
    }
    if (formStep === "email") {
      if (!cmd.includes("@")) {
        addLine("error", "Invalid email. Try again:");
        setInput("");
        return;
      }
      setFormData((p) => ({ ...p, email: cmd.trim() }));
      addLine("success", `Email: ${cmd.trim()}`);
      addLine("system", "Enter your message:");
      setFormStep("msg");
      setInput("");
      return;
    }
    if (formStep === "msg") {
      setFormData((p) => ({ ...p, message: cmd.trim() }));
      addLine("success", `Message: ${cmd.trim()}`);
      addLine("system", "Transmitting to Naman...");
      setFormStep("sending");
      setInput("");

      fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, message: cmd.trim() }),
      })
        .then((res) => res.json())
        .then(() => {
          addLine("success", "✓ Message transmitted successfully!");
          addLine("system", "Naman will respond shortly.");
          setFormStep("idle");
        })
        .catch(() => {
          addLine("error", "Transmission failed. Try again later.");
          setFormStep("idle");
        });
      return;
    }

    switch (trimmed) {
      case "connect":
      case "message":
      case "send":
        addLine("system", "Initializing connection protocol...");
        addLine("system", "Enter your name:");
        setFormStep("name");
        break;
      case "socials":
        addLine("system", "Social channels:");
        addLine("output", "  📧 namankanwar.nsut@gmail.com");
        addLine("output", "  🔗 linkedin.com/in/naman-kanwar-355061232");
        addLine("output", "  💻 github.com/namankanwar11");
        break;
      case "clear":
        setLines([
          {
            type: "system",
            text: "Terminal cleared. Type 'help' for commands.",
          },
        ]);
        break;
      case "help":
        addLine("system", "Available commands:");
        addLine("output", "  connect — Send a connection request");
        addLine("output", "  message — Send a message");
        addLine("output", "  socials — View social links");
        addLine("output", "  clear   — Clear terminal");
        break;
      default:
        addLine("error", `Command not found: ${trimmed}`);
        addLine("output", "Type 'help' to see available commands.");
    }
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-32 px-6 md:px-12 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 -left-40 w-80 h-80 bg-neon-pink/5 rounded-full blur-[150px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-neon-pink" />
            <span className="text-neon-pink font-mono text-sm tracking-widest uppercase">
              Communication Interface
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            AI <span className="text-gradient">Console</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-t-xl border border-white/10 border-b-0">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-gray-500 text-[10px] font-mono uppercase tracking-widest">
                kanwar-ai — contact
              </span>
            </div>

            {}
            <div
              ref={terminalRef}
              onClick={() => inputRef.current?.focus()}
              className="bg-[#0a0f1e]/80 backdrop-blur-sm border border-white/10 rounded-b-xl p-5 h-[380px] overflow-auto cursor-text"
            >
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={`font-mono text-sm leading-relaxed ${
                    line.type === "system"
                      ? "text-neon-blue"
                      : line.type === "input"
                        ? "text-white"
                        : line.type === "output"
                          ? "text-gray-400"
                          : line.type === "success"
                            ? "text-neon-green"
                            : "text-red-400"
                  }`}
                >
                  {line.text || "\u00A0"}
                </div>
              ))}

              {}
              <form
                onSubmit={handleSubmit}
                className="flex items-center font-mono text-sm mt-1"
              >
                <span className="text-neon-green mr-2">
                  {formStep === "idle" ? ">" : "»"}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-white focus:outline-none caret-neon-blue"
                  placeholder={formStep === "idle" ? "Type a command..." : ""}
                  autoComplete="off"
                />
              </form>
            </div>
          </motion.div>

          {}
          <motion.div
            className="flex flex-col gap-4 justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-gray-400 hover:text-white transition-all group glassmorphism p-4"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center border transition-colors"
                  style={{
                    borderColor: `${link.color}20`,
                    background: `${link.color}05`,
                  }}
                >
                  <link.icon
                    className="w-4 h-4"
                    style={{ color: link.color }}
                  />
                </div>
                <span className="text-xs font-mono">{link.label}</span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
