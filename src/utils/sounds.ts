import { Howl, Howler } from "howler";

const AUDIO_SETTINGS_KEY = "dossie:audio";

export interface AudioSettings {
  muted: boolean; // mute geral (ícone fixo)
  ambientEnabled: boolean;
  effectsEnabled: boolean;
  ambientVolume: number; // 0 a 1
  effectsVolume: number; // 0 a 1
}

const DEFAULT_SETTINGS: AudioSettings = {
  muted: false,
  ambientEnabled: true,
  effectsEnabled: true,
  ambientVolume: 0.3,
  effectsVolume: 0.6,
};

export function carregarConfigSom(): AudioSettings {
  try {
    const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error("Falha ao carregar configurações de som:", err);
    return DEFAULT_SETTINGS;
  }
}

function salvarConfigSom(settings: AudioSettings): void {
  try {
    localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error("Falha ao salvar configurações de som:", err);
  }
}

// ---------- Instâncias de som ----------

const diceRoll = new Howl({ src: ["/sounds/dice-roll.wav"] });
const diceCritical = new Howl({ src: ["/sounds/dice-critical.mp3"] });
const diceFail = new Howl({ src: ["/sounds/dice-fail.mp3"] });
const ambient = new Howl({
  src: ["/sounds/ambient-loop.mp3"],
  loop: true,
});

let settings: AudioSettings = carregarConfigSom();
let ambientStarted = false;

// Aplica as configurações carregadas assim que o módulo é iniciado
Howler.mute(settings.muted);
ambient.volume(settings.ambientVolume);
[diceRoll, diceCritical, diceFail].forEach((s) => s.volume(settings.effectsVolume));

// ---------- Efeitos sonoros (dados) ----------

function playEffect(sound: Howl) {
  if (!settings.effectsEnabled) return;
  sound.play();
}

export const playDiceRoll = () => playEffect(diceRoll);
export const playDiceCritical = () => playEffect(diceCritical);
export const playDiceFail = () => playEffect(diceFail);

// ---------- Som ambiente ----------

/**
 * Tenta iniciar o som ambiente em loop. Navegadores bloqueiam autoplay
 * com som antes de qualquer interação do usuário, então isso deve ser
 * chamado a partir de um listener de clique/toque/tecla (ver initAudioOnInteraction).
 */
export function iniciarAmbienteSeAtivado(): void {
  if (ambientStarted || !settings.ambientEnabled) return;
  ambient.play();
  ambientStarted = true;
}

export function pararAmbiente(): void {
  ambient.stop();
  ambientStarted = false;
}

/**
 * Registra um listener único (clique, toque ou tecla) para iniciar o som
 * ambiente assim que o usuário interagir pela primeira vez com a página —
 * contorna o bloqueio de autoplay dos navegadores.
 */
export function initAudioOnInteraction(): void {
  const start = () => {
    iniciarAmbienteSeAtivado();
    window.removeEventListener("click", start);
    window.removeEventListener("keydown", start);
    window.removeEventListener("touchstart", start);
  };
  window.addEventListener("click", start);
  window.addEventListener("keydown", start);
  window.addEventListener("touchstart", start);
}

// ---------- Configurações (usadas pelo ícone fixo e pela página Settings) ----------

export function obterConfigSom(): AudioSettings {
  return settings;
}

export function atualizarConfigSom(patch: Partial<AudioSettings>): AudioSettings {
  settings = { ...settings, ...patch };
  salvarConfigSom(settings);

  Howler.mute(settings.muted);
  ambient.volume(settings.ambientVolume);
  [diceRoll, diceCritical, diceFail].forEach((s) => s.volume(settings.effectsVolume));

  if (settings.ambientEnabled) {
    iniciarAmbienteSeAtivado();
  } else {
    pararAmbiente();
  }

  return settings;
}