"use client";

import { useState } from "react";
import Link from "next/link";
import type { PatrimonioLookups } from "./lookups";

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

export default function PatrimonioForm({
  action,
  lookups,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  lookups: PatrimonioLookups;
  initial?: {
    tipo?: string | null;
    modelo?: string | null;
    numero_serie?: string | null;
    codigo_patrimonio?: string | null;
    valor?: number | null;
    status?: string | null;
    pessoa_id?: string | null;
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
      <Field label="Tipo">
        <input name="tipo" defaultValue={initial?.tipo || ""} className={inputCls} />
      </Field>

      <Field label="Modelo">
        <input name="modelo" defaultValue={initial?.modelo || ""} className={inputCls} />
      </Field>

      <Field label="Número de série">
        <input name="numero_serie" defaultValue={initial?.numero_serie || ""} className={inputCls} />
      </Field>

      <Field label="Código de patrimônio">
        <input name="codigo_patrimonio" defaultValue={initial?.codigo_patrimonio || ""} className={inputCls} />
      </Field>

      <Field label="Valor">
        <input type="number" step="0.01" name="valor" defaultValue={initial?.valor ?? ""} className={inputCls} />
      </Field>

      <Field label="Status">
        <input name="status" defaultValue={initial?.status || ""} className={inputCls} />
      </Field>

      <div className="col-span-full">
        <Field label="Responsável (pessoa)">
          <select name="pessoa_id" defaultValue={initial?.pessoa_id || ""} className={inputCls}>
            <option value="">-</option>
            {lookups.pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
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
        <Link href="/suprimentos/patrimonio" className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
