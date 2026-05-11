import { createClient } from "@/lib/supabase-server";
import { Download } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import type { GeneratedImage } from "@/types";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: images } = await supabase
    .from("generated_images")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Minha Galeria</h1>

      {!images?.length ? (
        <p className="text-gray-500">Nenhuma imagem gerada ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img: GeneratedImage) => (
            <div key={img.id} className="border border-border rounded-xl overflow-hidden bg-surface group">
              <div className="relative">
                <img src={img.image_url} alt={img.prompt} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <a href={img.image_url} download className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition" title="Download">
                    <Download className="w-5 h-5" />
                  </a>
                  <ShareButton url={img.image_url} title={img.prompt} />
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 truncate">{img.prompt}</p>
                <span className="text-[10px] text-accent uppercase mt-1 inline-block">{img.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
