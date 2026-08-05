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
