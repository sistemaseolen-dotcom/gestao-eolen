"use client";

import { useState } from "react";
import Link from "next/link";

type EmpresaValues = {
  cnpj?: string | null;
  razao_social?: string | null;
  nome_fantasia?: string | null;
  porte?: string | null;
  status?: boolean | null;
  telefone?: string | null;
  email?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  nome_responsavel?: string | null;
  cnae_principal?: string | null;
  cnae_secundario?: string | null;
  natureza_juridica?: string | null;
  situacao_cadastral?: string | null;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[#a7332a] focus:outline-none";

export default function EmpresaForm({
  action,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  initial?: EmpresaValues;
  submitLabel: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={action}
      onSubmit={() => setPending(true)}
      className="grid max-w-4xl grid-cols-1 gap-4 rounded-lg border border-neutral-200 bg-white p-6 sm:grid-cols-2"
    >
      <Field label="Razão social *">
        <input name="razao_social" required defaultValue={initial?.razao_social || ""} className={inputCls} />
      </Field>
      <Field label="CNPJ *">
        <input name="cnpj" required defaultValue={initial?.cnpj || ""} className={inputCls} />
      </Field>

      <Field label="Nome fantasia">
        <input name="nome_fantasia" defaultValue={initial?.nome_fantasia || ""} className={inputCls} />
      </Field>
      <Field label="Porte">
        <input name="porte" defaultValue={initial?.porte || ""} className={inputCls} />
      </Field>

      <Field label="Status">
        <select name="status" defaultValue={String(initial?.status ?? true)} className={inputCls}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </Field>
      <Field label="Responsável">
        <input name="nome_responsavel" defaultValue={initial?.nome_responsavel || ""} className={inputCls} />
      </Field>

      <Field label="Telefone">
        <input name="telefone" defaultValue={initial?.telefone || ""} className={inputCls} />
      </Field>
      <Field label="E-mail">
        <input name="email" defaultValue={initial?.email || ""} className={inputCls} />
      </Field>

      <Field label="CEP">
        <input name="cep" defaultValue={initial?.cep || ""} className={inputCls} />
      </Field>
      <Field label="Cidade / UF">
        <div className="flex gap-2">
          <input name="cidade" defaultValue={initial?.cidade || ""} className={inputCls} placeholder="Cidade" />
          <input name="uf" defaultValue={initial?.uf || ""} className={`${inputCls} w-20`} placeholder="UF" />
        </div>
      </Field>

      <Field label="Logradouro">
        <input name="logradouro" defaultValue={initial?.logradouro || ""} className={inputCls} />
      </Field>
      <Field label="Número / Complemento">
        <div className="flex gap-2">
          <input name="numero" defaultValue={initial?.numero || ""} className={inputCls} placeholder="Número" />
          <input name="complemento" defaultValue={initial?.complemento || ""} className={inputCls} placeholder="Complemento" />
        </div>
      </Field>

      <Field label="Bairro">
        <input name="bairro" defaultValue={initial?.bairro || ""} className={inputCls} />
      </Field>

      <Field label="Situação cadastral">
        <input name="situacao_cadastral" defaultValue={initial?.situacao_cadastral || ""} className={inputCls} />
      </Field>
      <Field label="Natureza jurídica">
        <input name="natureza_juridica" defaultValue={initial?.natureza_juridica || ""} className={inputCls} />
      </Field>

      <Field label="CNAE principal">
        <input name="cnae_principal" defaultValue={initial?.cnae_principal || ""} className={inputCls} />
      </Field>
      <Field label="CNAE secundário">
        <input name="cnae_secundario" defaultValue={initial?.cnae_secundario || ""} className={inputCls} />
      </Field>

      <div className="col-span-full mt-2 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[#a7332a] px-5 py-2 text-sm font-medium text-white hover:bg-[#8c2a23] disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        <Link
          href="/cadastros/empresas"
          className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
