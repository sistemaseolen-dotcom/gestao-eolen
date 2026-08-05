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

export default function CompraForm({
  action,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  initial?: {
    numero_pedido?: string | null;
    situacao?: string | null;
    data?: string | null;
    previsao_entrega?: string | null;
    fornecedor?: string | null;
    valor_total?: number | null;
    marcadores?: string | null;
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
      <Field label="Número do pedido">
        <input name="numero_pedido" defaultValue={initial?.numero_pedido || ""} className={inputCls} />
      </Field>

      <Field label="Situação">
        <input name="situacao" defaultValue={initial?.situacao || ""} className={inputCls} />
      </Field>

      <Field label="Data">
        <input type="date" name="data" defaultValue={initial?.data || ""} className={inputCls} />
      </Field>

      <Field label="Previsão de entrega">
        <input type="date" name="previsao_entrega" defaultValue={initial?.previsao_entrega || ""} className={inputCls} />
      </Field>

      <Field label="Fornecedor">
        <input name="fornecedor" defaultValue={initial?.fornecedor || ""} className={inputCls} />
      </Field>

      <Field label="Valor total">
        <input type="number" step="0.01" name="valor_total" defaultValue={initial?.valor_total ?? ""} className={inputCls} />
      </Field>

      <div className="col-span-full">
        <Field label="Marcadores">
          <input name="marcadores" defaultValue={initial?.marcadores || ""} className={inputCls} />
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
        <Link href="/suprimentos/compras" className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
