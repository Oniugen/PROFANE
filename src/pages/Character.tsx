import { useState } from "react";
import type { AttributeKey, Character, DiceSides, Skill, Ability, Roll } from "../types/character";
import { rollTest } from "../utils/dice";
import CharacterHeader from "../components/CharacterHeader";
import AttributeCard from "../components/AttributeCard";
import ResourceBar from "../components/ResourceBar";
import QuickRollBar from "../components/QuickRollBar";
import SkillsList from "../components/SkillsList";
import AbilityList from "../components/AbilityList";
import RollResult from "../components/RollResult";

interface CharacterPageProps {
  character: Character;
  onChange: (character: Character) => void;
  onRoll: (roll: Roll) => void;
}

const ATTRIBUTE_KEYS: AttributeKey[] = ["fisico", "mente", "emocao"];

export default function CharacterPage({ character, onChange, onRoll }: CharacterPageProps) {
  const [quickAttribute, setQuickAttribute] = useState<AttributeKey>("fisico");
  const [quickRoll, setQuickRoll] = useState<Roll | null>(null);

  function updateFields(updates: Partial<Character>) {
    onChange({ ...character, ...updates });
  }

  function updateAttribute(key: AttributeKey, dice: DiceSides) {
    onChange({ ...character, attributes: { ...character.attributes, [key]: dice } });
  }

  function updateSkills(skills: Skill[]) {
    onChange({ ...character, skills });
  }

  function updateAbilities(abilities: Ability[]) {
    onChange({ ...character, abilities });
  }

  // Rolagem rápida direto da ficha: usa o atributo selecionado na QuickRollBar
  // combinado com a perícia cujo dado o usuário clicou.
  function handleQuickRoll(skill: Skill) {
    const attributeDice = character.attributes[quickAttribute];
    const result = rollTest(attributeDice, skill.dice);

    const roll: Roll = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      attributeKey: quickAttribute,
      attributeDice,
      attributeResult: result.attributeResult,
      skillName: skill.name,
      skillDice: skill.dice,
      skillResult: result.skillResult,
      total: result.total,
      isCriticalSuccess: result.isCriticalSuccess,
      isCriticalFailure: result.isCriticalFailure,
    };

    setQuickRoll(roll);
    onRoll(roll);
  }

  return (
    <div className="space-y-4">
      <CharacterHeader character={character} onChange={updateFields} />

      <div>
        <p className="dossie-label mb-2 px-1">Atributos</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ATTRIBUTE_KEYS.map((key) => (
            <AttributeCard
              key={key}
              attrKey={key}
              dice={character.attributes[key]}
              onChange={(dice) => updateAttribute(key, dice)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="dossie-label mb-2 px-1">Recursos</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ResourceBar
            label="PV — Pontos de Vida"
            resource={character.pv}
            colorClass="bg-blood"
            onChange={(pv) => updateFields({ pv })}
          />
          <ResourceBar
            label="PD — Pontos de Determinação"
            resource={character.pd}
            colorClass="bg-parchment2"
            onChange={(pd) => updateFields({ pd })}
          />
        </div>
      </div>

      <QuickRollBar
        activeAttribute={quickAttribute}
        onChangeAttribute={setQuickAttribute}
        attributes={character.attributes}
      />

      <SkillsList skills={character.skills} onChange={updateSkills} onRollSkill={handleQuickRoll} />

      {quickRoll && <RollResult roll={quickRoll} />}

      <AbilityList abilities={character.abilities} onChange={updateAbilities} />
    </div>
  );
}
