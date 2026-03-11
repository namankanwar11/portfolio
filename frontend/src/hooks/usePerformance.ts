"use client";

import { useEffect, useState, useRef, RefObject } from "react";


export function useInView(
  ref: RefObject<HTMLElement | null>,
  margin: string = "200px",
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: margin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin]);

  return inView;
}


export function useTabVisible(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handler = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return visible;
}


export function useAdaptiveQuality(): { quality: "high" | "medium" | "low" } {
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");
  const framesRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let raf: number;

    function measure() {
      framesRef.current++;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 2000) {
        const fps = (framesRef.current / elapsed) * 1000;
        framesRef.current = 0;
        lastTimeRef.current = now;

        if (fps < 25) setQuality("low");
        else if (fps < 40) setQuality("medium");
        else setQuality("high");
      }
      raf = requestAnimationFrame(measure);
    }

    raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { quality };
}
