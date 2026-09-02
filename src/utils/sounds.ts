import { Howl } from "howler";

const diceRoll = new Howl({ src: ["/sounds/dice-roll.wav"] });
const diceCritical = new Howl({ src: ["/sounds/dice-critical.mp3"] });
const diceFail = new Howl({ src: ["/sounds/dice-fail.mp3"] });
const ambient = new Howl({
  src: ["/sounds/ambient-loop.mp3"],
  loop: true,
  volume: 0.3,
});

export const playDiceRoll = () => diceRoll.play();
export const playDiceCritical = () => diceCritical.play();
export const playDiceFail = () => diceFail.play();

export const playAmbient = () => ambient.play();
export const stopAmbient = () => ambient.stop();