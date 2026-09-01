import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { Ability } from "../types/character";

interface AbilityListProps {
  abilities: Ability[];
  onChange: (abilities: Ability[]) => void;
}

const EMPTY_FORM = { name: "", description: "", costPV: 0, costPD: 0 };

export default function AbilityList({ abilities, onChange }: AbilityListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  function startAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(ability: Ability) {
    setForm({
      name: ability.name,
      description: ability.description,
      costPV: ability.costPV,
      costPD: ability.costPD,
    });
    setEditingId(ability.id);
    setShowForm(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    if (editingId) {
      onChange(abilities.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
    } else {
      onChange([...abilities, { id: crypto.randomUUID(), ...form }]);
    }
    setShowForm(false);
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Excluir a habilidade "${name || "sem nome"}"?`)) {
      onChange(abilities.filter((a) => a.id !== id));
    }
  }

  return (
    <div className="dossie-card p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="dossie-label">Habilidades</p>
        <button
          onClick={startAdd}
          className="flex items-center gap-1 rounded-sm border border-parchment/20 px-2 py-1 text-xs text-parchment2/80 hover:border-parchment/40"
        >
          <Plus size={14} /> Adicionar
        </button>
      </div>

      {abilities.length === 0 && !showForm && (
        <p className="text-sm text-parchment2/50">Nenhuma habilidade registrada.</p>
      )}

      <div className="space-y-2">
        {abilities.map((ability) => (
          <div key={ability.id} className="rounded-sm border border-parchment/10 bg-charcoal p-3">
            <div className="mb-1 flex items-start justify-between gap-2">
              <p className="font-display text-sm text-parchment">{ability.name}</p>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => startEdit(ability)} className="text-parchment2/60 hover:text-parchment">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(ability.id, ability.name)} className="text-parchment2/60 hover:text-blood">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {ability.description && (
              <p className="mb-2 text-sm text-parchment2/70">{ability.description}</p>
            )}
            <p className="dossie-label">
              Custo: {ability.costPV} PV · {ability.costPD} PD
            </p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="mt-4 rounded-sm border border-blood/40 bg-charcoal p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="dossie-label">{editingId ? "Editar habilidade" : "Nova habilidade"}</p>
            <button onClick={() => setShowForm(false)} className="text-parchment2/60 hover:text-parchment">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-2">
            <input
              className="dossie-input"
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
              className="dossie-input min-h-[60px] resize-none"
              placeholder="Descrição"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="dossie-label mb-1 block">Custo PV</label>
                <input
                  type="number"
                  className="dossie-input"
                  value={form.costPV}
                  onChange={(e) => setForm({ ...form, costPV: Number(e.target.value) || 0 })}
                />
              </div>
              <div className="flex-1">
                <label className="dossie-label mb-1 block">Custo PD</label>
                <input
                  type="number"
                  className="dossie-input"
                  value={form.costPD}
                  onChange={(e) => setForm({ ...form, costPD: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
            <button onClick={handleSave} className="w-full rounded-sm bg-blood py-2 text-sm text-bone">
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
