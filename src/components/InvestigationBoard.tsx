import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { InvestigationBoard, Evidence, Suspect, Clue } from "../types/investigation";
import EvidenceCard from "./EvidenceCard";
import SuspectCard from "./SuspectCard";
import ClueCard from "./ClueCard";

interface InvestigationBoardProps {
  board: InvestigationBoard;
  onChange: (board: InvestigationBoard) => void;
}

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function InvestigationBoardView({ board, onChange }: InvestigationBoardProps) {
  return (
    <div className="space-y-8">
      <EvidenceSection
        items={board.evidence}
        onChange={(evidence) => onChange({ ...board, evidence })}
      />
      <SuspectSection items={board.suspects} onChange={(suspects) => onChange({ ...board, suspects })} />
      <ClueSection items={board.clues} onChange={(clues) => onChange({ ...board, clues })} />
    </div>
  );
}

// ---------- EVIDÊNCIAS ----------

function EvidenceSection({ items, onChange }: { items: Evidence[]; onChange: (v: Evidence[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", image: undefined as string | undefined });

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: await readImageAsDataUrl(file) });
  }

  function handleAdd() {
    if (!form.title.trim()) return;
    onChange([{ id: crypto.randomUUID(), createdAt: Date.now(), ...form }, ...items]);
    setForm({ title: "", description: "", category: "", image: undefined });
    setShowForm(false);
  }

  function updateItem(id: string, updates: Partial<Evidence>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }

  return (
    <section>
      <SectionHeader title="Evidências" onAdd={() => setShowForm(true)} />
      {showForm && (
        <AddForm onCancel={() => setShowForm(false)} onSave={handleAdd}>
          <input
            className="dossie-input"
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="dossie-input"
            placeholder="Categoria"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <textarea
            className="dossie-input min-h-[60px] resize-none"
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input type="file" accept="image/*" onChange={handleImage} className="text-xs text-parchment2/70" />
        </AddForm>
      )}
      {items.length === 0 && !showForm ? (
        <EmptyHint text="Nenhuma evidência registrada." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((ev) => (
            <EvidenceCard
              key={ev.id}
              evidence={ev}
              onChange={(updates) => updateItem(ev.id, updates)}
              onDelete={() => onChange(items.filter((i) => i.id !== ev.id))}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ---------- SUSPEITOS ----------

function SuspectSection({ items, onChange }: { items: Suspect[]; onChange: (v: Suspect[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", notes: "", photo: undefined as string | undefined });

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, photo: await readImageAsDataUrl(file) });
  }

  function handleAdd() {
    if (!form.name.trim()) return;
    onChange([{ id: crypto.randomUUID(), createdAt: Date.now(), ...form }, ...items]);
    setForm({ name: "", description: "", notes: "", photo: undefined });
    setShowForm(false);
  }

  function updateItem(id: string, updates: Partial<Suspect>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }

  return (
    <section>
      <SectionHeader title="Suspeitos" onAdd={() => setShowForm(true)} />
      {showForm && (
        <AddForm onCancel={() => setShowForm(false)} onSave={handleAdd}>
          <input
            className="dossie-input"
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="dossie-input min-h-[50px] resize-none"
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <textarea
            className="dossie-input min-h-[50px] resize-none"
            placeholder="Notas"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <input type="file" accept="image/*" onChange={handlePhoto} className="text-xs text-parchment2/70" />
        </AddForm>
      )}
      {items.length === 0 && !showForm ? (
        <EmptyHint text="Nenhum suspeito registrado." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {items.map((s) => (
            <SuspectCard
              key={s.id}
              suspect={s}
              onChange={(updates) => updateItem(s.id, updates)}
              onDelete={() => onChange(items.filter((i) => i.id !== s.id))}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ---------- PISTAS ----------

function ClueSection({ items, onChange }: { items: Clue[]; onChange: (v: Clue[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  function handleAdd() {
    if (!form.title.trim()) return;
    const clue: Clue = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      title: form.title,
      description: form.description,
      status: "oculta",
    };
    onChange([clue, ...items]);
    setForm({ title: "", description: "" });
    setShowForm(false);
  }

  function updateItem(id: string, updates: Partial<Clue>) {
    onChange(items.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }

  return (
    <section>
      <SectionHeader title="Pistas" onAdd={() => setShowForm(true)} />
      {showForm && (
        <AddForm onCancel={() => setShowForm(false)} onSave={handleAdd}>
          <input
            className="dossie-input"
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="dossie-input min-h-[50px] resize-none"
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </AddForm>
      )}
      {items.length === 0 && !showForm ? (
        <EmptyHint text="Nenhuma pista registrada." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {items.map((c) => (
            <ClueCard
              key={c.id}
              clue={c}
              onChange={(updates) => updateItem(c.id, updates)}
              onDelete={() => onChange(items.filter((i) => i.id !== c.id))}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ---------- HELPERS DE UI COMPARTILHADOS ----------

function SectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <p className="dossie-label text-sm">{title}</p>
      <button
        onClick={onAdd}
        className="flex items-center gap-1 rounded-sm border border-parchment/20 px-2 py-1 text-xs text-parchment2/80 hover:border-parchment/40"
      >
        <Plus size={14} /> Adicionar
      </button>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <p className="text-sm text-parchment2/50">{text}</p>;
}

function AddForm({
  children,
  onSave,
  onCancel,
}: {
  children: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mb-3 rounded-sm border border-blood/40 bg-charcoal2 p-3">
      <div className="mb-2 flex justify-end">
        <button onClick={onCancel} className="text-parchment2/60 hover:text-parchment">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-2">{children}</div>
      <button onClick={onSave} className="mt-2 w-full rounded-sm bg-blood py-2 text-sm text-bone">
        Salvar
      </button>
    </div>
  );
}
