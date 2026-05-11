import Link from "next/link";
import { Sparkles, Zap, Image as ImageIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 glow-text">
          <span className="text-accent">Byte Quest</span> AI
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Gere imagens incríveis com IA usando prompts de alta fidelidade.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Feature icon={<Sparkles className="text-accent" />} title="Prompts Inteligentes" />
          <Feature icon={<Zap className="text-accent" />} title="Geração Rápida" />
          <Feature icon={<ImageIcon className="text-accent" />} title="Alta Qualidade" />
        </div>

        <Link
          href="/auth/login"
          className="inline-block px-8 py-3 bg-accent hover:bg-accent-hover text-black font-semibold rounded-lg transition glow"
        >
          Começar Agora
        </Link>
      </div>
    </main>
  );
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="p-4 border border-border rounded-lg bg-surface">
      <div className="mb-2">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
    </div>
  );
}
