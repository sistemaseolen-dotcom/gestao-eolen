"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function DespesaForm({
  action,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  initial?: {
    placa?: string | null;
    veiculo_descricao?: string | null;
    empresa_descricao?: string | null;
    data_lancamento?: string | null;
    valor_total?: number | null;
    descricao?: string | null;
    observacao?: string | null;
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
      <Field label="Placa">
        <input name="placa" defaultValue={initial?.placa || ""} className={inputCls} />
      </Field>

      <Field label="Data de lançamento">
        <input type="date" name="data_lancamento" defaultValue={initial?.data_lancamento || ""} className={inputCls} />
      </Field>

      <Field label="Veículo (descrição)">
        <input name="veiculo_descricao" defaultValue={initial?.veiculo_descricao || ""} className={inputCls} />
      </Field>

      <Field label="Empresa (descrição)">
        <input name="empresa_descricao" defaultValue={initial?.empresa_descricao || ""} className={inputCls} />
      </Field>

      <Field label="Valor total">
        <input type="number" step="0.01" name="valor_total" defaultValue={initial?.valor_total ?? ""} className={inputCls} />
      </Field>

      <div className="col-span-full">
        <Field label="Descrição">
          <input name="descricao" defaultValue={initial?.descricao || ""} className={inputCls} />
        </Field>
      </div>

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
        <Link href="/gestao-frotas/despesas" className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
