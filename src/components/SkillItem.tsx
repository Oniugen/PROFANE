import { useState } from "react";
import { Dices } from "lucide-react";
import { SKILL_DICE } from "../types/character";
import type { DiceSides, Skill } from "../types/character";
import { playDiceRoll } from "../utils/sounds";

interface SkillItemProps {
  skill: Skill;
  onChange: (dice: DiceSides) => void;
  onRoll?: () => void; // se fornecido, mostra o botão de rolagem rápida
}

export default function SkillItem({ skill, onChange, onRoll }: SkillItemProps) {
  const [rolling, setRolling] = useState(false);

  function handleRollClick() {
    if (!onRoll) return;
    playDiceRoll();
    setRolling(true);
    onRoll();
    window.setTimeout(() => setRolling(false), 500);
  }

  return (
    <div className="flex items-center justify-between gap-2 border-b border-parchment/10 py-2 last:border-0">
      <span className="text-sm text-parchment2/90">{skill.name}</span>
      <div className="flex items-center gap-2">
        {onRoll && (
          <button
            onClick={handleRollClick}
            title={`Rolar ${skill.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-parchment/20 text-parchment2/70 hover:border-blood hover:text-blood"
          >
            <Dices size={14} className={rolling ? "animate-dice-roll" : ""} />
          </button>
        )}
        <select
          value={skill.dice}
          onChange={(e) => onChange(Number(e.target.value) as DiceSides)}
          className="rounded-sm border border-parchment/20 bg-charcoal px-2 py-1 text-xs font-stamp text-parchment transition-colors duration-150"
        >
          {SKILL_DICE.map((d) => (
            <option key={d} value={d}>
              d{d}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
