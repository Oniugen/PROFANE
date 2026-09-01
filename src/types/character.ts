// Dados de dado usados em atributos e perícias
export type DiceSides = 4 | 6 | 8 | 10 | 12 | 20;

export const ATTRIBUTE_DICE: DiceSides[] = [4, 6, 8, 10, 12, 20];
export const SKILL_DICE: DiceSides[] = [4, 6, 8, 10, 12];

export type AttributeKey = "fisico" | "mente" | "emocao";

export interface Attribute {
  key: AttributeKey;
  label: string;
  dice: DiceSides;
}

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  fisico: "Físico",
  mente: "Mente",
  emocao: "Emoção",
};

// Lista fixa de perícias do MVP. Fácil de editar/expandir depois.
export const SKILL_NAMES = [
  "Acrobacia",
  "Aptidão",
  "Atletismo",
  "Crime",
  "Disciplina",
  "Enganação",
  "Furtividade",
  "Intimidar",
  "Intuição",
  "Luta",
  "Máquinas",
  "Medicina",
  "Ocultismo",
  "Percepção",
  "Persuasão",
  "Pesquisar",
  "Pontaria",
  "Sobrevivência",
  "Tecnologia",
  "Vigor",
] as const;

export type SkillName = (typeof SKILL_NAMES)[number];

export interface Skill {
  name: SkillName;
  dice: DiceSides;
}

export interface Resource {
  current: number;
  max: number;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  costPV: number;
  costPD: number;
}

export interface Roll {
  id: string;
  timestamp: number;
  attributeKey: AttributeKey;
  attributeDice: DiceSides;
  attributeResult: number;
  skillName: SkillName;
  skillDice: DiceSides;
  skillResult: number;
  total: number;
  difficulty?: number;
  success?: boolean;
  isCriticalSuccess: boolean;
  isCriticalFailure: boolean;
}

export interface Character {
  id: string;
  createdAt: number;
  updatedAt: number;

  // Informações
  name: string;
  occupation: string;
  profile: string;
  level: number;
  photo?: string; // Data URL

  // Atributos
  attributes: Record<AttributeKey, DiceSides>;

  // Recursos
  pv: Resource; // Pontos de Vida
  pd: Resource; // Pontos de Determinação (ou similar)

  // Perícias
  skills: Skill[];

  // Habilidades
  abilities: Ability[];

  // Histórico de rolagens (mais recente primeiro, limitado no storage.ts)
  rolls: Roll[];
}
