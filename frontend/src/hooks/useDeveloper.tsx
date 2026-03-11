"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DeveloperContextType {
  isDeveloperMode: boolean;
  toggleDeveloperMode: () => void;
  latency: number;
}

const DeveloperContext = createContext<DeveloperContextType | undefined>(undefined);

export function DeveloperProvider({ children }: { children: React.ReactNode }) {
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [latency, setLatency] = useState(0);

  
  useEffect(() => {
    if (!isDeveloperMode) return;
    
    const pingInterval = setInterval(async () => {
      const start = performance.now();
      try {
        const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        await fetch(`${url}/api/analytics/summary`, { 
          method: "HEAD", 
          cache: "no-store" 
        });
        const end = performance.now();
        setLatency(Math.round(end - start));
      } catch (e) {
        setLatency(0); 
      }
    }, 3000);

    return () => clearInterval(pingInterval);
  }, [isDeveloperMode]);

  const toggleDeveloperMode = () => {
    setIsDeveloperMode((prev) => !prev);
  };

  return (
    <DeveloperContext.Provider value={{ isDeveloperMode, toggleDeveloperMode, latency }}>
      {children}
    </DeveloperContext.Provider>
  );
}

export function useDeveloper() {
  const context = useContext(DeveloperContext);
  if (context === undefined) {
    throw new Error("useDeveloper must be used within a DeveloperProvider");
  }
  return context;
}
