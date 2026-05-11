"use client";

import { Share2 } from "lucide-react";

export function ShareButton({ url, title }: { url: string; title: string }) {
  return (
    <button
      onClick={() => {
        if (navigator.share) {
          navigator.share({ title: "Byte Quest AI", text: title, url });
        }
      }}
      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
      title="Compartilhar"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
}
