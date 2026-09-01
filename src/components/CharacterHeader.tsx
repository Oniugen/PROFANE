import { Camera } from "lucide-react";
import type { Character } from "../types/character";

interface CharacterHeaderProps {
  character: Character;
  onChange: (updates: Partial<Character>) => void;
}

export default function CharacterHeader({ character, onChange }: CharacterHeaderProps) {
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ photo: reader.result as string });
    reader.readAsDataURL(file);
  }

  return (
    <div className="dossie-card p-4 md:p-6">
      <p className="dossie-label mb-4">Informações do Sujeito</p>
      <div className="flex flex-col gap-5 md:flex-row">
        <label className="group relative mx-auto flex h-32 w-32 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-parchment/25 bg-charcoal md:mx-0">
          {character.photo ? (
            <img src={character.photo} alt={character.name} className="h-full w-full object-cover grayscale-[30%]" />
          ) : (
            <Camera className="text-parchment2/40" size={28} />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-ink/70 text-[10px] text-parchment opacity-0 transition-opacity group-hover:opacity-100">
            Trocar foto
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </label>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="dossie-label mb-1 block">Nome</label>
            <input
              className="dossie-input font-display"
              value={character.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Nome do sujeito"
            />
          </div>
          <div>
            <label className="dossie-label mb-1 block">Ocupação</label>
            <input
              className="dossie-input"
              value={character.occupation}
              onChange={(e) => onChange({ occupation: e.target.value })}
              placeholder="Ex.: Detetive"
            />
          </div>
          <div>
            <label className="dossie-label mb-1 block">Nível</label>
            <input
              type="number"
              min={1}
              className="dossie-input"
              value={character.level}
              onChange={(e) => onChange({ level: Number(e.target.value) || 1 })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="dossie-label mb-1 block">Perfil</label>
            <textarea
              className="dossie-input min-h-[72px] resize-none"
              value={character.profile}
              onChange={(e) => onChange({ profile: e.target.value })}
              placeholder="Notas gerais sobre o sujeito..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
