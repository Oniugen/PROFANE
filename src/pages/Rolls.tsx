import type { Character, Roll } from "../types/character";
import RollPanel from "../components/RollPanel";

interface RollsPageProps {
  character: Character | null;
  onRoll: (roll: Roll) => void;
}

export default function RollsPage({ character, onRoll }: RollsPageProps) {
  if (!character) {
    return (
      <div className="dossie-card p-6 text-center">
        <p className="text-sm text-parchment2/70">Crie ou abra uma ficha primeiro.</p>
      </div>
    );
  }

  return <RollPanel character={character} onRoll={onRoll} />;
}
