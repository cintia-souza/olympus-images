"use client";

import { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export function ErrorToast({ message, onClose }: ErrorToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="flex items-center gap-3 px-4 py-3 bg-red-950/90 border border-red-500/50 rounded-lg shadow-lg max-w-sm">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
        <p className="text-sm text-red-200 flex-1">{message}</p>
        <button onClick={onClose} className="text-red-400 hover:text-red-200 transition">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
