"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export default function SystemStatusPulse() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const resp = await fetch("/api/health");
        setIsOnline(true);
      } catch (e) {
        setIsOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-2xl shadow-sm">
      <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
      <span className="text-[0.65rem] font-black text-[var(--on-surface-variant)] uppercase tracking-widest">
        System {isOnline ? 'Active' : 'Offline'}
      </span>
    </div>
  );
}
