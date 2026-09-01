import { jsPDF } from "jspdf";
import type { Character } from "../types/character";
import { ATTRIBUTE_LABELS } from "../types/character";

// Marcadores que delimitam o bloco de dados embutido no PDF. Tudo que está
// entre eles é a ficha inteira em JSON, codificada em base64, quebrada em
// linhas curtas. Isso permite reabrir um PDF exportado pelo PROFANE e
// restaurar automaticamente todos os campos — inclusive em versões futuras
// da ficha, já que é o objeto Character completo, não um layout fixo.
const DATA_START = "===PROFANE_DATA_START===";
const DATA_END = "===PROFANE_DATA_END===";

const COLORS = {
  background: [18, 22, 28] as const,
  panel: [26, 32, 41] as const,
  border: [58, 69, 82] as const,
  parchment: [216, 203, 174] as const,
  parchment2: [183, 170, 138] as const,
  bone: [236, 228, 211] as const,
  blood: [181, 80, 47] as const,
  amber: [201, 162, 39] as const,
};

// ---------- CODIFICAÇÃO UNICODE-SAFE EM BASE64 ----------

function encodeBase64Unicode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function decodeBase64Unicode(base64: string): string {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function detectImageFormat(dataUrl: string): "PNG" | "JPEG" | "WEBP" | undefined {
  const match = /^data:image\/(png|jpe?g|webp)/i.exec(dataUrl);
  if (!match) return undefined;
  const type = match[1].toLowerCase();
  if (type === "png") return "PNG";
  if (type === "webp") return "WEBP";
  return "JPEG";
}

// ---------- EXPORTAÇÃO ----------

export function exportarFichaPDF(character: Character): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  let y = margin;

  function fillPage() {
    doc.setFillColor(...COLORS.background);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  }

  function ensureSpace(needed: number) {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      fillPage();
      y = margin;
    }
  }

  function sectionTitle(text: string) {
    ensureSpace(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.amber);
    doc.text(text.toUpperCase(), margin, y);
    doc.setDrawColor(...COLORS.border);
    doc.line(margin, y + 4, pageWidth - margin, y + 4);
    y += 20;
  }

  function label(text: string, x: number, yPos: number) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.parchment2);
    doc.text(text.toUpperCase(), x, yPos);
  }

  function value(text: string, x: number, yPos: number, size = 12) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...COLORS.bone);
    doc.text(text || "—", x, yPos);
  }

  fillPage();

  // Cabeçalho
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...COLORS.blood);
  doc.text("PROFANE", margin, y + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.parchment2);
  doc.text("Dossiê de investigação — Ficha de personagem", margin, y + 26);
  y += 50;

  // Foto (se houver)
  const photoSize = 70;
  const format = character.photo ? detectImageFormat(character.photo) : undefined;
  if (character.photo && format) {
    try {
      doc.addImage(character.photo, format, pageWidth - margin - photoSize, y - 34, photoSize, photoSize);
    } catch {
      // Se a imagem não puder ser lida (formato incomum), segue sem foto.
    }
  }

  // Informações básicas
  sectionTitle("Informações");
  label("Nome", margin, y);
  value(character.name, margin, y + 14, 14);
  label("Ocupação", margin + 260, y);
  value(character.occupation, margin + 260, y + 14);
  y += 34;
  label("Nível", margin, y);
  value(String(character.level), margin, y + 14);
  y += 34;
  if (character.profile) {
    label("Perfil", margin, y);
    const lines = doc.splitTextToSize(character.profile, pageWidth - margin * 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.bone);
    doc.text(lines, margin, y + 14);
    y += 14 + lines.length * 12 + 10;
  }
  y += 6;

  // Atributos
  sectionTitle("Atributos");
  const attrKeys = Object.keys(ATTRIBUTE_LABELS) as (keyof typeof ATTRIBUTE_LABELS)[];
  attrKeys.forEach((key, i) => {
    const x = margin + i * 170;
    label(ATTRIBUTE_LABELS[key], x, y);
    value(`d${character.attributes[key]}`, x, y + 16, 16);
  });
  y += 40;

  // Recursos
  sectionTitle("Recursos");
  label("PV — Pontos de Vida", margin, y);
  value(`${character.pv.current} / ${character.pv.max}`, margin, y + 16, 14);
  label("PD — Pontos de Determinação", margin + 260, y);
  value(`${character.pd.current} / ${character.pd.max}`, margin + 260, y + 16, 14);
  y += 38;

  // Perícias
  if (character.skills.length > 0) {
    sectionTitle("Perícias");
    const colWidth = (pageWidth - margin * 2) / 2;
    const mid = Math.ceil(character.skills.length / 2);
    const columns = [character.skills.slice(0, mid), character.skills.slice(mid)];
    const startY = y;
    let maxY = y;
    columns.forEach((col, colIndex) => {
      let colY = startY;
      col.forEach((skill) => {
        ensureSpace(14);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.bone);
        doc.text(skill.name, margin + colIndex * colWidth, colY);
        doc.setTextColor(...COLORS.parchment2);
        doc.text(`d${skill.dice}`, margin + colIndex * colWidth + colWidth - 24, colY);
        colY += 15;
      });
      maxY = Math.max(maxY, colY);
    });
    y = maxY + 10;
  }

  // Habilidades
  if (character.abilities.length > 0) {
    sectionTitle("Habilidades");
    character.abilities.forEach((ability) => {
      ensureSpace(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.bone);
      doc.text(ability.name, margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.parchment2);
      doc.text(`${ability.costPV} PV · ${ability.costPD} PD`, pageWidth - margin - 80, y);
      y += 13;
      if (ability.description) {
        const lines = doc.splitTextToSize(ability.description, pageWidth - margin * 2);
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.parchment);
        doc.text(lines, margin, y);
        y += lines.length * 11 + 8;
      } else {
        y += 6;
      }
    });
  }

  // Rodapé com data de geração
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.parchment2);
  doc.text(`Gerado em ${new Date(character.updatedAt || Date.now()).toLocaleString("pt-BR")}`, margin, pageHeight - 24);

  // ---------- PÁGINA DE DADOS (para reimportação) ----------
  doc.addPage();
  fillPage();
  y = margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.amber);
  doc.text("DADOS DO SISTEMA — NÃO EDITE ESTA PÁGINA", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.parchment2);
  const explanation = doc.splitTextToSize(
    "Este bloco contém a ficha completa codificada, usada apenas para restaurar os dados ao importar este PDF de volta no PROFANE. Não é necessário lê-lo manualmente.",
    pageWidth - margin * 2
  );
  doc.text(explanation, margin, y);
  y += explanation.length * 10 + 16;

  const json = JSON.stringify(character);
  const base64 = encodeBase64Unicode(json);
  const charsPerLine = 100;
  const chunks: string[] = [];
  for (let i = 0; i < base64.length; i += charsPerLine) {
    chunks.push(base64.slice(i, i + charsPerLine));
  }

  doc.setFont("courier", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.border);

  function writeDataLine(text: string) {
    ensureSpace(9);
    doc.text(text, margin, y);
    y += 9;
  }

  writeDataLine(DATA_START);
  chunks.forEach(writeDataLine);
  writeDataLine(DATA_END);

  const safeName = character.name.trim() ? character.name.trim().replace(/\s+/g, "_") : "ficha";
  doc.save(`${safeName}_profane.pdf`);
}

// ---------- IMPORTAÇÃO ----------

/**
 * Lê um PDF exportado pelo PROFANE e restaura a ficha completa.
 * Usa pdfjs-dist para extrair o texto de todas as páginas, localiza o
 * bloco entre os marcadores e decodifica o base64 de volta para o
 * objeto Character original.
 */
export async function importarFichaPDF(file: File): Promise<Character> {
  const pdfjsLib = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => ("str" in item ? item.str : "")).join("\n");
    fullText += pageText + "\n";
  }

  const startIndex = fullText.indexOf(DATA_START);
  const endIndex = fullText.indexOf(DATA_END);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error("Este PDF não contém dados do PROFANE reconhecíveis.");
  }

  const rawBlock = fullText.slice(startIndex + DATA_START.length, endIndex);
  const base64 = rawBlock.replace(/\s+/g, ""); // remove quebras de linha/espaços da extração
  const json = decodeBase64Unicode(base64);
  return JSON.parse(json) as Character;
}
