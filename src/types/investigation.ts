export type ClueStatus = "oculta" | "parcial" | "revelada";

export const CLUE_STATUS_LABELS: Record<ClueStatus, string> = {
  oculta: "Oculta",
  parcial: "Parcial",
  revelada: "Revelada",
};

export interface Evidence {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string; // Data URL opcional
  createdAt: number;
}

export interface Suspect {
  id: string;
  name: string;
  photo?: string; // Data URL opcional
  description: string;
  notes: string;
  createdAt: number;
}

// Estrutura final da pista: apenas nome, descrição e status.
// (campo DT removido a pedido do usuário — não é utilizado no sistema)
export interface Clue {
  id: string;
  title: string;
  description: string;
  status: ClueStatus;
  createdAt: number;
}

export interface InvestigationBoard {
  id: string;
  evidence: Evidence[];
  suspects: Suspect[];
  clues: Clue[];
}
