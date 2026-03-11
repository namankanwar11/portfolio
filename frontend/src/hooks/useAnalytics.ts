"use client";

import { useCallback, useEffect, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem("_sid");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("_sid", id);
  }
  return id;
}

function getDevice(): "desktop" | "mobile" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function useAnalytics() {
  const sentRef = useRef<Set<string>>(new Set());

  const trackEvent = useCallback(
    (
      type: string,
      section?: string,
      metadata?: Record<string, unknown>,
    ) => {
      try {
        const key = `${type}:${section || ""}`;
        if (type === "section_view" && sentRef.current.has(key)) return;
        if (type === "section_view") sentRef.current.add(key);

        const body = {
          type,
          section: section || null,
          metadata: metadata || {},
          sessionId: getSessionId(),
          device: getDevice(),
        };

        if (typeof navigator !== "undefined" && navigator.sendBeacon) {
          navigator.sendBeacon(
            `${API_URL}/api/analytics/event`,
            new Blob([JSON.stringify(body)], { type: "application/json" }),
          );
        } else {
          fetch(`${API_URL}/api/analytics/event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        
      }
    },
    [],
  );

  useEffect(() => {
    trackEvent("page_view");
  }, [trackEvent]);

  return { trackEvent };
}
