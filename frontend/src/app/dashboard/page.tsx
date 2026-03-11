"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { io, Socket } from "socket.io-client";
import {
  Activity,
  Users,
  Gamepad2,
  MessageSquare,
  Monitor,
  Smartphone,
  Tablet,
  ArrowLeft,
  Zap,
  Eye,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface SummaryData {
  totalVisitors: number;
  todayVisitors: number;
  totalEvents: number;
  gamePlays: number;
  chatMessages: number;
  sections: { name: string; count: number }[];
  eventTypes: { type: string; count: number }[];
  devices: { device: string; count: number }[];
}

interface TimelinePoint {
  hour: string;
  events: number;
  visitors: number;
}

interface LiveEvent {
  type: string;
  section: string | null;
  device: string;
  timestamp: string;
}

const EVENT_LABELS: Record<string, string> = {
  page_view: "Page View",
  section_view: "Section View",
  game_start: "Game Started",
  game_complete: "Game Completed",
  chatbot_message: "Chat Message",
  contact_submit: "Contact Form",
  project_click: "Project Click",
  resume_download: "Resume Download",
};

const EVENT_COLORS: Record<string, string> = {
  page_view: "#00d4ff",
  section_view: "#a855f7",
  game_start: "#39ff14",
  game_complete: "#39ff14",
  chatbot_message: "#ff006e",
  contact_submit: "#fbbf24",
  project_click: "#00d4ff",
  resume_download: "#a855f7",
};

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
};

function MetricCard({
  label,
  value,
  icon,
  color,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-white/8 p-6"
      style={{
        background: "rgba(10,15,30,0.7)",
        backdropFilter: "blur(20px)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        }}
      />
      <div
        className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-[60px] opacity-15"
        style={{ background: color }}
      />
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border"
          style={{
            borderColor: `${color}30`,
            background: `${color}10`,
            color,
          }}
        >
          {icon}
        </div>
        <Zap className="w-3 h-3 text-gray-600" />
      </div>
      <p className="text-3xl font-black text-white tracking-tight">
        {value.toLocaleString()}
      </p>
      <p
        className="text-xs font-mono tracking-widest uppercase mt-1"
        style={{ color: `${color}cc` }}
      >
        {label}
      </p>
    </motion.div>
  );
}

function LiveEventFeed({ events }: { events: LiveEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [events.length]);

  return (
    <div
      ref={containerRef}
      className="space-y-1.5 max-h-[350px] overflow-y-auto pr-2"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#a855f7 transparent",
      }}
    >
      {events.map((event, i) => (
        <motion.div
          key={`${event.timestamp}-${i}`}
          className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02]"
          initial={i === 0 ? { opacity: 0, x: -10 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              background: EVENT_COLORS[event.type] || "#666",
              boxShadow: `0 0 6px ${EVENT_COLORS[event.type] || "#666"}`,
            }}
          />
          <span className="text-xs font-mono text-gray-400 flex-1 truncate">
            {EVENT_LABELS[event.type] || event.type}
            {event.section && (
              <span className="text-gray-600"> → {event.section}</span>
            )}
          </span>
          <span className="text-[10px] font-mono text-gray-600 flex-shrink-0">
            {new Date(event.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="text-gray-600 flex-shrink-0">
            {DEVICE_ICONS[event.device] || DEVICE_ICONS.desktop}
          </span>
        </motion.div>
      ))}
      {events.length === 0 && (
        <div className="text-center py-12 text-gray-600 font-mono text-xs">
          Waiting for events...
        </div>
      )}
    </div>
  );
}

const chartTooltipStyle = {
  contentStyle: {
    background: "rgba(10,15,30,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#e2e8f0",
    fontSize: "12px",
    fontFamily: "monospace",
  },
  labelStyle: { color: "#a855f7" },
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, timeRes, liveRes] = await Promise.all([
          fetch(`${API_URL}/api/analytics/summary`),
          fetch(`${API_URL}/api/analytics/timeline`),
          fetch(`${API_URL}/api/analytics/live`),
        ]);
        if (sumRes.ok) setSummary(await sumRes.json());
        if (timeRes.ok) {
          const data = await timeRes.json();
          setTimeline(data.timeline || []);
        }
        if (liveRes.ok) {
          const data = await liveRes.json();
          setLiveEvents(data.events || []);
        }
      } catch (err) {
        console.warn("Analytics API unavailable:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const socket = io(API_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("newEvent", (event: LiveEvent) => {
      setLiveEvents((prev) => [event, ...prev].slice(0, 50));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100">
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-neon-blue transition-colors mb-4"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Portfolio
            </a>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              AI <span className="text-gradient">Monitoring</span>
            </h1>
            <p className="text-gray-500 font-mono text-xs mt-2 tracking-widest uppercase">
              Real-time analytics dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${connected ? "bg-neon-green animate-pulse" : "bg-red-500"}`}
              style={
                connected
                  ? { boxShadow: "0 0 8px #39ff14" }
                  : { boxShadow: "0 0 8px #ef4444" }
              }
            />
            <span className="text-xs font-mono text-gray-500">
              {connected ? "LIVE" : "OFFLINE"}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Total Visitors"
            value={summary?.totalVisitors || 0}
            icon={<Users className="w-5 h-5" />}
            color="#00d4ff"
            delay={0}
          />
          <MetricCard
            label="Today"
            value={summary?.todayVisitors || 0}
            icon={<Eye className="w-5 h-5" />}
            color="#a855f7"
            delay={0.1}
          />
          <MetricCard
            label="Game Plays"
            value={summary?.gamePlays || 0}
            icon={<Gamepad2 className="w-5 h-5" />}
            color="#39ff14"
            delay={0.2}
          />
          <MetricCard
            label="Chat Messages"
            value={summary?.chatMessages || 0}
            icon={<MessageSquare className="w-5 h-5" />}
            color="#ff006e"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="lg:col-span-2 rounded-2xl border border-white/8 p-6"
            style={{
              background: "rgba(10,15,30,0.7)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-4 h-4 text-neon-blue" />
              <h2 className="text-sm font-mono tracking-widest uppercase text-gray-400">
                Traffic — Last 24 Hours
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient
                    id="eventGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="visitorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="hour"
                  stroke="#333"
                  tick={{ fill: "#555", fontSize: 10, fontFamily: "monospace" }}
                  interval={3}
                />
                <YAxis
                  stroke="#333"
                  tick={{ fill: "#555", fontSize: 10, fontFamily: "monospace" }}
                />
                <Tooltip {...chartTooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  fill="url(#eventGradient)"
                  name="Events"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="url(#visitorGradient)"
                  name="Visitors"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-white/8 p-6"
            style={{
              background: "rgba(10,15,30,0.7)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-4 h-4 text-neon-purple" />
              <h2 className="text-sm font-mono tracking-widest uppercase text-gray-400">
                Live Events
              </h2>
            </div>
            <LiveEventFeed events={liveEvents} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="rounded-2xl border border-white/8 p-6"
            style={{
              background: "rgba(10,15,30,0.7)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-sm font-mono tracking-widest uppercase text-gray-400 mb-6">
              Section Popularity
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={summary?.sections || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="name"
                  stroke="#333"
                  tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  stroke="#333"
                  tick={{ fill: "#555", fontSize: 10, fontFamily: "monospace" }}
                />
                <Tooltip {...chartTooltipStyle} />
                <Bar
                  dataKey="count"
                  fill="#a855f7"
                  radius={[6, 6, 0, 0]}
                  name="Views"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-white/8 p-6"
            style={{
              background: "rgba(10,15,30,0.7)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-sm font-mono tracking-widest uppercase text-gray-400 mb-6">
              Event Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={(summary?.eventTypes || []).map((e) => ({
                  ...e,
                  label: EVENT_LABELS[e.type] || e.type,
                }))}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  type="number"
                  stroke="#333"
                  tick={{ fill: "#555", fontSize: 10, fontFamily: "monospace" }}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  stroke="#333"
                  tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }}
                  width={110}
                />
                <Tooltip {...chartTooltipStyle} />
                <Bar
                  dataKey="count"
                  fill="#00d4ff"
                  radius={[0, 6, 6, 0]}
                  name="Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.footer
          className="mt-12 text-center py-6 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-gray-600 font-mono text-xs tracking-widest">
            KANWAR AI MONITORING SYSTEM — REAL-TIME ANALYTICS
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
