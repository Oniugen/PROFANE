import { ATTRIBUTE_DICE, ATTRIBUTE_LABELS } from "../types/character";
import type { AttributeKey, DiceSides } from "../types/character";

interface AttributeCardProps {
  attrKey: AttributeKey;
  dice: DiceSides;
  onChange: (dice: DiceSides) => void;
}

export default function AttributeCard({ attrKey, dice, onChange }: AttributeCardProps) {
  return (
    <div className="dossie-card p-4 text-center">
      <p className="dossie-label mb-2">{ATTRIBUTE_LABELS[attrKey]}</p>
      <p className="font-display text-3xl text-blood mb-3">d{dice}</p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {ATTRIBUTE_DICE.map((d) => (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`h-8 w-8 rounded-sm border text-xs font-stamp ${
              d === dice
                ? "border-blood bg-blood text-bone"
                : "border-parchment/20 text-parchment2/70 hover:border-parchment/40"
            }`}
          >
            d{d}
          </button>
        ))}
      </div>
    </div>
  );
}
