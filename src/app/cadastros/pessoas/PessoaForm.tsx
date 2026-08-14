"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PessoaLookups } from "./lookups";
import { TREINAMENTO_STATUS, TREINAMENTO_TIPOS } from "./lookups";

export type Treinamento = {
  id: string;
  tipo: string | null;
  status: string | null;
  data_emissao: string | null;
  data_vencimento: string | null;
};

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
  cnpj_vinculado?: string | null;
  cargo_id?: string | null;
  cargo_aso_id?: string | null;
  projeto_id?: string | null;
  operadora_id?: string | null;
  equipe_id?: string | null;
  coordenador?: string | null;
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
  tipo_curso?: string | null;
  observacao?: string | null;
  banco?: string | null;
  agencia?: string | null;
  salario_bruto?: number | null;
  valor_hora?: number | null;
  mei?: string | null;
  cbo?: string | null;
  // Treinamentos e Exames
  id_ericsson?: string | null;
  id_huawei?: string | null;
  id_zte?: string | null;
  id_isignum?: string | null;
  senha_huawei?: string | null;
  senha_zte?: string | null;
  data_cadastro?: string | null;
  reativacao?: string | null;
  // Informação adicional
  telefone_vivo?: string | null;
  imei_aparelho?: string | null;
  matricula_vivo?: string | null;
  permissao_tim?: string | null;
  numero_contrato?: string | null;
  validade_contrato?: string | null;
  status_vivo?: string | null;
  email_va_access?: string | null;
  observacao_matricula?: string | null;
};

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className || ""}`}>
      <span className="mb-1 block text-xs font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[#a7332a] focus:outline-none";
const readonlyCls =
  "w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600";
const gridCls = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";

const TABS = ["DADOS GERAIS", "TREINAMENTOS E EXAMES", "INFORMAÇÃO ADICIONAL"] as const;
type Tab = (typeof TABS)[number];

export default function PessoaForm({
  action,
  lookups,
  initial,
  submitLabel,
  pessoaId,
  treinamentos,
  addTreinamentoAction,
  deleteTreinamentoAction,
}: {
  action: (formData: FormData) => void;
  lookups: PessoaLookups;
  initial?: PessoaValues;
  submitLabel: string;
  pessoaId?: string;
  treinamentos?: Treinamento[];
  addTreinamentoAction?: (formData: FormData) => void;
  deleteTreinamentoAction?: (formData: FormData) => void;
}) {
  const [pending, setPending] = useState(false);
  const [tab, setTab] = useState<Tab>("DADOS GERAIS");
  const [equipeId, setEquipeId] = useState(initial?.equipe_id || "");

  const liderNome = useMemo(
    () => lookups.equipes.find((e) => e.id === equipeId)?.lider_nome || "",
    [equipeId, lookups.equipes]
  );

  return (
    <div className="max-w-6xl rounded-lg border border-neutral-200 bg-white">
      <div className="flex border-b border-neutral-200 px-4">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-3 text-xs font-semibold tracking-wide ${
              tab === t
                ? "border-[#a7332a] text-[#a7332a]"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <form action={action} onSubmit={() => setPending(true)} className="p-6">
        {/* ================= DADOS GERAIS ================= */}
        <div className={tab === "DADOS GERAIS" ? "space-y-4" : "hidden"}>
          <div className={gridCls}>
            <Field label="Nome Completo *" className="lg:col-span-2">
              <input name="nome" required defaultValue={initial?.nome || ""} className={inputCls} />
            </Field>
            <Field label="Tipo Contratação">
              <input name="tipo_contratacao" defaultValue={initial?.tipo_contratacao || ""} className={inputCls} />
            </Field>
            <Field label="Estado de Serviço">
              <input name="estado_servico" defaultValue={initial?.estado_servico || ""} className={inputCls} />
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="Regional">
              <input name="regional" defaultValue={initial?.regional || ""} className={inputCls} />
            </Field>
            <Field label="Projeto">
              <select name="projeto_id" defaultValue={initial?.projeto_id || ""} className={inputCls}>
                <option value="">-</option>
                {lookups.projetos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </Field>
            <Field label="Operadora">
              <select name="operadora_id" defaultValue={initial?.operadora_id || ""} className={inputCls}>
                <option value="">-</option>
                {lookups.operadoras.map((o) => (
                  <option key={o.id} value={o.id}>{o.nome}</option>
                ))}
              </select>
            </Field>
            <Field label="Equipe">
              <select
                name="equipe_id"
                value={equipeId}
                onChange={(e) => setEquipeId(e.target.value)}
                className={inputCls}
              >
                <option value="">-</option>
                {lookups.equipes.map((e) => (
                  <option key={e.id} value={e.id}>{e.nome}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="Líder">
              <input readOnly value={liderNome} className={readonlyCls} tabIndex={-1} />
            </Field>
            <Field label="Nº Registro">
              <input name="numero_registro" defaultValue={initial?.numero_registro || ""} className={inputCls} />
            </Field>
            <Field label="Data Admissão">
              <input type="date" name="data_admissao" defaultValue={initial?.data_admissao || ""} className={inputCls} />
            </Field>
            <Field label="Data Demissão">
              <input type="date" name="data_demissao" defaultValue={initial?.data_demissao || ""} className={inputCls} />
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="Status">
              <select name="status" defaultValue={initial?.status || "ATIVO"} className={inputCls}>
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
                <option value="CRESCIMENTO">CRESCIMENTO</option>
                <option value="BLOQUEADO">BLOQUEADO</option>
              </select>
            </Field>
            <Field label="Matrícula e-social">
              <input name="matricula_esocial" defaultValue={initial?.matricula_esocial || ""} className={inputCls} />
            </Field>
            <Field label="Coordenador">
              <input name="coordenador" defaultValue={initial?.coordenador || ""} className={inputCls} />
            </Field>
            <Field label="Cargo Aso">
              <select name="cargo_aso_id" defaultValue={initial?.cargo_aso_id || ""} className={inputCls}>
                <option value="">Selecione</option>
                {lookups.cargosAso.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="Empresa" className="lg:col-span-2">
              <select name="empresa_id" defaultValue={initial?.empresa_id || ""} className={inputCls}>
                <option value="">-</option>
                {lookups.empresas.map((e) => (
                  <option key={e.id} value={e.id}>{e.nome_fantasia || e.razao_social}</option>
                ))}
              </select>
            </Field>
            <Field label="CNPJ (se houver)">
              <input name="cnpj_vinculado" defaultValue={initial?.cnpj_vinculado || ""} className={inputCls} />
            </Field>
            <Field label="Cargo">
              <select name="cargo_id" defaultValue={initial?.cargo_id || ""} className={inputCls}>
                <option value="">Selecione</option>
                {lookups.cargos.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="E-mail (Particular)">
              <input name="email_particular" defaultValue={initial?.email_particular || ""} className={inputCls} />
            </Field>
            <Field label="Telefone (particular)">
              <input name="telefone_particular" defaultValue={initial?.telefone_particular || ""} className={inputCls} />
            </Field>
            <Field label="E-mail (Corporativo)">
              <input name="email_corporativo" defaultValue={initial?.email_corporativo || ""} className={inputCls} />
            </Field>
            <Field label="Telefone (Corporativo)">
              <input name="telefone_corporativo" defaultValue={initial?.telefone_corporativo || ""} className={inputCls} />
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="Cor">
              <input name="cor" defaultValue={initial?.cor || ""} className={inputCls} />
            </Field>
            <Field label="Sexo">
              <select name="sexo" defaultValue={initial?.sexo || ""} className={inputCls}>
                <option value="">Selecione</option>
                <option value="1">Masculino</option>
                <option value="2">Feminino</option>
              </select>
            </Field>
            <Field label="Data Nascimento">
              <input type="date" name="data_nascimento" defaultValue={initial?.data_nascimento || ""} className={inputCls} />
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="Estado Civil">
              <input name="estado_civil" defaultValue={initial?.estado_civil || ""} className={inputCls} />
            </Field>
            <Field label="Naturalidade">
              <input name="naturalidade" defaultValue={initial?.naturalidade || ""} className={inputCls} />
            </Field>
            <Field label="Nacionalidade" className="lg:col-span-2">
              <input name="nacionalidade" defaultValue={initial?.nacionalidade || ""} className={inputCls} />
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="Nome do Pai" className="lg:col-span-2">
              <input name="nome_pai" defaultValue={initial?.nome_pai || ""} className={inputCls} />
            </Field>
            <Field label="Nome da Mãe" className="lg:col-span-1">
              <input name="nome_mae" defaultValue={initial?.nome_mae || ""} className={inputCls} />
            </Field>
            <Field label="Nº Filhos">
              <input name="numero_filhos" defaultValue={initial?.numero_filhos || ""} className={inputCls} />
            </Field>
          </div>

          <Field label="CEP">
            <input name="cep" defaultValue={initial?.cep || ""} className={`${inputCls} max-w-xs`} />
          </Field>

          <div className={gridCls}>
            <Field label="Endereço" className="lg:col-span-2">
              <input name="endereco" defaultValue={initial?.endereco || ""} className={inputCls} />
            </Field>
            <Field label="Número">
              <input name="numero_endereco" defaultValue={initial?.numero_endereco || ""} className={inputCls} />
            </Field>
            <Field label="Complemento">
              <input name="complemento" defaultValue={initial?.complemento || ""} className={inputCls} />
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="Bairro">
              <input name="bairro" defaultValue={initial?.bairro || ""} className={inputCls} />
            </Field>
            <Field label="Município">
              <input name="municipio" defaultValue={initial?.municipio || ""} className={inputCls} />
            </Field>
            <Field label="Estado">
              <input name="uf_endereco" defaultValue={initial?.uf_endereco || ""} className={inputCls} />
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="RG / RNE">
              <input name="rg" defaultValue={initial?.rg || ""} className={inputCls} />
            </Field>
            <Field label="Orgão Emissor / Estado">
              <input name="orgao_emissor" defaultValue={initial?.orgao_emissor || ""} className={inputCls} />
            </Field>
            <Field label="Data Emissão">
              <input type="date" name="data_emissao_rg" defaultValue={initial?.data_emissao_rg || ""} className={inputCls} />
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="CPF">
              <input name="cpf" defaultValue={initial?.cpf || ""} className={inputCls} />
            </Field>
            <Field label="Título Eleitor/Zona/Seção">
              <input name="titulo_eleitor" defaultValue={initial?.titulo_eleitor || ""} className={inputCls} />
            </Field>
            <Field label="PIS">
              <input name="pis" defaultValue={initial?.pis || ""} className={inputCls} />
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="CTPS/Série/UF">
              <input name="ctps" defaultValue={initial?.ctps || ""} className={inputCls} />
            </Field>
            <Field label="Data Emissão CTPS">
              <input type="date" name="data_ctps" defaultValue={initial?.data_ctps || ""} className={inputCls} />
            </Field>
            <Field label="Carteira Reservista">
              <input name="reservista" defaultValue={initial?.reservista || ""} className={inputCls} />
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="CNH">
              <input name="cnh" defaultValue={initial?.cnh || ""} className={inputCls} />
            </Field>
            <Field label="Data Validade CNH">
              <input type="date" name="data_validade_cnh" defaultValue={initial?.data_validade_cnh || ""} className={inputCls} />
            </Field>
            <Field label="Categoria">
              <input name="categoria_cnh" defaultValue={initial?.categoria_cnh || ""} className={inputCls} />
            </Field>
          </div>

          <Field label="Escolaridade">
            <select name="escolaridade" defaultValue={initial?.escolaridade || ""} className={`${inputCls} max-w-xs`}>
              <option value="">Selecione</option>
              <option value="Fundamental">Fundamental</option>
              <option value="Médio">Médio</option>
              <option value="Técnico">Técnico</option>
              <option value="Superior">Superior</option>
              <option value="Pós-graduação">Pós-graduação</option>
            </select>
          </Field>

          <Field label="Tipo do Curso">
            <textarea name="tipo_curso" defaultValue={initial?.tipo_curso || ""} rows={2} className={inputCls} />
          </Field>

          <Field label="Observação">
            <textarea name="observacao" defaultValue={initial?.observacao || ""} rows={2} className={inputCls} />
          </Field>

          <div className={gridCls}>
            <Field label="MEI">
              <input name="mei" defaultValue={initial?.mei || ""} className={inputCls} />
            </Field>
            <Field label="CBO">
              <input name="cbo" defaultValue={initial?.cbo || ""} className={inputCls} />
            </Field>
            <Field label="Banco">
              <input name="banco" defaultValue={initial?.banco || ""} className={inputCls} />
            </Field>
            <Field label="Agência">
              <input name="agencia" defaultValue={initial?.agencia || ""} className={inputCls} />
            </Field>
          </div>

          <div className={gridCls}>
            <Field label="Salário bruto">
              <input type="number" step="0.01" name="salario_bruto" defaultValue={initial?.salario_bruto ?? ""} className={inputCls} />
            </Field>
            <Field label="Valor hora">
              <input type="number" step="0.01" name="valor_hora" defaultValue={initial?.valor_hora ?? ""} className={inputCls} />
            </Field>
          </div>
        </div>

        {/* ================= TREINAMENTOS E EXAMES ================= */}
        <div className={tab === "TREINAMENTOS E EXAMES" ? "space-y-4" : "hidden"}>
          <div className={gridCls}>
            <Field label="ID Ericsson">
              <input name="id_ericsson" defaultValue={initial?.id_ericsson || ""} className={inputCls} />
            </Field>
            <Field label="ID Huawei">
              <input name="id_huawei" defaultValue={initial?.id_huawei || ""} className={inputCls} />
            </Field>
            <Field label="ID ZTE">
              <input name="id_zte" defaultValue={initial?.id_zte || ""} className={inputCls} />
            </Field>
          </div>
          <div className={gridCls}>
            <Field label="ID Isignum">
              <input name="id_isignum" defaultValue={initial?.id_isignum || ""} className={inputCls} />
            </Field>
            <Field label="Senha Huawei">
              <input name="senha_huawei" defaultValue={initial?.senha_huawei || ""} className={inputCls} />
            </Field>
            <Field label="Senha ZTE">
              <input name="senha_zte" defaultValue={initial?.senha_zte || ""} className={inputCls} />
            </Field>
          </div>
          <div className={gridCls}>
            <Field label="Data Cadastro">
              <input type="date" name="data_cadastro" defaultValue={initial?.data_cadastro || ""} className={inputCls} />
            </Field>
            <Field label="Reativação">
              <input type="date" name="reativacao" defaultValue={initial?.reativacao || ""} className={inputCls} />
            </Field>
          </div>
        </div>

        {/* ================= INFORMAÇÃO ADICIONAL ================= */}
        <div className={tab === "INFORMAÇÃO ADICIONAL" ? "space-y-4" : "hidden"}>
          <div className={gridCls}>
            <Field label="Telefone Vivo Nº">
              <input name="telefone_vivo" defaultValue={initial?.telefone_vivo || ""} className={inputCls} />
            </Field>
            <Field label="IMEI do Aparelho">
              <input name="imei_aparelho" defaultValue={initial?.imei_aparelho || ""} className={inputCls} />
            </Field>
            <Field label="Matricula Vivo">
              <input name="matricula_vivo" defaultValue={initial?.matricula_vivo || ""} className={inputCls} />
            </Field>
            <Field label="Permissão de Acesso Tim">
              <input name="permissao_tim" defaultValue={initial?.permissao_tim || ""} className={inputCls} />
            </Field>
          </div>
          <div className={gridCls}>
            <Field label="Numero de Contrato">
              <input name="numero_contrato" defaultValue={initial?.numero_contrato || ""} className={inputCls} />
            </Field>
            <Field label="Validade do contrato">
              <input type="date" name="validade_contrato" defaultValue={initial?.validade_contrato || ""} className={inputCls} />
            </Field>
            <Field label="Status">
              <select name="status_vivo" defaultValue={initial?.status_vivo || "ATIVO"} className={inputCls}>
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
              </select>
            </Field>
            <Field label="Email VA Access">
              <input name="email_va_access" defaultValue={initial?.email_va_access || ""} className={inputCls} />
            </Field>
          </div>
          <Field label="Observação">
            <textarea name="observacao_matricula" defaultValue={initial?.observacao_matricula || ""} rows={3} className={inputCls} />
          </Field>
        </div>

        <div className="col-span-full mt-6 flex gap-3 border-t border-neutral-200 pt-4">
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

      {/* Treinamentos e Exames — cadastro/lista (fora do form principal) */}
      {tab === "TREINAMENTOS E EXAMES" && pessoaId && addTreinamentoAction && (
        <div className="border-t border-neutral-200 p-6">
          <form action={addTreinamentoAction} className="space-y-4">
            <input type="hidden" name="pessoa_id" value={pessoaId} />
            <Field label="TREINAMENTO / EXAME">
              <select name="tipo" defaultValue="" className={`${inputCls} max-w-md`}>
                <option value="">SELECIONE</option>
                {TREINAMENTO_TIPOS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="STATUS">
              <select name="status" defaultValue="pendente" className={`${inputCls} max-w-md`}>
                {TREINAMENTO_STATUS.map((s) => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
            </Field>
            <div className={gridCls}>
              <Field label="DATA EMISSÃO">
                <input type="date" name="data_emissao" className={inputCls} />
              </Field>
              <Field label="Data Validade">
                <input type="date" name="data_vencimento" className={inputCls} />
              </Field>
            </div>
            <button
              type="submit"
              className="rounded-md bg-neutral-800 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-700"
            >
              Adicionar +
            </button>
          </form>

          {treinamentos && treinamentos.length > 0 && (
            <table className="mt-4 w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs text-neutral-500">
                <tr>
                  <th className="py-2">Ação</th>
                  <th className="py-2">Treinamentos</th>
                  <th className="py-2">Data Emissão</th>
                  <th className="py-2">Data Validade</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {treinamentos.map((t) => (
                  <tr key={t.id} className="border-b border-neutral-100">
                    <td className="py-2">
                      {deleteTreinamentoAction && (
                        <form action={deleteTreinamentoAction}>
                          <input type="hidden" name="id" value={t.id} />
                          <button type="submit" className="text-neutral-400 hover:text-red-600" title="Excluir">
                            🗑
                          </button>
                        </form>
                      )}
                    </td>
                    <td className="py-2">{t.tipo}</td>
                    <td className="py-2">{t.data_emissao}</td>
                    <td className="py-2">{t.data_vencimento}</td>
                    <td className="py-2">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
