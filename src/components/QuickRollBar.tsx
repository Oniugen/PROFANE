import type { AttributeKey } from "../types/character";
import { ATTRIBUTE_LABELS } from "../types/character";

interface QuickRollBarProps {
  activeAttribute: AttributeKey;
  onChangeAttribute: (key: AttributeKey) => void;
  attributes: Record<AttributeKey, number>;
}

/**
 * Barra compacta acima das perícias: escolhe qual atributo entra
 * na rolagem rápida disparada pelo botão de dado de cada perícia.
 */
export default function QuickRollBar({ activeAttribute, onChangeAttribute, attributes }: QuickRollBarProps) {
  const keys: AttributeKey[] = ["fisico", "mente", "emocao"];

  return (
    <div className="dossie-card p-3">
      <p className="dossie-label mb-2">Atributo para rolagem rápida</p>
      <div className="flex gap-2">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => onChangeAttribute(key)}
            className={`flex-1 rounded-sm border px-2 py-1.5 text-xs font-stamp ${
              key === activeAttribute
                ? "border-blood bg-blood/20 text-parchment"
                : "border-parchment/20 text-parchment2/70 hover:border-parchment/40"
            }`}
          >
            {ATTRIBUTE_LABELS[key]} (d{attributes[key]})
          </button>
        ))}
      </div>
    </div>
  );
}
