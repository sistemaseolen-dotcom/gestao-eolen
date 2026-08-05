"use client";

import { useState } from "react";
import Link from "next/link";

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[#a7332a] focus:outline-none";

const MODULOS = [
  "Pessoas",
  "Empresas",
  "Equipes",
  "Veículos",
  "Despesas de Frota",
  "Estoque",
  "Compras",
  "Solicitação de Material",
  "Requisição de Material",
  "Patrimônio",
  "Outro",
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

export default function DocumentoForm({
  action,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  initial?: {
    modulo?: string | null;
    registro_id?: string | null;
    nome_arquivo?: string | null;
    storage_path?: string | null;
    data_upload?: string | null;
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
      <Field label="Módulo *">
        <select name="modulo" required defaultValue={initial?.modulo || ""} className={inputCls}>
          <option value="" disabled>
            Selecione...
          </option>
          {MODULOS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Data de upload">
        <input
          type="date"
          name="data_upload"
          defaultValue={(initial?.data_upload || new Date().toISOString()).slice(0, 10)}
          className={inputCls}
        />
      </Field>

      <Field label="Nome do arquivo *">
        <input name="nome_arquivo" required defaultValue={initial?.nome_arquivo || ""} className={inputCls} />
      </Field>

      <Field label="ID do registro relacionado (opcional)">
        <input name="registro_id" defaultValue={initial?.registro_id || ""} className={inputCls} />
      </Field>

      <div className="col-span-full">
        <Field label="Link / caminho do arquivo *">
          <input
            name="storage_path"
            required
            placeholder="https://..."
            defaultValue={initial?.storage_path || ""}
            className={inputCls}
          />
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
        <Link href="/cadastros/documentos" className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
