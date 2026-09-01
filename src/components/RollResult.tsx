import type { Roll } from "../types/character";
import { ATTRIBUTE_LABELS } from "../types/character";
import Stamp from "./Stamp";

interface RollResultProps {
  roll: Roll;
}

export default function RollResult({ roll }: RollResultProps) {
  return (
    <div key={roll.id} className="dossie-card animate-fade-up p-4 md:p-6">
      <p className="dossie-label mb-3">Resultado</p>
      <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
        <div>
          <p className="text-xs text-parchment2/60">{ATTRIBUTE_LABELS[roll.attributeKey]}</p>
          <p className="font-display text-xl text-parchment">
            d{roll.attributeDice} → {roll.attributeResult}
          </p>
        </div>
        <div>
          <p className="text-xs text-parchment2/60">{roll.skillName}</p>
          <p className="font-display text-xl text-parchment">
            d{roll.skillDice} → {roll.skillResult}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs text-parchment2/60">Total</p>
          <p className="font-display text-3xl text-blood">{roll.total}</p>
        </div>
      </div>

      {(roll.isCriticalSuccess || roll.isCriticalFailure) && (
        <div className="mt-4 flex justify-center border-t border-parchment/10 pt-3">
          <Stamp
            text={roll.isCriticalSuccess ? "Crítico!" : "Falha Crítica"}
            tone={roll.isCriticalSuccess ? "success" : "blood"}
            rotate={-4}
          />
        </div>
      )}

      {roll.difficulty !== undefined && (
        <div className="mt-4 flex flex-col items-center gap-2 border-t border-parchment/10 pt-3">
          <p className="text-xs text-parchment2/60">DT {roll.difficulty}</p>
          <Stamp text={roll.success ? "Sucesso" : "Falha"} tone={roll.success ? "success" : "blood"} rotate={-4} />
        </div>
      )}
    </div>
  );
}
