"use client";

import { useState } from "react";
import Link from "next/link";
import type { EquipeLookups } from "./lookups";

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[#a7332a] focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

export default function EquipeForm({
  action,
  lookups,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  lookups: EquipeLookups;
  initial?: {
    nome?: string | null;
    status?: boolean | null;
    regional?: string | null;
    team_leader_id?: string | null;
    projeto_id?: string | null;
    operadora_id?: string | null;
  };
  submitLabel: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={action}
      onSubmit={() => setPending(true)}
      className="grid max-w-2xl grid-cols-1 gap-4 rounded-lg border border-neutral-200 bg-white p-6 sm:grid-cols-2"
    >
      <Field label="Nome da equipe *">
        <input name="nome" required defaultValue={initial?.nome || ""} className={inputCls} />
      </Field>

      <Field label="Status">
        <select name="status" defaultValue={String(initial?.status ?? true)} className={inputCls}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </Field>

      <Field label="Team líder">
        <select name="team_leader_id" defaultValue={initial?.team_leader_id || ""} className={inputCls}>
          <option value="">-</option>
          {lookups.pessoas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Regional">
        <input name="regional" defaultValue={initial?.regional || ""} className={inputCls} />
      </Field>

      <Field label="Projeto">
        <select name="projeto_id" defaultValue={initial?.projeto_id || ""} className={inputCls}>
          <option value="">-</option>
          {lookups.projetos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Operadora">
        <select name="operadora_id" defaultValue={initial?.operadora_id || ""} className={inputCls}>
          <option value="">-</option>
          {lookups.operadoras.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nome}
            </option>
          ))}
        </select>
      </Field>

      <div className="col-span-full mt-2 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[#a7332a] px-5 py-2 text-sm font-medium text-white hover:bg-[#8c2a23] disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        <Link href="/cadastros/equipes" className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
