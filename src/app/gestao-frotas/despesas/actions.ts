"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

const BASE_PATH = "/gestao-frotas/despesas";

function toNull(v: FormDataEntryValue | null) {
  const s = (v ?? "").toString().trim();
  return s === "" ? null : s;
}

function toNumberOrNull(v: FormDataEntryValue | null) {
  const s = (v ?? "").toString().trim();
  return s === "" ? null : Number(s);
}

function buildPayload(formData: FormData) {
  return {
    placa: toNull(formData.get("placa")),
    veiculo_descricao: toNull(formData.get("veiculo_descricao")),
    empresa_descricao: toNull(formData.get("empresa_descricao")),
    data_lancamento: toNull(formData.get("data_lancamento")),
    valor_total: toNumberOrNull(formData.get("valor_total")),
    descricao: toNull(formData.get("descricao")),
    observacao: toNull(formData.get("observacao")),
  };
}

export async function createDespesa(formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("despesas_frota").insert(buildPayload(formData));
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function updateDespesa(id: string, formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("despesas_frota").update(buildPayload(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function deleteDespesa(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("despesas_frota").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
}
