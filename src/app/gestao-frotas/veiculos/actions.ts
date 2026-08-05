"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

const BASE_PATH = "/gestao-frotas/veiculos";

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
    contrato: toNull(formData.get("contrato")),
    data_contrato: toNull(formData.get("data_contrato")),
    locadora_id: toNull(formData.get("locadora_id")),
    placa: toNull(formData.get("placa")),
    condutor_pessoa_id: toNull(formData.get("condutor_pessoa_id")),
    status: toNull(formData.get("status")),
    km_retirada: toNumberOrNull(formData.get("km_retirada")),
    km_atual: toNumberOrNull(formData.get("km_atual")),
    km_revisao_realizada: toNumberOrNull(formData.get("km_revisao_realizada")),
    proxima_revisao_km: toNumberOrNull(formData.get("proxima_revisao_km")),
    km_devolucao: toNumberOrNull(formData.get("km_devolucao")),
    observacao: toNull(formData.get("observacao")),
    projeto_id: toNull(formData.get("projeto_id")),
    regional: toNull(formData.get("regional")),
    data_retirada: toNull(formData.get("data_retirada")),
    data_devolucao: toNull(formData.get("data_devolucao")),
  };
}

export async function createVeiculo(formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("veiculos").insert(buildPayload(formData));
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function updateVeiculo(id: string, formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("veiculos").update(buildPayload(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function deleteVeiculo(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("veiculos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
}
