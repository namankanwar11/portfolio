"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import SceneWrapper from "@/components/Canvas/SceneWrapper";
import TerminalScene from "@/components/Canvas/TerminalScene";
import DevOverlay from "@/components/UI/DevOverlay";
import { useInView } from "@/hooks/usePerformance";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const BLOCKED_PATTERNS = [
  /<script[\s>]/i,
  /<\/script>/i,
  /DROP\s+TABLE/i,
  /SELECT\s+\*/i,
  /INSERT\s+INTO/i,
  /UNION\s+SELECT/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /\$where/i,
  /\$gt/i,
  /\$ne/i,
];

function sanitizeInput(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

function containsSuspiciousPattern(str: string): boolean {
  return BLOCKED_PATTERNS.some((p) => p.test(str));
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface TerminalLine {
  type: "system" | "input" | "output" | "error" | "success";
  text: string;
}

const socialLinks = [
  {
    icon: Mail,
    label: "namankanwar11@gmail.com",
    href: "mailto:namankanwar11@gmail.com",
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
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useInView(sectionRef);

  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "system", text: "KANWAR-AI COM-LINK ESTABLISHED." },
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
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [lines]);

  const addLine = (type: TerminalLine["type"], text: string) => {
    setLines((prev) => [...prev, { type, text }]);
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    addLine("input", `> ${cmd}`);

    if (formStep === "sending") return;

    if (formStep === "name") {
      if (containsSuspiciousPattern(trimmed)) {
        addLine("error", "SECURITY ALERT: Suspicious input detected.");
        setFormStep("idle");
        return;
      }
      const sanitized = sanitizeInput(trimmed);
      if (sanitized.length < 2) {
        addLine("error", "Name too short.");
        return;
      }
      setFormData((prev) => ({ ...prev, name: sanitized }));
      addLine("system", `Name accepted: ${sanitized}`);
      addLine("system", "Enter your email address:");
      setFormStep("email");
      setInput("");
      return;
    }

    if (formStep === "email") {
      const sanitized = sanitizeInput(trimmed);
      if (!EMAIL_REGEX.test(sanitized)) {
        addLine("error", "Invalid email format. Try again:");
        return;
      }
      setFormData((prev) => ({ ...prev, email: sanitized }));
      addLine("system", `Email accepted: ${sanitized}`);
      addLine("system", "Enter your message:");
      setFormStep("msg");
      setInput("");
      return;
    }

    if (formStep === "msg") {
      if (containsSuspiciousPattern(trimmed)) {
        addLine("error", "SECURITY ALERT: Suspicious content detected.");
        setFormStep("idle");
        return;
      }
      const sanitized = sanitizeInput(trimmed);
      if (sanitized.length < 5) {
        addLine("error", "Message too short.");
        return;
      }

      const payload = { ...formData, message: sanitized };
      setFormStep("sending");
      addLine("system", "Verifying human identity...");

      try {
        let token = "dummy-token";
        if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY !== "dummy-key-for-dev") {
           token = await recaptchaRef.current?.executeAsync() || "";
        }
        if (!token) throw new Error("Verification failed");

        addLine("system", "Transmitting data to kanwar-ai secure servers...");

        const res = await fetch(`${API_URL}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, recaptchaToken: token }),
        });

        if (res.ok) {
          addLine("success", "✓ Message transmitted successfully!");
          addLine("system", "Naman will respond shortly.");
        } else {
          addLine("error", "Transmission failed. Server rejected the payload.");
        }
      } catch (err) {
        addLine("error", "Transmission failed. Verification unsuccessful.");
      } finally {
        recaptchaRef.current?.reset();
        setFormStep("idle");
      }
      return;
    }

    switch (trimmed.toLowerCase()) {
      case "connect":
      case "message":
      case "send":
        addLine("system", "Initializing connection protocol...");
        addLine("system", "Enter your name:");
        setFormStep("name");
        break;
      case "socials":
        addLine("system", "Social channels:");
        addLine("output", "  📧 namankanwar11@gmail.com");
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
      ref={sectionRef}
      id="contact"
      className="relative w-full py-32 px-6 md:px-12 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-40">
        <SceneWrapper cameraPosition={[0, 0, 8]} active={isVisible}>
          <TerminalScene />
        </SceneWrapper>
      </div>

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-80 h-80 bg-neon-pink/5 rounded-full blur-[150px] pointer-events-none" />

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
            className="md:col-span-2 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <DevOverlay 
              data={{
                "Route": "POST /api/contact",
                "WAF Rules": "XSS & SQLi Blacklist",
                "Rate Limiting": "10 req / 15m window",
                "Bot Defense": "Invisible reCAPTCHA v3",
                "Transport": "JSON over HTTPS"
              }} 
              position="top-right" 
              className="-mt-5 -mr-5" 
            />
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
                  disabled={formStep === "sending"}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neon-pink/10 text-neon-pink hover:bg-neon-pink/20 rounded-lg text-xs font-mono border border-neon-pink/50 transition-colors"
                  disabled={formStep === "sending"}
                >
                  {formStep === "sending" ? "TRANSMITTING..." : "EXECUTE"}
                </button>
              </form>
            </div>
          </motion.div>

          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "dummy-key-for-dev"}
          />

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
