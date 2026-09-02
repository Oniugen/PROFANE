import { useState } from "react";
import { Dices } from "lucide-react";
import type { AttributeKey, Character, Roll } from "../types/character";
import { ATTRIBUTE_LABELS } from "../types/character";
import { rollTest } from "../utils/dice";
import RollResult from "./RollResult";

interface RollPanelProps {
  character: Character;
  onRoll: (roll: Roll) => void;
}

export default function RollPanel({ character, onRoll }: RollPanelProps) {
  const [attributeKey, setAttributeKey] = useState<AttributeKey>("fisico");
  const [skillName, setSkillName] = useState(character.skills[0]?.name ?? "");
  const [difficulty, setDifficulty] = useState<string>("");
  const [lastRoll, setLastRoll] = useState<Roll | null>(null);
  const [rolling, setRolling] = useState(false);

  const selectedSkill = character.skills.find((s) => s.name === skillName);
  const attributeDice = character.attributes[attributeKey];

  function handleRoll() {
    if (!selectedSkill) return;
    const dt = difficulty.trim() ? Number(difficulty) : undefined;
    const result = rollTest(attributeDice, selectedSkill.dice, dt);

    const roll: Roll = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      attributeKey,
      attributeDice,
      attributeResult: result.attributeResult,
      skillName: selectedSkill.name,
      skillDice: selectedSkill.dice,
      skillResult: result.skillResult,
      total: result.total,
      difficulty: dt,
      success: result.success,
      isCriticalSuccess: result.isCriticalSuccess,
      isCriticalFailure: result.isCriticalFailure,
    };

    setRolling(true);
    window.setTimeout(() => setRolling(false), 500);
    setLastRoll(roll);
    onRoll(roll);
  }

  if (character.skills.length === 0) {
    return (
      <div className="dossie-card p-6 text-center">
        <p className="text-sm text-parchment2/70">
          Defina ao menos uma perícia na ficha antes de fazer testes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="dossie-card p-4 md:p-6">
        <p className="dossie-label mb-4">Teste</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="dossie-label mb-1 block">Atributo</label>
            <select
              className="dossie-input"
              value={attributeKey}
              onChange={(e) => setAttributeKey(e.target.value as AttributeKey)}
            >
              {(Object.keys(ATTRIBUTE_LABELS) as AttributeKey[]).map((key) => (
                <option key={key} value={key}>
                  {ATTRIBUTE_LABELS[key]} (d{character.attributes[key]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="dossie-label mb-1 block">Perícia</label>
            <select className="dossie-input" value={skillName} onChange={(e) => setSkillName(e.target.value as AttributeKey)}>
              {character.skills.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} (d{s.dice})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="dossie-label mb-1 block">DT (opcional)</label>
            <input
              type="number"
              className="dossie-input"
              placeholder="Ex.: 12"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleRoll}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-blood py-3 text-sm text-bone hover:bg-blood2"
        >
          <Dices size={16} className={rolling ? "animate-dice-roll" : ""} /> ROLAR
        </button>
      </div>

      {lastRoll && <RollResult roll={lastRoll} />}

      {character.rolls.length > 0 && (
        <div className="dossie-card p-4 md:p-6">
          <p className="dossie-label mb-3">Histórico</p>
          <div className="space-y-1.5 text-sm">
            {character.rolls.slice(0, 10).map((r) => (
              <div key={r.id} className="flex justify-between text-parchment2/70">
                <span>
                  {ATTRIBUTE_LABELS[r.attributeKey]} + {r.skillName}
                  {r.isCriticalSuccess && " ★"}
                  {r.isCriticalFailure && " ⚠"}
                </span>
                <span className="text-parchment">
                  {r.total}
                  {r.difficulty !== undefined && (r.success ? " ✓" : " ✗")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
