import { useState } from "react";
import { Download, FileText, Loader2, Trash2, Upload } from "lucide-react";
import type { Character } from "../types/character";
import { exportarFicha, importarFicha, limparTodosDados } from "../utils/storage";
import { exportarFichaPDF, importarFichaPDF } from "../utils/pdf";
import { atualizarConfigSom, obterConfigSom } from "../utils/sounds";

interface SettingsProps {
  character: Character | null;
  onImport: (character: Character) => void;
  onCleared: () => void;
}

export default function Settings({ character, onImport, onCleared }: SettingsProps) {
  const [importingPdf, setImportingPdf] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [audio, setAudio] = useState(() => obterConfigSom());

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importarFicha(file);
      onImport(imported);
    } catch {
      alert("Arquivo JSON inválido.");
    }
    e.target.value = "";
  }

  async function handleExportPdf() {
    if (!character) return;
    setExportingPdf(true);
    try {
      exportarFichaPDF(character);
    } catch (err) {
      console.error(err);
      alert("Não foi possível gerar o PDF.");
    } finally {
      setExportingPdf(false);
    }
  }

  async function handleImportPdf(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportingPdf(true);
    try {
      const imported = await importarFichaPDF(file);
      onImport(imported);
    } catch (err) {
      console.error(err);
      alert("Este PDF não pôde ser lido. Verifique se foi exportado pelo PROFANE.");
    } finally {
      setImportingPdf(false);
      e.target.value = "";
    }
  }

  function handleClear() {
    if (confirm("Isso apaga a ficha e o painel de investigação salvos. Continuar?")) {
      limparTodosDados();
      onCleared();
    }
  }

  function updateAudio(patch: Partial<typeof audio>) {
    const updated = atualizarConfigSom(patch);
    setAudio(updated);
  }

  return (
    <div className="space-y-4">
      <div className="dossie-card space-y-4 p-6">
        <p className="dossie-label mb-1">Áudio</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-parchment2/90">Som ambiente</p>
            <p className="text-xs text-parchment2/45">Trilha em loop tocando pelo app</p>
          </div>
          <button
            onClick={() => updateAudio({ ambientEnabled: !audio.ambientEnabled })}
            className={`h-6 w-11 rounded-full transition-colors ${
              audio.ambientEnabled ? "bg-blood" : "bg-steel"
            }`}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-bone transition-transform ${
                audio.ambientEnabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(audio.ambientVolume * 100)}
          onChange={(e) => updateAudio({ ambientVolume: Number(e.target.value) / 100 })}
          disabled={!audio.ambientEnabled}
          className="w-full accent-blood disabled:opacity-40"
        />

        <div className="flex items-center justify-between border-t border-parchment/10 pt-3">
          <div>
            <p className="text-sm text-parchment2/90">Efeitos sonoros</p>
            <p className="text-xs text-parchment2/45">Sons de rolagem de dados</p>
          </div>
          <button
            onClick={() => updateAudio({ effectsEnabled: !audio.effectsEnabled })}
            className={`h-6 w-11 rounded-full transition-colors ${
              audio.effectsEnabled ? "bg-blood" : "bg-steel"
            }`}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-bone transition-transform ${
                audio.effectsEnabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(audio.effectsVolume * 100)}
          onChange={(e) => updateAudio({ effectsVolume: Number(e.target.value) / 100 })}
          disabled={!audio.effectsEnabled}
          className="w-full accent-blood disabled:opacity-40"
        />
      </div>

      <div className="dossie-card space-y-3 p-6">
        <p className="dossie-label mb-1">Ficha em PDF</p>
        <button
          disabled={!character || exportingPdf}
          onClick={handleExportPdf}
          className="flex w-full items-center gap-2 rounded-sm bg-blood px-4 py-2.5 text-sm font-medium text-bone hover:bg-blood2 disabled:opacity-40"
        >
          {exportingPdf ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          Exportar PDF
        </button>

        <label
          className={`flex w-full items-center gap-2 rounded-sm border border-parchment/15 px-4 py-2.5 text-sm text-parchment2/80 hover:border-parchment/35 hover:text-parchment ${
            importingPdf ? "pointer-events-none opacity-50" : "cursor-pointer"
          }`}
        >
          {importingPdf ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          Importar PDF
          <input type="file" accept="application/pdf" className="hidden" onChange={handleImportPdf} />
        </label>
        <p className="text-xs text-parchment2/45">
          O PDF exportado guarda a ficha completa por dentro, então importá-lo de volta restaura todos os campos —
          inclusive em versões futuras do sistema.
        </p>
      </div>

      <div className="dossie-card space-y-3 p-6">
        <p className="dossie-label mb-1">Dados brutos (JSON)</p>
        <button
          disabled={!character}
          onClick={() => character && exportarFicha(character)}
          className="flex w-full items-center gap-2 rounded-sm border border-parchment/15 px-4 py-2.5 text-sm text-parchment2/80 hover:border-parchment/35 hover:text-parchment disabled:opacity-40"
        >
          <Download size={16} /> Exportar ficha (JSON)
        </button>

        <label className="flex w-full cursor-pointer items-center gap-2 rounded-sm border border-parchment/15 px-4 py-2.5 text-sm text-parchment2/80 hover:border-parchment/35 hover:text-parchment">
          <Upload size={16} /> Importar ficha (JSON)
          <input type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        </label>
      </div>

      <div className="dossie-card p-6">
        <p className="dossie-label mb-3">Zona de risco</p>
        <button
          onClick={handleClear}
          className="flex w-full items-center gap-2 rounded-sm border border-blood/40 px-4 py-2.5 text-sm text-blood hover:bg-blood/10"
        >
          <Trash2 size={16} /> Limpar todos os dados
        </button>
      </div>
    </div>
  );
}