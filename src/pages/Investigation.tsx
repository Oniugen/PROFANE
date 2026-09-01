import type { InvestigationBoard } from "../types/investigation";
import InvestigationBoardView from "../components/InvestigationBoard";

interface InvestigationProps {
  board: InvestigationBoard;
  onChange: (board: InvestigationBoard) => void;
}

export default function Investigation({ board, onChange }: InvestigationProps) {
  return (
    <div>
      <p className="dossie-label mb-4">Painel de Investigação</p>
      <InvestigationBoardView board={board} onChange={onChange} />
    </div>
  );
}
