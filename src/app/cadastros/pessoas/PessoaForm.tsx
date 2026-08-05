"use client";

import { useState } from "react";
import Link from "next/link";
import type { PessoaLookups } from "./lookups";

type PessoaValues = {
  nome?: string | null;
  tipo_contratacao?: string | null;
  status?: string | null;
  regional?: string | null;
  estado_servico?: string | null;
  numero_registro?: string | null;
  matricula_esocial?: string | null;
  data_admissao?: string | null;
  data_demissao?: string | null;
  empresa_id?: string | null;
  cargo_id?: string | null;
  cargo_aso_id?: string | null;
  projeto_id?: string | null;
  operadora_id?: string | null;
  equipe_id?: string | null;
  email_particular?: string | null;
  telefone_particular?: string | null;
  email_corporativo?: string | null;
  telefone_corporativo?: string | null;
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

export default function PessoaForm({
  action,
  lookups,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  lookups: PessoaLookups;
  initial?: PessoaValues;
  submitLabel: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={action}
      onSubmit={() => setPending(true)}
      className="grid max-w-4xl grid-cols-1 gap-4 rounded-lg border border-neutral-200 bg-white p-6 sm:grid-cols-2"
    >
      <Field label="Nome *">
        <input name="nome" required defaultValue={initial?.nome || ""} className={inputCls} />
      </Field>

      <Field label="Status">
        <select name="status" defaultValue={initial?.status || "ativo"} className={inputCls}>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </Field>

      <Field label="Tipo de contratação">
        <input name="tipo_contratacao" defaultValue={initial?.tipo_contratacao || ""} className={inputCls} />
      </Field>

      <Field label="Regional">
        <input name="regional" defaultValue={initial?.regional || ""} className={inputCls} />
      </Field>

      <Field label="Estado de serviço (UF)">
        <input name="estado_servico" defaultValue={initial?.estado_servico || ""} className={inputCls} />
      </Field>

      <Field label="Nº de registro">
        <input name="numero_registro" defaultValue={initial?.numero_registro || ""} className={inputCls} />
      </Field>

      <Field label="Matrícula e-Social">
        <input name="matricula_esocial" defaultValue={initial?.matricula_esocial || ""} className={inputCls} />
      </Field>

      <Field label="Empresa">
        <select name="empresa_id" defaultValue={initial?.empresa_id || ""} className={inputCls}>
          <option value="">-</option>
          {lookups.empresas.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome_fantasia || e.razao_social}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Cargo">
        <select name="cargo_id" defaultValue={initial?.cargo_id || ""} className={inputCls}>
          <option value="">-</option>
          {lookups.cargos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Cargo ASO">
        <select name="cargo_aso_id" defaultValue={initial?.cargo_aso_id || ""} className={inputCls}>
          <option value="">-</option>
          {lookups.cargosAso.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
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

      <Field label="Equipe">
        <select name="equipe_id" defaultValue={initial?.equipe_id || ""} className={inputCls}>
          <option value="">-</option>
          {lookups.equipes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Data de admissão">
        <input type="date" name="data_admissao" defaultValue={initial?.data_admissao || ""} className={inputCls} />
      </Field>

      <Field label="Data de demissão">
        <input type="date" name="data_demissao" defaultValue={initial?.data_demissao || ""} className={inputCls} />
      </Field>

      <Field label="E-mail particular">
        <input name="email_particular" defaultValue={initial?.email_particular || ""} className={inputCls} />
      </Field>

      <Field label="Telefone particular">
        <input name="telefone_particular" defaultValue={initial?.telefone_particular || ""} className={inputCls} />
      </Field>

      <Field label="E-mail corporativo">
        <input name="email_corporativo" defaultValue={initial?.email_corporativo || ""} className={inputCls} />
      </Field>

      <Field label="Telefone corporativo">
        <input name="telefone_corporativo" defaultValue={initial?.telefone_corporativo || ""} className={inputCls} />
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
          href="/cadastros/pessoas"
          className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
