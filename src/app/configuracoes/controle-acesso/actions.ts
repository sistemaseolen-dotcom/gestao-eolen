"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

const BASE_PATH = "/configuracoes/controle-acesso";

function toNull(v: FormDataEntryValue | null) {
  const s = (v ?? "").toString().trim();
  return s === "" ? null : s;
}

export async function createUsuario(formData: FormData) {
  const supabase = createServiceClient();

  const senha = (formData.get("senha") || "").toString();
  if (!senha || senha.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }
  const password_hash = await bcrypt.hash(senha, 10);

  const payload = {
    username: (formData.get("username") || "").toString(),
    nome: toNull(formData.get("nome")),
    email: toNull(formData.get("email")),
    role: (formData.get("role") || "user").toString(),
    status: formData.get("status") === "true",
    password_hash,
  };

  const { error } = await supabase.from("usuarios").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function updateUsuario(id: string, formData: FormData) {
  const supabase = createServiceClient();

  const payload: Record<string, unknown> = {
    username: (formData.get("username") || "").toString(),
    nome: toNull(formData.get("nome")),
    email: toNull(formData.get("email")),
    role: (formData.get("role") || "user").toString(),
    status: formData.get("status") === "true",
  };

  // Senha só é alterada se o campo "nova senha" for preenchido.
  const novaSenha = (formData.get("senha") || "").toString();
  if (novaSenha) {
    if (novaSenha.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }
    payload.password_hash = await bcrypt.hash(novaSenha, 10);
  }

  const { error } = await supabase.from("usuarios").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
  redirect(BASE_PATH);
}

export async function deleteUsuario(id: string) {
  const supabase = createServiceClient();
  await supabase.from("permissoes").delete().eq("usuario_id", id);
  const { error } = await supabase.from("usuarios").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(BASE_PATH);
}

export async function savePermissoes(usuarioId: string, formData: FormData) {
  const supabase = createServiceClient();

  const marcados = formData.getAll("permissao"); // valores no formato "modulo::funcionalidade"

  const { error: deleteError } = await supabase
    .from("permissoes")
    .delete()
    .eq("usuario_id", usuarioId);
  if (deleteError) throw new Error(deleteError.message);

  if (marcados.length > 0) {
    const rows = marcados.map((valor) => {
      const [modulo, funcionalidade] = valor.toString().split("::");
      return { usuario_id: usuarioId, modulo, funcionalidade, permitido: true };
    });
    const { error: insertError } = await supabase.from("permissoes").insert(rows);
    if (insertError) throw new Error(insertError.message);
  }

  revalidatePath(`${BASE_PATH}/${usuarioId}/permissoes`);
  redirect(BASE_PATH);
}
