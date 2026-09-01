import type { DiceSides } from "../types/character";

/**
 * Rola um dado de N lados e retorna um número entre 1 e N (inclusive).
 * Exemplo: rollDice(8) -> número entre 1 e 8.
 */
export function rollDice(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export interface TestResult {
  attributeResult: number;
  skillResult: number;
  total: number;
  difficulty?: number;
  success?: boolean;
  isCriticalSuccess: boolean;
  isCriticalFailure: boolean;
}

/**
 * Regra de teste do MVP: rola o dado do atributo + o dado da perícia e soma.
 * Se uma DT for informada, compara o total com a DT para determinar sucesso/falha.
 *
 * Regra de crítico (fácil de trocar depois, caso o material de referência
 * defina outra coisa):
 * - Crítico de sucesso: os dois dados (atributo e perícia) tiram o MESMO
 *   valor, e esse valor é maior ou igual a 6. Ex.: 6 e 6, 7 e 7, 8 e 8...
 *   Empates abaixo de 6 (ex.: 5 e 5, 4 e 4) NÃO contam como crítico.
 * - Crítico de falha: os dois dados tiram 1.
 */
export function rollTest(
  attributeDice: DiceSides,
  skillDice: DiceSides,
  difficulty?: number
): TestResult {
  const attributeResult = rollDice(attributeDice);
  const skillResult = rollDice(skillDice);
  const total = attributeResult + skillResult;

  const isCriticalSuccess = attributeResult === skillResult && attributeResult >= 6;
  const isCriticalFailure = attributeResult === 1 && skillResult === 1;

  const result: TestResult = {
    attributeResult,
    skillResult,
    total,
    difficulty,
    isCriticalSuccess,
    isCriticalFailure,
  };

  if (difficulty !== undefined) {
    result.success = isCriticalFailure ? false : isCriticalSuccess ? true : total >= difficulty;
  }

  return result;
}
