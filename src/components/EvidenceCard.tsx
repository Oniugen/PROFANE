import { Camera, Trash2 } from "lucide-react";
import type { Evidence } from "../types/investigation";

interface EvidenceCardProps {
  evidence: Evidence;
  onChange: (updates: Partial<Evidence>) => void;
  onDelete: () => void;
}

export default function EvidenceCard({ evidence, onChange, onDelete }: EvidenceCardProps) {
  function handleDelete() {
    if (confirm(`Excluir a evidência "${evidence.title || "sem título"}"?`)) {
      onDelete();
    }
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ image: reader.result as string });
    reader.readAsDataURL(file);
  }

  return (
    <div className="dossie-card overflow-hidden">
      <label className="group relative block h-28 w-full cursor-pointer overflow-hidden bg-charcoal">
        {evidence.image ? (
          <img src={evidence.image} alt={evidence.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Camera size={20} className="text-parchment2/30" />
          </div>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-ink/70 text-[10px] text-parchment opacity-0 transition-opacity group-hover:opacity-100">
          Trocar imagem
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
      </label>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <input
            className="dossie-input-ghost font-display text-sm font-medium"
            placeholder="Título da evidência"
            value={evidence.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
          <button onClick={handleDelete} className="mt-1 shrink-0 text-parchment2/40 hover:text-blood">
            <Trash2 size={14} />
          </button>
        </div>
        <input
          className="dossie-input-ghost dossie-label"
          placeholder="Categoria"
          value={evidence.category}
          onChange={(e) => onChange({ category: e.target.value })}
        />
        <textarea
          className="dossie-input-ghost min-h-[54px] resize-none text-sm text-parchment2/80"
          placeholder="Descrição"
          value={evidence.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>
    </div>
  );
}
