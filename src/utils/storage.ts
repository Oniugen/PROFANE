import type { Character } from "../types/character";
import type { InvestigationBoard } from "../types/investigation";

const CHARACTER_KEY = "dossie:character";
const INVESTIGATION_KEY = "dossie:investigation";
const MAX_ROLLS_STORED = 50;

// ---------- FICHA ----------

/** Salva a ficha no localStorage. Limita o histórico de rolagens para não crescer sem limite. */
export function salvarFicha(character: Character): void {
  const toSave: Character = {
    ...character,
    updatedAt: Date.now(),
    rolls: character.rolls.slice(0, MAX_ROLLS_STORED),
  };
  try {
    localStorage.setItem(CHARACTER_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error("Falha ao salvar a ficha:", err);
  }
}

/** Carrega a ficha do localStorage. Retorna null se não houver ficha salva. */
export function carregarFicha(): Character | null {
  try {
    const raw = localStorage.getItem(CHARACTER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Character;
  } catch (err) {
    console.error("Falha ao carregar a ficha:", err);
    return null;
  }
}

/** Remove a ficha salva do localStorage. */
export function limparFicha(): void {
  localStorage.removeItem(CHARACTER_KEY);
}

/** Exporta a ficha atual como um arquivo .json para download. */
export function exportarFicha(character: Character): void {
  const blob = new Blob([JSON.stringify(character, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = character.name.trim() ? character.name.trim().replace(/\s+/g, "_") : "ficha";
  a.download = `${safeName}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Importa uma ficha a partir de um arquivo .json selecionado pelo usuário. */
export function importarFicha(file: File): Promise<Character> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Character;
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// ---------- PAINEL DE INVESTIGAÇÃO ----------

export function salvarInvestigacao(board: InvestigationBoard): void {
  try {
    localStorage.setItem(INVESTIGATION_KEY, JSON.stringify(board));
  } catch (err) {
    console.error("Falha ao salvar o painel de investigação:", err);
  }
}

export function carregarInvestigacao(): InvestigationBoard | null {
  try {
    const raw = localStorage.getItem(INVESTIGATION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as InvestigationBoard;
  } catch (err) {
    console.error("Falha ao carregar o painel de investigação:", err);
    return null;
  }
}

export function limparInvestigacao(): void {
  localStorage.removeItem(INVESTIGATION_KEY);
}

// ---------- LIMPEZA GERAL ----------

/** Limpa todos os dados do app (usado em Configurações). */
export function limparTodosDados(): void {
  limparFicha();
  limparInvestigacao();
}

// ---------- FÁBRICAS PADRÃO ----------

export function criarFichaVazia(): Character {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    name: "",
    occupation: "",
    profile: "",
    level: 1,
    attributes: { fisico: 6, mente: 6, emocao: 6 },
    pv: { current: 10, max: 10 },
    pd: { current: 5, max: 5 },
    skills: [],
    abilities: [],
    rolls: [],
  };
}

export function criarInvestigacaoVazia(): InvestigationBoard {
  return {
    id: crypto.randomUUID(),
    evidence: [],
    suspects: [],
    clues: [],
  };
}
