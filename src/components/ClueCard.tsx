import { Trash2 } from "lucide-react";
import type { Clue, ClueStatus } from "../types/investigation";
import { CLUE_STATUS_LABELS } from "../types/investigation";
import Stamp from "./Stamp";

interface ClueCardProps {
  clue: Clue;
  onChange: (updates: Partial<Clue>) => void;
  onDelete: () => void;
}

const STATUS_COLORS: Record<ClueStatus, string> = {
  oculta: "text-parchment2/50 border-parchment/20",
  parcial: "text-parchment2/90 border-parchment2/40",
  revelada: "text-blood border-blood/50",
};

export default function ClueCard({ clue, onChange, onDelete }: ClueCardProps) {
  function handleDelete() {
    if (confirm(`Excluir a pista "${clue.title || "sem título"}"?`)) {
      onDelete();
    }
  }

  return (
    <div className="dossie-card p-3">
      {clue.status === "revelada" && (
        <div className="pointer-events-none absolute -top-2 right-2">
          <Stamp text="Revelada" rotate={-8} />
        </div>
      )}
      <div className="mb-1 flex items-start justify-between gap-2 pr-2">
        <input
          className="dossie-input-ghost font-display text-sm font-medium"
          placeholder="Título da pista"
          value={clue.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <button onClick={handleDelete} className="mt-1 shrink-0 text-parchment2/40 hover:text-blood">
          <Trash2 size={14} />
        </button>
      </div>
      <textarea
        className="dossie-input-ghost mb-2 min-h-[44px] resize-none text-sm text-parchment2/80"
        placeholder="Descrição"
        value={clue.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
      <select
        value={clue.status}
        onChange={(e) => onChange({ status: e.target.value as ClueStatus })}
        className={`rounded-sm border bg-charcoal px-2 py-1 text-xs font-stamp transition-colors duration-150 ${STATUS_COLORS[clue.status]}`}
      >
        {(Object.keys(CLUE_STATUS_LABELS) as ClueStatus[]).map((s) => (
          <option key={s} value={s}>
            {CLUE_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
