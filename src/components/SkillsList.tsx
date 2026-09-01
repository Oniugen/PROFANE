import { SKILL_NAMES } from "../types/character";
import type { DiceSides, Skill } from "../types/character";
import SkillItem from "./SkillItem";

interface SkillsListProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  onRollSkill?: (skill: Skill) => void; // rolagem rápida direto na ficha
}

export default function SkillsList({ skills, onChange, onRollSkill }: SkillsListProps) {
  function getDice(name: string): DiceSides {
    return skills.find((s) => s.name === name)?.dice ?? 4;
  }

  function setDice(name: (typeof SKILL_NAMES)[number], dice: DiceSides) {
    const exists = skills.some((s) => s.name === name);
    const updated = exists
      ? skills.map((s) => (s.name === name ? { ...s, dice } : s))
      : [...skills, { name, dice }];
    onChange(updated);
  }

  const mid = Math.ceil(SKILL_NAMES.length / 2);
  const columns = [SKILL_NAMES.slice(0, mid), SKILL_NAMES.slice(mid)];

  return (
    <div className="dossie-card p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="dossie-label">Perícias</p>
        {onRollSkill && <p className="dossie-label text-parchment2/50">Toque no dado para rolar</p>}
      </div>
      <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
        {columns.map((col, i) => (
          <div key={i}>
            {col.map((name) => {
              const skill = { name, dice: getDice(name) };
              return (
                <SkillItem
                  key={name}
                  skill={skill}
                  onChange={(d) => setDice(name, d)}
                  onRoll={onRollSkill ? () => onRollSkill(skill) : undefined}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
