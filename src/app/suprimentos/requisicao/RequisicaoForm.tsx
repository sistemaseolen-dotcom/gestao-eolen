"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProdutoLookups } from "./lookups";

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

export default function RequisicaoForm({
  action,
  lookups,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  lookups: ProdutoLookups;
  initial?: {
    produto_id?: string | null;
    codigo?: string | null;
    sku?: string | null;
    estoque_fisico?: number | null;
    unidade?: string | null;
    localizacao?: string | null;
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
      <Field label="Produto">
        <select name="produto_id" defaultValue={initial?.produto_id || ""} className={inputCls}>
          <option value="">-</option>
          {lookups.produtos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Código">
        <input name="codigo" defaultValue={initial?.codigo || ""} className={inputCls} />
      </Field>

      <Field label="SKU">
        <input name="sku" defaultValue={initial?.sku || ""} className={inputCls} />
      </Field>

      <Field label="Estoque físico">
        <input type="number" step="0.01" name="estoque_fisico" defaultValue={initial?.estoque_fisico ?? ""} className={inputCls} />
      </Field>

      <Field label="Unidade">
        <input name="unidade" defaultValue={initial?.unidade || ""} className={inputCls} />
      </Field>

      <Field label="Localização">
        <input name="localizacao" defaultValue={initial?.localizacao || ""} className={inputCls} />
      </Field>

      <div className="col-span-full mt-2 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[#a7332a] px-5 py-2 text-sm font-medium text-white hover:bg-[#8c2a23] disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        <Link href="/suprimentos/requisicao" className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
