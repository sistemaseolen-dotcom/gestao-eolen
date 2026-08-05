"use client";

import { useState } from "react";
import Link from "next/link";
import type { SolicitacaoLookups } from "./lookups";

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

export default function SolicitacaoForm({
  action,
  lookups,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  lookups: SolicitacaoLookups;
  initial?: {
    status?: string | null;
    data?: string | null;
    solicitante_pessoa_id?: string | null;
    sigla?: string | null;
    obra?: string | null;
    descricao?: string | null;
    unidade?: string | null;
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
      <Field label="Status">
        <select name="status" defaultValue={initial?.status || "aguardando"} className={inputCls}>
          <option value="aguardando">Aguardando</option>
          <option value="aprovado">Aprovado</option>
          <option value="rejeitado">Rejeitado</option>
          <option value="convertido">Convertido</option>
        </select>
      </Field>

      <Field label="Data">
        <input type="date" name="data" defaultValue={initial?.data || ""} className={inputCls} />
      </Field>

      <Field label="Solicitante">
        <select name="solicitante_pessoa_id" defaultValue={initial?.solicitante_pessoa_id || ""} className={inputCls}>
          <option value="">-</option>
          {lookups.pessoas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Sigla">
        <input name="sigla" defaultValue={initial?.sigla || ""} className={inputCls} />
      </Field>

      <Field label="Obra">
        <input name="obra" defaultValue={initial?.obra || ""} className={inputCls} />
      </Field>

      <Field label="Unidade">
        <input name="unidade" defaultValue={initial?.unidade || ""} className={inputCls} />
      </Field>

      <div className="col-span-full">
        <Field label="Descrição">
          <textarea name="descricao" rows={3} defaultValue={initial?.descricao || ""} className={inputCls} />
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
        <Link href="/suprimentos/solicitacao" className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
