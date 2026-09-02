import { useEffect, useState } from "react";
import type { Character, Roll } from "./types/character";
import type { InvestigationBoard } from "./types/investigation";
import {
  carregarFicha,
  carregarInvestigacao,
  criarFichaVazia,
  criarInvestigacaoVazia,
  salvarFicha,
  salvarInvestigacao,
} from "./utils/storage";
import { initAudioOnInteraction } from "./utils/sounds";
import Sidebar from "./components/Sidebar";
import SoundToggle from "./components/SoundToggle";
import Home from "./pages/Home";
import CharacterPage from "./pages/Character";
import Rolls from "./pages/Rolls";
import Investigation from "./pages/Investigation";
import Settings from "./pages/Settings";

// Navegação simples por estado (sem react-router, conforme escopo do MVP).
export type Page = "home" | "character" | "rolls" | "investigation" | "settings";

function App() {
  const [page, setPage] = useState<Page>("home");
  const [character, setCharacter] = useState<Character | null>(null);
  const [board, setBoard] = useState<InvestigationBoard>(
    () => carregarInvestigacao() ?? criarInvestigacaoVazia()
  );

  // Carrega a ficha salva ao iniciar (se existir).
  useEffect(() => {
    const loaded = carregarFicha();
    if (loaded) setCharacter(loaded);
  }, []);

  // Salva a ficha automaticamente sempre que ela mudar.
  useEffect(() => {
    if (character) salvarFicha(character);
  }, [character]);

  // Salva o painel de investigação automaticamente sempre que ele mudar.
  useEffect(() => {
    salvarInvestigacao(board);
  }, [board]);

  // Inicia o som ambiente assim que o usuário interagir pela primeira vez
  // com a página (contorna o bloqueio de autoplay dos navegadores).
  useEffect(() => {
    initAudioOnInteraction();
  }, []);

  function handleNovaFicha() {
    setCharacter(criarFichaVazia());
    setPage("character");
  }

  function handleRoll(roll: Roll) {
    if (!character) return;
    setCharacter({ ...character, rolls: [roll, ...character.rolls] });
  }

  return (
    <div className="flex min-h-screen bg-ink text-bone font-serif">
      <Sidebar page={page} onNavigate={setPage} />
      <SoundToggle />

      <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-8 md:pb-8">
        <header className="mb-6 flex items-center gap-2 md:hidden">
          <h1 className="font-display text-lg font-semibold tracking-[0.15em] text-parchment">PROFANE</h1>
        </header>

        {page === "home" && (
          <Home character={character} onNavigate={setPage} onNovaFicha={handleNovaFicha} />
        )}

        {page === "character" &&
          (character ? (
            <CharacterPage character={character} onChange={setCharacter} onRoll={handleRoll} />
          ) : (
            <EmptyState onNovaFicha={handleNovaFicha} />
          ))}

        {page === "rolls" && <Rolls character={character} onRoll={handleRoll} />}

        {page === "investigation" && <Investigation board={board} onChange={setBoard} />}

        {page === "settings" && (
          <Settings
            character={character}
            onImport={(imported) => {
              setCharacter(imported);
              setPage("character");
            }}
            onCleared={() => {
              setCharacter(null);
              setBoard(criarInvestigacaoVazia());
              setPage("home");
            }}
          />
        )}
      </main>
    </div>
  );
}

function EmptyState({ onNovaFicha }: { onNovaFicha: () => void }) {
  return (
    <div className="dossie-card p-6 text-center">
      <p className="mb-4 text-sm text-parchment2/70">Nenhuma ficha aberta ainda.</p>
      <button onClick={onNovaFicha} className="rounded-sm bg-blood px-4 py-2 text-sm text-bone">
        Criar nova ficha
      </button>
    </div>
  );
}

export default App;