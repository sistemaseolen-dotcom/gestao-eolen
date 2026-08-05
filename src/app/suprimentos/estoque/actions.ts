"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

const BASE_PATH = "/suprimentos/estoque";

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
    produto_id: toNull(formData.get("produto_id")),
    codigo: toNull(formData.get("codigo")),
    sku: toNull(formData.get("sku")),
    estoque_fisico: toNumberOrNull(formData.get("estoque_fisico")),
    unidade: toNull(formData.get("unidade")),
    localizacao: toNull(formData.get("localizacao")),
  };
}

export async function createEstoque(formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("estoque").insert(buildPayload(formData));
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function updateEstoque(id: string, formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("estoque").update(buildPayload(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function deleteEstoque(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("estoque").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
}
