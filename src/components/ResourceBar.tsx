import { Minus, Plus } from "lucide-react";
import type { Resource } from "../types/character";

interface ResourceBarProps {
  label: string;
  resource: Resource;
  colorClass: string; // classe tailwind da barra, ex: "bg-blood"
  onChange: (resource: Resource) => void;
}

export default function ResourceBar({ label, resource, colorClass, onChange }: ResourceBarProps) {
  const pct = resource.max > 0 ? Math.min(100, Math.max(0, (resource.current / resource.max) * 100)) : 0;

  function adjust(delta: number) {
    const current = Math.min(resource.max, Math.max(0, resource.current + delta));
    onChange({ ...resource, current });
  }

  return (
    <div className="dossie-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="dossie-label">{label}</p>
        <div className="flex items-center gap-2 text-sm">
          <input
            type="number"
            className="w-14 rounded-sm border border-parchment/20 bg-charcoal px-1 py-0.5 text-center"
            value={resource.current}
            onChange={(e) =>
              onChange({ ...resource, current: Math.min(resource.max, Math.max(0, Number(e.target.value) || 0)) })
            }
          />
          <span className="text-parchment2/50">/</span>
          <input
            type="number"
            className="w-14 rounded-sm border border-parchment/20 bg-charcoal px-1 py-0.5 text-center"
            value={resource.max}
            onChange={(e) => onChange({ ...resource, max: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
      </div>

      <div className="mb-2 h-3 w-full overflow-hidden rounded-sm bg-charcoal border border-parchment/10">
        <div className={`h-full ${colorClass} transition-all`} style={{ width: `${pct}%` }} />
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => adjust(-1)}
          className="flex h-7 w-7 items-center justify-center rounded-sm border border-parchment/20 text-parchment2/70 hover:border-parchment/40"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={() => adjust(1)}
          className="flex h-7 w-7 items-center justify-center rounded-sm border border-parchment/20 text-parchment2/70 hover:border-parchment/40"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
