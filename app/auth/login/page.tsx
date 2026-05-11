"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

type Mode = "login" | "signup" | "forgot";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const supabase = createClient();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/dashboard");
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else setMessage("Conta criada! Verifique seu email para confirmar.");
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/callback`,
      });
      if (error) setError(error.message);
      else setMessage("Email de recuperação enviado! Verifique sua caixa de entrada.");
    }

    setLoading(false);
  }

  const titles = { login: "Entrar", signup: "Criar Conta", forgot: "Recuperar Senha" };
  const buttons = { login: "Entrar", signup: "Criar Conta", forgot: "Enviar Email" };

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm p-6 border border-border rounded-xl bg-surface">
        <h1 className="text-2xl font-bold text-center mb-1">
          <span className="text-accent">Byte Quest</span> AI
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">{titles[mode]}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative flex items-center">
            <Mail className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field !pl-10"
            />
          </div>

          {/* Password */}
          {mode !== "forgot" && (
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-field !pl-10 !pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent hover:bg-accent-hover text-black font-semibold rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Aguarde..." : buttons[mode]}
          </button>
        </form>

        {/* Messages */}
        {error && <p className="mt-3 text-sm text-red-400 text-center">{error}</p>}
        {message && <p className="mt-3 text-sm text-green-400 text-center">{message}</p>}

        {/* Links */}
        <div className="mt-4 text-center text-sm text-gray-500 space-y-1">
          {mode === "login" && (
            <>
              <p>
                Não tem conta?{" "}
                <button onClick={() => setMode("signup")} className="text-accent hover:underline">
                  Criar conta
                </button>
              </p>
              <p>
                <button onClick={() => setMode("forgot")} className="text-accent hover:underline">
                  Esqueci minha senha
                </button>
              </p>
            </>
          )}
          {mode === "signup" && (
            <p>
              Já tem conta?{" "}
              <button onClick={() => setMode("login")} className="text-accent hover:underline">
                Entrar
              </button>
            </p>
          )}
          {mode === "forgot" && (
            <p>
              <button onClick={() => setMode("login")} className="text-accent hover:underline">
                Voltar ao login
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
