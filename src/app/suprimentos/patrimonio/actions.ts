"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

const BASE_PATH = "/suprimentos/patrimonio";

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
    tipo: toNull(formData.get("tipo")),
    modelo: toNull(formData.get("modelo")),
    numero_serie: toNull(formData.get("numero_serie")),
    codigo_patrimonio: toNull(formData.get("codigo_patrimonio")),
    valor: toNumberOrNull(formData.get("valor")),
    status: toNull(formData.get("status")),
    pessoa_id: toNull(formData.get("pessoa_id")),
  };
}

export async function createPatrimonio(formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("patrimonio").insert(buildPayload(formData));
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function updatePatrimonio(id: string, formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("patrimonio").update(buildPayload(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function deletePatrimonio(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("patrimonio").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
}
