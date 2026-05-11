"use client";

const phrases = [
  "Invocando pixels...",
  "Renderizando universo...",
  "Calibrando cores...",
  "Materializando visão...",
  "Processando magia...",
];

import { useEffect, useState } from "react";

export function GeneratingLoader() {
  const [phrase, setPhrase] = useState(phrases[0]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setPhrase(phrases[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      {/* Animated rings */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-4 rounded-full border-2 border-t-transparent border-r-accent border-b-transparent border-l-transparent animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
        <div className="absolute inset-6 rounded-full border-2 border-t-transparent border-r-transparent border-b-accent border-l-transparent animate-spin [animation-duration:2s]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse glow" />
        </div>
      </div>

      {/* Animated text */}
      <p className="text-sm text-accent font-mono animate-pulse glow-text">{phrase}</p>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full animate-loading-bar" />
      </div>
    </div>
  );
}
