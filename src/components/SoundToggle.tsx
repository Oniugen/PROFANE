import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { atualizarConfigSom, obterConfigSom } from "../utils/sounds";

/** Ícone fixo no canto da tela para mutar/desmutar todo o áudio rapidamente. */
export default function SoundToggle() {
  const [muted, setMuted] = useState(() => obterConfigSom().muted);

  function toggle() {
    const updated = atualizarConfigSom({ muted: !muted });
    setMuted(updated.muted);
  }

  return (
    <button
      onClick={toggle}
      title={muted ? "Ativar som" : "Silenciar"}
      className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-parchment/20 bg-charcoal/90 text-parchment2/80 shadow-lg hover:border-blood hover:text-blood md:bottom-6 md:right-6"
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}