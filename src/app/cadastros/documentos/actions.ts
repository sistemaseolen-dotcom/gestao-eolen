"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

const BASE_PATH = "/cadastros/documentos";

function toNull(v: FormDataEntryValue | null) {
  const s = (v ?? "").toString().trim();
  return s === "" ? null : s;
}

export async function createDocumento(formData: FormData) {
  const supabase = createServiceClient();
  const payload = {
    modulo: (formData.get("modulo") || "").toString(),
    registro_id: toNull(formData.get("registro_id")),
    nome_arquivo: (formData.get("nome_arquivo") || "").toString(),
    storage_path: (formData.get("storage_path") || "").toString(),
    data_upload: toNull(formData.get("data_upload")),
  };
  const { error } = await supabase.from("documentos").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function updateDocumento(id: string, formData: FormData) {
  const supabase = createServiceClient();
  const payload = {
    modulo: (formData.get("modulo") || "").toString(),
    registro_id: toNull(formData.get("registro_id")),
    nome_arquivo: (formData.get("nome_arquivo") || "").toString(),
    storage_path: (formData.get("storage_path") || "").toString(),
    data_upload: toNull(formData.get("data_upload")),
  };
  const { error } = await supabase.from("documentos").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function deleteDocumento(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("documentos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
}
