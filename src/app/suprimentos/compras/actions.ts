"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

const BASE_PATH = "/suprimentos/compras";

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
    numero_pedido: toNull(formData.get("numero_pedido")),
    situacao: toNull(formData.get("situacao")),
    data: toNull(formData.get("data")),
    previsao_entrega: toNull(formData.get("previsao_entrega")),
    fornecedor: toNull(formData.get("fornecedor")),
    valor_total: toNumberOrNull(formData.get("valor_total")),
    marcadores: toNull(formData.get("marcadores")),
  };
}

export async function createCompra(formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("compras").insert(buildPayload(formData));
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function updateCompra(id: string, formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("compras").update(buildPayload(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function deleteCompra(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("compras").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
}
