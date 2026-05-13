"use client";

import { useState } from "react";
import { buildPrompt } from "@/lib/prompt-builder";
import { GeneratingLoader } from "@/components/generating-loader";
import { ErrorToast } from "@/components/error-toast";
import type { GenerationFormData, ImageCategory, AspectRatio, LightingStyle, DetailLevel } from "@/types";
import { Wand2 } from "lucide-react";

const categories: { value: ImageCategory; label: string }[] = [
  { value: "realistic", label: "Realista" },
  { value: "digital-art", label: "Digital Art" },
  { value: "pixel-art", label: "Pixel Art" },
  { value: "3d-render", label: "3D Render" },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<GenerationFormData>({
    category: "realistic",
    subject: "",
    style: "",
    lighting: "natural",
    aspectRatio: "1:1",
    detailLevel: "high",
    additionalDetails: "",
  });

  function update<K extends keyof GenerationFormData>(key: K, value: GenerationFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const prompt = buildPrompt(form);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, category: form.category }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.details?.error || data.error || "Erro desconhecido na geração";
        setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      } else if (data.image_url) {
        setResult(data.image_url);
      }
    } catch {
      setError("Falha na conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Gerar Imagem</h1>

      <form onSubmit={handleGenerate} className="space-y-5">
        {/* Categoria */}
        <fieldset>
          <legend className="text-sm text-gray-400 mb-2">Categoria</legend>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => update("category", c.value)}
                className={`px-3 py-2 rounded-lg border text-sm transition ${
                  form.category === c.value
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border hover:border-gray-600"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Assunto */}
        <Field label="Assunto Principal">
          <input
            required
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            placeholder="Ex: um dragão voando sobre montanhas"
            className="input-field"
          />
        </Field>

        {/* Estilo */}
        <Field label="Estilo (opcional)">
          <input
            value={form.style}
            onChange={(e) => update("style", e.target.value)}
            placeholder="Ex: cyberpunk, fantasy, minimalist"
            className="input-field"
          />
        </Field>

        {/* Configurações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Iluminação">
            <select value={form.lighting} onChange={(e) => update("lighting", e.target.value as LightingStyle)} className="input-field">
              <option value="natural">Natural</option>
              <option value="studio">Estúdio</option>
              <option value="cinematic">Cinemática</option>
              <option value="neon">Neon</option>
              <option value="dramatic">Dramática</option>
              <option value="soft">Suave</option>
            </select>
          </Field>

          <Field label="Proporção">
            <select value={form.aspectRatio} onChange={(e) => update("aspectRatio", e.target.value as AspectRatio)} className="input-field">
              <option value="1:1">1:1</option>
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="4:3">4:3</option>
            </select>
          </Field>

          <Field label="Detalhamento">
            <select value={form.detailLevel} onChange={(e) => update("detailLevel", e.target.value as DetailLevel)} className="input-field">
              <option value="low">Baixo</option>
              <option value="medium">Médio</option>
              <option value="high">Alto</option>
              <option value="ultra">Ultra</option>
            </select>
          </Field>
        </div>

        {/* Detalhes adicionais */}
        <Field label="Detalhes Adicionais">
          <textarea
            value={form.additionalDetails}
            onChange={(e) => update("additionalDetails", e.target.value)}
            rows={3}
            placeholder="Qualquer detalhe extra para refinar o prompt..."
            className="input-field resize-none"
          />
        </Field>

        {/* Prompt Preview */}
        {form.subject && (
          <div className="p-3 rounded-lg bg-surface border border-border">
            <p className="text-xs text-gray-500 mb-1">Preview do Prompt:</p>
            <p className="text-sm text-gray-300 font-mono">{buildPrompt(form)}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !form.subject}
          className="w-full py-3 bg-accent hover:bg-accent-hover text-black font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 glow"
        >
          <Wand2 className="w-4 h-4" />
          Gerar Imagem
        </button>
      </form>

      {/* Loading */}
      {loading && <GeneratingLoader />}

      {/* Resultado */}
      {result && (
        <div className="mt-6 rounded-xl overflow-hidden border border-border animate-slide-up">
          <img src={result} alt="Generated" className="w-full" />
        </div>
      )}

      {/* Error Toast */}
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-400 mb-1 block">{label}</span>
      {children}
    </label>
  );
}
