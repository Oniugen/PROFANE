import { FilePlus, FolderOpen, FolderSearch } from "lucide-react";
import type { Character } from "../types/character";
import type { Page } from "../App";
import Stamp from "../components/Stamp";

interface HomeProps {
  character: Character | null;
  onNavigate: (page: Page) => void;
  onNovaFicha: () => void;
}

export default function Home({ character, onNavigate, onNovaFicha }: HomeProps) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 text-center md:text-left">
        <p className="dossie-label text-parchment2/50">Sistema de investigação</p>
        <h1 className="font-display text-3xl font-semibold tracking-[0.1em] text-parchment">PROFANE</h1>
      </div>

      <div className="dossie-card p-6 text-center md:p-10">
        <div className="mb-3 flex justify-end">
          <Stamp text={character ? "Arquivo Ativo" : "Sem Registro"} />
        </div>
        <p className="dossie-label mb-1">Arquivo confidencial</p>
        <h2 className="font-display text-2xl font-medium text-parchment mb-1">
          {character?.name || "Nenhuma ficha aberta"}
        </h2>
        {character?.occupation && (
          <p className="mb-6 text-sm text-parchment2/70">{character.occupation}</p>
        )}
        {!character?.occupation && <div className="mb-6" />}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => (character ? onNavigate("character") : onNovaFicha())}
            className="flex items-center justify-center gap-2 rounded-sm bg-blood px-4 py-3 text-sm font-medium text-bone transition-colors hover:bg-blood2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            <FolderOpen size={16} />
            {character ? "Abrir ficha" : "Começar"}
          </button>
          <button
            onClick={onNovaFicha}
            className="flex items-center justify-center gap-2 rounded-sm border border-parchment/20 px-4 py-3 text-sm text-parchment2/80 transition-colors hover:border-parchment/40 hover:text-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            <FilePlus size={16} />
            Nova ficha
          </button>
          <button
            onClick={() => onNavigate("investigation")}
            className="flex items-center justify-center gap-2 rounded-sm border border-parchment/20 px-4 py-3 text-sm text-parchment2/80 transition-colors hover:border-parchment/40 hover:text-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            <FolderSearch size={16} />
            Investigação
          </button>
        </div>
      </div>
    </div>
  );
}
