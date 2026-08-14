"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
}
function uuid(fd: FormData, key: string): string | null {
  return str(fd, key);
}
function num(fd: FormData, key: string): number | null {
  const s = str(fd, key);
  return s === null ? null : Number(s);
}

function pessoaPayload(fd: FormData) {
  return {
    nome: str(fd, "nome"),
    tipo_contratacao: str(fd, "tipo_contratacao"),
    status: str(fd, "status") || "ativo",
    regional: str(fd, "regional"),
    estado_servico: str(fd, "estado_servico"),
    numero_registro: str(fd, "numero_registro"),
    matricula_esocial: str(fd, "matricula_esocial"),
    data_admissao: str(fd, "data_admissao"),
    data_demissao: str(fd, "data_demissao"),
    empresa_id: uuid(fd, "empresa_id"),
    cargo_id: uuid(fd, "cargo_id"),
    cargo_aso_id: uuid(fd, "cargo_aso_id"),
    projeto_id: uuid(fd, "projeto_id"),
    operadora_id: uuid(fd, "operadora_id"),
    equipe_id: uuid(fd, "equipe_id"),
    email_particular: str(fd, "email_particular"),
    telefone_particular: str(fd, "telefone_particular"),
    email_corporativo: str(fd, "email_corporativo"),
    telefone_corporativo: str(fd, "telefone_corporativo"),
    cpf: str(fd, "cpf"),
    rg: str(fd, "rg"),
    orgao_emissor: str(fd, "orgao_emissor"),
    data_emissao_rg: str(fd, "data_emissao_rg"),
    data_nascimento: str(fd, "data_nascimento"),
    sexo: str(fd, "sexo"),
    cor: str(fd, "cor"),
    estado_civil: str(fd, "estado_civil"),
    naturalidade: str(fd, "naturalidade"),
    nacionalidade: str(fd, "nacionalidade"),
    nome_pai: str(fd, "nome_pai"),
    nome_mae: str(fd, "nome_mae"),
    numero_filhos: str(fd, "numero_filhos"),
    cep: str(fd, "cep"),
    endereco: str(fd, "endereco"),
    numero_endereco: str(fd, "numero_endereco"),
    complemento: str(fd, "complemento"),
    bairro: str(fd, "bairro"),
    municipio: str(fd, "municipio"),
    uf_endereco: str(fd, "uf_endereco"),
    titulo_eleitor: str(fd, "titulo_eleitor"),
    pis: str(fd, "pis"),
    ctps: str(fd, "ctps"),
    data_ctps: str(fd, "data_ctps"),
    reservista: str(fd, "reservista"),
    cnh: str(fd, "cnh"),
    data_validade_cnh: str(fd, "data_validade_cnh"),
    categoria_cnh: str(fd, "categoria_cnh"),
    escolaridade: str(fd, "escolaridade"),
    banco: str(fd, "banco"),
    agencia: str(fd, "agencia"),
    salario_bruto: num(fd, "salario_bruto"),
    valor_hora: num(fd, "valor_hora"),
    mei: str(fd, "mei"),
    cbo: str(fd, "cbo"),
    cnpj_vinculado: str(fd, "cnpj_vinculado"),
    coordenador: str(fd, "coordenador"),
    tipo_curso: str(fd, "tipo_curso"),
    observacao: str(fd, "observacao"),
    id_ericsson: str(fd, "id_ericsson"),
    id_huawei: str(fd, "id_huawei"),
    id_zte: str(fd, "id_zte"),
    id_isignum: str(fd, "id_isignum"),
    senha_huawei: str(fd, "senha_huawei"),
    senha_zte: str(fd, "senha_zte"),
    data_cadastro: str(fd, "data_cadastro"),
    reativacao: str(fd, "reativacao"),
    telefone_vivo: str(fd, "telefone_vivo"),
    imei_aparelho: str(fd, "imei_aparelho"),
    matricula_vivo: str(fd, "matricula_vivo"),
    permissao_tim: str(fd, "permissao_tim"),
    numero_contrato: str(fd, "numero_contrato"),
    validade_contrato: str(fd, "validade_contrato"),
    status_vivo: str(fd, "status_vivo"),
    email_va_access: str(fd, "email_va_access"),
    observacao_matricula: str(fd, "observacao_matricula"),
  };
}

export async function createPessoa(formData: FormData) {
  const supabase = createServiceClient();
  const payload = pessoaPayload(formData);

  if (!payload.nome) {
    throw new Error("Nome e obrigatorio");
  }

  const { error } = await supabase.from("pessoas").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/cadastros/pessoas");
  redirect("/cadastros/pessoas");
}

export async function updatePessoa(id: string, formData: FormData) {
  const supabase = createServiceClient();
  const payload = pessoaPayload(formData);

  if (!payload.nome) {
    throw new Error("Nome e obrigatorio");
  }

  const { error } = await supabase.from("pessoas").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/cadastros/pessoas");
  redirect("/cadastros/pessoas");
}

export async function deletePessoa(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("pessoas").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/cadastros/pessoas");
}

export async function addTreinamento(formData: FormData) {
  const supabase = createServiceClient();
  const pessoaId = str(formData, "pessoa_id");
  if (!pessoaId) throw new Error("pessoa_id obrigatório");

  const { error } = await supabase.from("pessoas_treinamentos").insert({
    pessoa_id: pessoaId,
    tipo: str(formData, "tipo"),
    status: str(formData, "status") || "pendente",
    data_emissao: str(formData, "data_emissao"),
    data_vencimento: str(formData, "data_vencimento"),
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/cadastros/pessoas/${pessoaId}/editar`);
}

export async function deleteTreinamento(pessoaId: string, formData: FormData) {
  const supabase = createServiceClient();
  const id = str(formData, "id");
  if (!id) return;
  const { error } = await supabase.from("pessoas_treinamentos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/cadastros/pessoas/${pessoaId}/editar`);
}
