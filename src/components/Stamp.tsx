import type { CSSProperties } from "react";

interface StampProps {
  text: string;
  className?: string;
  rotate?: number; // graus, negativo inclina para a esquerda
  tone?: "blood" | "success"; // vermelho (padrão) ou verde, para resultados positivos
}

const TONE_CLASSES: Record<NonNullable<StampProps["tone"]>, string> = {
  blood: "border-blood/70 text-blood/85",
  success: "border-teal/70 text-teal",
};

/**
 * Carimbo de tinta, como os de arquivos confidenciais antigos.
 * Anima como se estivesse sendo "batido" no papel ao aparecer.
 * Use com moderação e apenas quando reforça uma informação real
 * (ex.: um status), não como decoração solta.
 */
export default function Stamp({ text, className = "", rotate = -6, tone = "blood" }: StampProps) {
  return (
    <div
      className={`stamp animate-stamp-in ${TONE_CLASSES[tone]} ${className}`}
      style={{ "--stamp-rotate": `${rotate}deg` } as CSSProperties}
    >
      {text}
    </div>
  );
}
