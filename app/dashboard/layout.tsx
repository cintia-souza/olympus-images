import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Image as ImageIcon, PlusCircle, LogOut } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-border p-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold text-accent mb-4">Byte Quest AI</h2>
        <NavLink href="/dashboard" icon={<PlusCircle className="w-4 h-4" />} label="Gerar" />
        <NavLink href="/dashboard/gallery" icon={<ImageIcon className="w-4 h-4" />} label="Galeria" />
        <div className="mt-auto pt-4 border-t border-border">
          <form action="/api/auth/signout" method="POST">
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-surface-hover transition">
      {icon} {label}
    </Link>
  );
}
