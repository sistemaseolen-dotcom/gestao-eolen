"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
}

function empresaPayload(fd: FormData) {
  return {
    cnpj: str(fd, "cnpj"),
    razao_social: str(fd, "razao_social"),
    nome_fantasia: str(fd, "nome_fantasia"),
    porte: str(fd, "porte"),
    status: (fd.get("status") as string) === "true",
    telefone: str(fd, "telefone"),
    email: str(fd, "email"),
    cep: str(fd, "cep"),
    logradouro: str(fd, "logradouro"),
    numero: str(fd, "numero"),
    complemento: str(fd, "complemento"),
    bairro: str(fd, "bairro"),
    cidade: str(fd, "cidade"),
    uf: str(fd, "uf"),
    nome_responsavel: str(fd, "nome_responsavel"),
    cnae_principal: str(fd, "cnae_principal"),
    cnae_secundario: str(fd, "cnae_secundario"),
    natureza_juridica: str(fd, "natureza_juridica"),
    situacao_cadastral: str(fd, "situacao_cadastral"),
  };
}

export async function createEmpresa(formData: FormData) {
  const supabase = createServiceClient();
  const payload = empresaPayload(formData);

  if (!payload.razao_social || !payload.cnpj) {
    throw new Error("Razao social e CNPJ sao obrigatorios");
  }

  const { error } = await supabase.from("empresas").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/cadastros/empresas");
  redirect("/cadastros/empresas");
}

export async function updateEmpresa(id: string, formData: FormData) {
  const supabase = createServiceClient();
  const payload = empresaPayload(formData);

  if (!payload.razao_social || !payload.cnpj) {
    throw new Error("Razao social e CNPJ sao obrigatorios");
  }

  const { error } = await supabase.from("empresas").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/cadastros/empresas");
  redirect("/cadastros/empresas");
}

export async function deleteEmpresa(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("empresas").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/cadastros/empresas");
}
