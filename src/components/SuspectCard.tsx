import { Trash2, UserRound } from "lucide-react";
import type { Suspect } from "../types/investigation";

interface SuspectCardProps {
  suspect: Suspect;
  onChange: (updates: Partial<Suspect>) => void;
  onDelete: () => void;
}

export default function SuspectCard({ suspect, onChange, onDelete }: SuspectCardProps) {
  function handleDelete() {
    if (confirm(`Excluir o suspeito "${suspect.name || "sem nome"}"?`)) {
      onDelete();
    }
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ photo: reader.result as string });
    reader.readAsDataURL(file);
  }

  return (
    <div className="dossie-card p-3">
      <div className="mb-2 flex items-start gap-3">
        <label className="group relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-parchment/20 bg-charcoal">
          {suspect.photo ? (
            <img src={suspect.photo} alt={suspect.name} className="h-full w-full object-cover" />
          ) : (
            <UserRound size={18} className="text-parchment2/30" />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-ink/70 text-[8px] text-parchment opacity-0 transition-opacity group-hover:opacity-100">
            Trocar
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </label>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <input
              className="dossie-input-ghost font-display text-sm font-medium"
              placeholder="Nome do suspeito"
              value={suspect.name}
              onChange={(e) => onChange({ name: e.target.value })}
            />
            <button onClick={handleDelete} className="mt-1 shrink-0 text-parchment2/40 hover:text-blood">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
      <textarea
        className="dossie-input-ghost mb-1 min-h-[44px] resize-none text-sm text-parchment2/80"
        placeholder="Descrição"
        value={suspect.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
      <textarea
        className="dossie-input-ghost min-h-[36px] resize-none text-sm italic text-parchment2/60"
        placeholder="Notas"
        value={suspect.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
      />
    </div>
  );
}
