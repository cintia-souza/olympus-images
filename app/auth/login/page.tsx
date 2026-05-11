"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);
    setMessage(error ? error.message : "Verifique seu email para o link de acesso!");
  }

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm p-6 border border-border rounded-xl bg-surface">
        <h1 className="text-2xl font-bold text-center mb-6">
          <span className="text-accent">Byte Quest</span> AI
        </h1>

        <button
          onClick={signInWithGoogle}
          className="w-full py-2.5 mb-4 border border-border rounded-lg hover:bg-surface-hover transition font-medium"
        >
          Entrar com Google
        </button>

        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-gray-500">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={signInWithEmail} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent hover:bg-accent-hover text-black font-semibold rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Entrar com Email"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-center text-gray-400">{message}</p>}
      </div>
    </main>
  );
}
