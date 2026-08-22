import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function toBool(v: any): boolean {
  if (typeof v === "boolean") return v;
  if (v === 1 || v === "1") return true;
  const s = String(v ?? "").trim().toUpperCase();
  return s === "ATIVO" || s === "TRUE";
}

function toDate(v: any): string | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s || s === "1899-12-30") return null;
  return s;
}

function toNum(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function clean(v: any): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" || s === "Selecione" ? null : s;
}

async function syncSimples(supabase: any, table: string, registros: any[]) {
  const rows = registros.map((r: any) => ({
    id_legado: r.id,
    nome: clean(r.nome),
    status: toBool(r.status),
  }));
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id_legado" });
  if (error) throw error;
  return rows.length;
}

async function syncEmpresas(supabase: any, registros: any[]) {
  const rows = registros.map((r: any) => ({
    id_legado: r.id,
    cnpj: clean(r.cnpj),
    razao_social: clean(r.nome) ?? clean(r.fantasia) ?? clean(r.cnpj) ?? "(sem nome)",
        nome_fantasia: clean(r.fantasia),
          porte: clean(r.porte),
    cnae_principal: clean(r.cnaep),
    cnae_secundario: clean(r.cnaes),
    natureza_juridica: clean(r.codigodescricaonatureza),
    status: toBool(r.status),
    telefone: clean(r.telefone),
    email: clean(r.email),
    cep: clean(r.cep),
    logradouro: clean(r.logradouro),
    numero: clean(r.numero),
    complemento: clean(r.complemento),
    bairro: clean(r.bairro),
    cidade: clean(r.cidade),
    uf: clean(r.uf),
    nome_responsavel: clean(r.nomeresponsavel),
    situacao_cadastral: clean(r.situacaocadastral),
    dados_adicionais: r,
  }));
      const chunkSize = 200;
  let total = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from("empresas").upsert(chunk, { onConflict: "id_legado" });
    if (error) throw error;
    total += chunk.length;
  }
  return total;
}

async function buildLookup(supabase: any, table: string, keyCol = "nome") {
  const { data } = await supabase.from(table).select(`id,${keyCol}`);
  const m = new Map<string, string>();
  (data || []).forEach((r: any) => {
    if (r[keyCol]) m.set(String(r[keyCol]).trim().toLowerCase(), r.id);
  });
  return m;
}

function find(map: Map<string, string>, nome: any): string | null {
  if (!nome) return null;
  return map.get(String(nome).trim().toLowerCase()) ?? null;
}

async function syncPessoas(supabase: any, registros: any[]) {
  const [mProjetos, mOperadoras, mCargos, mCargosAso, mEquipes, mEmpresasRazao, mEmpresasFantasia, mEmpresasLegado] =
          await Promise.all([
              buildLookup(supabase, "projetos"),
      buildLookup(supabase, "operadoras"),
      buildLookup(supabase, "cargos"),
      buildLookup(supabase, "cargos_aso"),
      buildLookup(supabase, "equipes"),
      buildLookup(supabase, "empresas", "razao_social"),
      buildLookup(supabase, "empresas", "nome_fantasia"),
      buildLookup(supabase, "empresas", "id_legado"),
      ]);

    const findEmpresa = (r: any) =>
      find(mEmpresasLegado, r.empresa) ?? find(mEmpresasRazao, r.nomeempresa) ?? find(mEmpresasFantasia, r.nomeempresa) ?? find(mEmpresasRazao, r.empresanome) ?? find(mEmpresasFantasia, r.empresanome);

const rows = registros.map((r: any) => ({
  id_legado: r.id,
  nome: clean(r.nome),
  tipo_contratacao: clean(r.tipopessoa),
  estado_servico: clean(r.estadoservico),
  regional: clean(r.regional),
  projeto_id: find(mProjetos, r.projeto),
  operadora_id: find(mOperadoras, r.operadora),
  equipe_id: find(mEquipes, r.nomegrupo),
  numero_registro: clean(r.nregistro),
  data_admissao: toDate(r.dataadmissao),
  data_demissao: toDate(r.datademissao),
  status: clean(r.status)?.toLowerCase() ?? "ativo",
  matricula_esocial: clean(r.matriculaesocial),
  cargo_id: find(mCargos, r.cargo),
  cargo_aso_id: find(mCargosAso, r.cargoaso),
      empresa_id: findEmpresa(r),
  cnpj_vinculado: clean(r.contrato),
  email_particular: clean(r.email),
  telefone_particular: clean(r.telefone),
  email_corporativo: clean(r.emailcorporativo),
  telefone_corporativo: clean(r.telefonecorporativo),
  cpf: clean(r.cpf),
  rg: clean(r.rgrne),
  orgao_emissor: clean(r.orgaoemissor),
  data_emissao_rg: toDate(r.dataemissao),
  data_nascimento: toDate(r.datanascimento),
  sexo: clean(r.sexo),
  cor: clean(r.cor),
  estado_civil: clean(r.estadocivil),
  naturalidade: clean(r.naturalidade),
  nacionalidade: clean(r.nacionalidade),
  nome_pai: clean(r.nomepai),
  nome_mae: clean(r.nomemae),
  numero_filhos: clean(r.nfilho),
  cep: clean(r.cep),
  endereco: clean(r.endereco),
  numero_endereco: clean(r.numero),
  complemento: clean(r.complemento),
  bairro: clean(r.bairro),
  municipio: clean(r.municipio),
  uf_endereco: clean(r.estado),
  titulo_eleitor: clean(r.tituloeleitor),
  pis: clean(r.pis),
  ctps: clean(r.ctps),
  data_ctps: toDate(r.datactps),
  reservista: clean(r.reservista),
  data_validade_cnh: toDate(r.datavalidadecnh),
  cnh: clean(r.cnh),
  categoria_cnh: clean(r.categoriacnh),
  escolaridade: clean(r.escolaridade),
  banco: clean(r.banco),
  agencia: clean(r.agencia),
  salario_bruto: toNum(r.salariobruto),
  valor_hora: toNum(r.valorhora),
  mei: clean(r.mei),
  cbo: clean(r.cbo),
  coordenador: clean(r.coordenador),
  id_ericsson: clean(r.idericsson),
  id_isignum: clean(r.idisignum),
  id_huawei: clean(r.idhuawei),
  senha_huawei: clean(r.senhahuawei),
  id_zte: clean(r.idzte),
  data_cadastro: toDate(r.datacadastro),
  reativacao: toDate(r.reativacao),
  tipo_curso: clean(r.tipocurso),
  observacao: clean(r.observacao),
  telefone_vivo: clean(r.telefonevivo),
  imei_aparelho: clean(r.imeiaparelho),
  matricula_vivo: clean(r.matriculavivo),
  permissao_tim: clean(r.permissaotim),
  numero_contrato: clean(r.numerocontrato),
  validade_contrato: toDate(r.validadecontrato),
  status_vivo: clean(r.statusvivo),
  email_va_access: clean(r.emailvaaccess),
  observacao_matricula: clean(r.observacaomatricula),
  dados_adicionais: r,
}));

const chunkSize = 200;
  let total = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from("pessoas").upsert(chunk, { onConflict: "id_legado" });
    if (error) throw error;
    total += chunk.length;
  }
  return total;
}

const SIMPLES_TABLES: Record<string, string> = {
  projetos: "projetos",
  operadoras: "operadoras",
  cargos: "cargos",
  cargos_aso: "cargos_aso",
  locadoras: "locadoras",
  tipos_produto: "tipos_produto",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { modulo, registros } = body as { modulo: string; registros: any[] };
  const supabase = createServiceClient();

try {
  let count = 0;
  if (SIMPLES_TABLES[modulo]) {
    count = await syncSimples(supabase, SIMPLES_TABLES[modulo], registros);
  } else if (modulo === "empresas") {
    count = await syncEmpresas(supabase, registros);
  } else if (modulo === "pessoas") {
    count = await syncPessoas(supabase, registros);
  } else {
    return NextResponse.json({ ok: false, error: "modulo desconhecido: " + modulo }, { status: 400 });
  }
  return NextResponse.json({ ok: true, modulo, registros: count });
} catch (e: any) {
  return NextResponse.json(
    { ok: false, modulo, error: String(e?.message || e) },
    { status: 500 }
    );
}
}
