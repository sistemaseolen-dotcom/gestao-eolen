"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

const BASE_PATH = "/suprimentos/solicitacao";

function toNull(v: FormDataEntryValue | null) {
  const s = (v ?? "").toString().trim();
  return s === "" ? null : s;
}

function buildPayload(formData: FormData) {
  return {
    status: toNull(formData.get("status")) || "aguardando",
    data: toNull(formData.get("data")),
    solicitante_pessoa_id: toNull(formData.get("solicitante_pessoa_id")),
    sigla: toNull(formData.get("sigla")),
    obra: toNull(formData.get("obra")),
    descricao: toNull(formData.get("descricao")),
    unidade: toNull(formData.get("unidade")),
  };
}

export async function createSolicitacao(formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("solicitacoes_material").insert(buildPayload(formData));
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function updateSolicitacao(id: string, formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("solicitacoes_material").update(buildPayload(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function deleteSolicitacao(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("solicitacoes_material").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
}

/**
 * Integracao-chave do modulo: converte uma solicitacao aprovada diretamente
 * numa Ordem de Compra (tabela compras), e marca a solicitacao como "convertida".
 */
export async function gerarPedidoDeCompra(id: string) {
  const supabase = createServiceClient();

  const { data: solicitacao, error: fetchError } = await supabase
    .from("solicitacoes_material")
    .select("id, sigla, obra, descricao, unidade, status")
    .eq("id", id)
    .single();

  if (fetchError || !solicitacao) throw new Error(fetchError?.message || "Solicitação não encontrada");

  const marcadores = [solicitacao.sigla, solicitacao.obra].filter(Boolean).join(" · ") || null;

  const { error: insertError } = await supabase.from("compras").insert({
    situacao: "pendente",
    data: new Date().toISOString().slice(0, 10),
    marcadores,
  });

  if (insertError) throw new Error(insertError.message);

  const { error: updateError } = await supabase
    .from("solicitacoes_material")
    .update({ status: "convertido" })
    .eq("id", id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath(BASE_PATH);
  revalidatePath("/suprimentos/compras");
}
