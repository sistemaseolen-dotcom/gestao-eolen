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
  cpf?: string | null;
  rg?: string | null;
  orgao_emissor?: string | null;
  data_emissao_rg?: string | null;
  data_nascimento?: string | null;
  sexo?: string | null;
  cor?: string | null;
  estado_civil?: string | null;
  naturalidade?: string | null;
  nacionalidade?: string | null;
  nome_pai?: string | null;
  nome_mae?: string | null;
  numero_filhos?: string | null;
  cep?: string | null;
  endereco?: string | null;
  numero_endereco?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  municipio?: string | null;
  uf_endereco?: string | null;
  titulo_eleitor?: string | null;
  pis?: string | null;
  ctps?: string | null;
  data_ctps?: string | null;
  reservista?: string | null;
  cnh?: string | null;
  data_validade_cnh?: string | null;
  categoria_cnh?: string | null;
  escolaridade?: string | null;
  banco?: string | null;
  agencia?: string | null;
  salario_bruto?: number | null;
  valor_hora?: number | null;
  mei?: string | null;
  cbo?: string | null;
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

      <div className="col-span-full mt-4 border-t border-neutral-200 pt-4 text-sm font-semibold text-neutral-700">
        Dados pessoais
      </div>

      <Field label="CPF">
        <input name="cpf" defaultValue={initial?.cpf || ""} className={inputCls} />
      </Field>

      <Field label="RG">
        <input name="rg" defaultValue={initial?.rg || ""} className={inputCls} />
      </Field>

      <Field label="Órgão emissor">
        <input name="orgao_emissor" defaultValue={initial?.orgao_emissor || ""} className={inputCls} />
      </Field>

      <Field label="Data de emissão (RG)">
        <input type="date" name="data_emissao_rg" defaultValue={initial?.data_emissao_rg || ""} className={inputCls} />
      </Field>

      <Field label="Data de nascimento">
        <input type="date" name="data_nascimento" defaultValue={initial?.data_nascimento || ""} className={inputCls} />
      </Field>

      <Field label="Sexo">
        <input name="sexo" defaultValue={initial?.sexo || ""} className={inputCls} />
      </Field>

      <Field label="Cor">
        <input name="cor" defaultValue={initial?.cor || ""} className={inputCls} />
      </Field>

      <Field label="Estado civil">
        <input name="estado_civil" defaultValue={initial?.estado_civil || ""} className={inputCls} />
      </Field>

      <Field label="Naturalidade">
        <input name="naturalidade" defaultValue={initial?.naturalidade || ""} className={inputCls} />
      </Field>

      <Field label="Nacionalidade">
        <input name="nacionalidade" defaultValue={initial?.nacionalidade || ""} className={inputCls} />
      </Field>

      <Field label="Nome do pai">
        <input name="nome_pai" defaultValue={initial?.nome_pai || ""} className={inputCls} />
      </Field>

      <Field label="Nome da mãe">
        <input name="nome_mae" defaultValue={initial?.nome_mae || ""} className={inputCls} />
      </Field>

      <Field label="Nº de filhos">
        <input name="numero_filhos" defaultValue={initial?.numero_filhos || ""} className={inputCls} />
      </Field>

      <Field label="Escolaridade">
        <input name="escolaridade" defaultValue={initial?.escolaridade || ""} className={inputCls} />
      </Field>

      <Field label="CBO">
        <input name="cbo" defaultValue={initial?.cbo || ""} className={inputCls} />
      </Field>

      <div className="col-span-full mt-4 border-t border-neutral-200 pt-4 text-sm font-semibold text-neutral-700">
        Endereço
      </div>

      <Field label="CEP">
        <input name="cep" defaultValue={initial?.cep || ""} className={inputCls} />
      </Field>

      <Field label="Endereço">
        <input name="endereco" defaultValue={initial?.endereco || ""} className={inputCls} />
      </Field>

      <Field label="Número">
        <input name="numero_endereco" defaultValue={initial?.numero_endereco || ""} className={inputCls} />
      </Field>

      <Field label="Complemento">
        <input name="complemento" defaultValue={initial?.complemento || ""} className={inputCls} />
      </Field>

      <Field label="Bairro">
        <input name="bairro" defaultValue={initial?.bairro || ""} className={inputCls} />
      </Field>

      <Field label="Município">
        <input name="municipio" defaultValue={initial?.municipio || ""} className={inputCls} />
      </Field>

      <Field label="UF">
        <input name="uf_endereco" defaultValue={initial?.uf_endereco || ""} className={inputCls} />
      </Field>

      <div className="col-span-full mt-4 border-t border-neutral-200 pt-4 text-sm font-semibold text-neutral-700">
        Documentos e habilitação
      </div>

      <Field label="Título de eleitor">
        <input name="titulo_eleitor" defaultValue={initial?.titulo_eleitor || ""} className={inputCls} />
      </Field>

      <Field label="PIS">
        <input name="pis" defaultValue={initial?.pis || ""} className={inputCls} />
      </Field>

      <Field label="CTPS">
        <input name="ctps" defaultValue={initial?.ctps || ""} className={inputCls} />
      </Field>

      <Field label="Data CTPS">
        <input type="date" name="data_ctps" defaultValue={initial?.data_ctps || ""} className={inputCls} />
      </Field>

      <Field label="Reservista">
        <input name="reservista" defaultValue={initial?.reservista || ""} className={inputCls} />
      </Field>

      <Field label="CNH">
        <input name="cnh" defaultValue={initial?.cnh || ""} className={inputCls} />
      </Field>

      <Field label="Categoria CNH">
        <input name="categoria_cnh" defaultValue={initial?.categoria_cnh || ""} className={inputCls} />
      </Field>

      <Field label="Validade CNH">
        <input type="date" name="data_validade_cnh" defaultValue={initial?.data_validade_cnh || ""} className={inputCls} />
      </Field>

      <div className="col-span-full mt-4 border-t border-neutral-200 pt-4 text-sm font-semibold text-neutral-700">
        Dados bancários
      </div>

      <Field label="MEI">
        <input name="mei" defaultValue={initial?.mei || ""} className={inputCls} />
      </Field>

      <Field label="Banco">
        <input name="banco" defaultValue={initial?.banco || ""} className={inputCls} />
      </Field>

      <Field label="Agência">
        <input name="agencia" defaultValue={initial?.agencia || ""} className={inputCls} />
      </Field>

      <Field label="Salário bruto">
        <input type="number" step="0.01" name="salario_bruto" defaultValue={initial?.salario_bruto ?? ""} className={inputCls} />
      </Field>

      <Field label="Valor hora">
        <input type="number" step="0.01" name="valor_hora" defaultValue={initial?.valor_hora ?? ""} className={inputCls} />
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
