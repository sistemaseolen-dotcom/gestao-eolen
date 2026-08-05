"use client";

import { useState } from "react";
import Link from "next/link";
import type { VeiculoLookups } from "./lookups";

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

export default function VeiculoForm({
  action,
  lookups,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  lookups: VeiculoLookups;
  initial?: {
    contrato?: string | null;
    data_contrato?: string | null;
    locadora_id?: string | null;
    placa?: string | null;
    condutor_pessoa_id?: string | null;
    status?: string | null;
    km_retirada?: number | null;
    km_atual?: number | null;
    km_revisao_realizada?: number | null;
    proxima_revisao_km?: number | null;
    km_devolucao?: number | null;
    observacao?: string | null;
    projeto_id?: string | null;
    regional?: string | null;
    data_retirada?: string | null;
    data_devolucao?: string | null;
  };
  submitLabel: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={action}
      onSubmit={() => setPending(true)}
      className="grid max-w-4xl grid-cols-1 gap-4 rounded-lg border border-neutral-200 bg-white p-6 sm:grid-cols-3"
    >
      <Field label="Placa *">
        <input name="placa" required defaultValue={initial?.placa || ""} className={inputCls} />
      </Field>

      <Field label="Status">
        <input name="status" defaultValue={initial?.status || ""} className={inputCls} />
      </Field>

      <Field label="Regional">
        <input name="regional" defaultValue={initial?.regional || ""} className={inputCls} />
      </Field>

      <Field label="Contrato">
        <input name="contrato" defaultValue={initial?.contrato || ""} className={inputCls} />
      </Field>

      <Field label="Data do contrato">
        <input type="date" name="data_contrato" defaultValue={initial?.data_contrato || ""} className={inputCls} />
      </Field>

      <Field label="Locadora">
        <select name="locadora_id" defaultValue={initial?.locadora_id || ""} className={inputCls}>
          <option value="">-</option>
          {lookups.locadoras.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nome}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Condutor">
        <select name="condutor_pessoa_id" defaultValue={initial?.condutor_pessoa_id || ""} className={inputCls}>
          <option value="">-</option>
          {lookups.pessoas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
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

      <Field label="Data de retirada">
        <input type="date" name="data_retirada" defaultValue={initial?.data_retirada || ""} className={inputCls} />
      </Field>

      <Field label="Km retirada">
        <input type="number" step="0.01" name="km_retirada" defaultValue={initial?.km_retirada ?? ""} className={inputCls} />
      </Field>

      <Field label="Km atual">
        <input type="number" step="0.01" name="km_atual" defaultValue={initial?.km_atual ?? ""} className={inputCls} />
      </Field>

      <Field label="Km revisão realizada">
        <input type="number" step="0.01" name="km_revisao_realizada" defaultValue={initial?.km_revisao_realizada ?? ""} className={inputCls} />
      </Field>

      <Field label="Próxima revisão (km)">
        <input type="number" step="0.01" name="proxima_revisao_km" defaultValue={initial?.proxima_revisao_km ?? ""} className={inputCls} />
      </Field>

      <Field label="Data de devolução">
        <input type="date" name="data_devolucao" defaultValue={initial?.data_devolucao || ""} className={inputCls} />
      </Field>

      <Field label="Km devolução">
        <input type="number" step="0.01" name="km_devolucao" defaultValue={initial?.km_devolucao ?? ""} className={inputCls} />
      </Field>

      <div className="col-span-full">
        <Field label="Observação">
          <textarea name="observacao" rows={3} defaultValue={initial?.observacao || ""} className={inputCls} />
        </Field>
      </div>

      <div className="col-span-full mt-2 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[#a7332a] px-5 py-2 text-sm font-medium text-white hover:bg-[#8c2a23] disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        <Link href="/gestao-frotas/veiculos" className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
