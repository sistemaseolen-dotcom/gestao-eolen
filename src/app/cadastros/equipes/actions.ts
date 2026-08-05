"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
}

function payload(fd: FormData) {
  return {
    nome: str(fd, "nome"),
    status: (fd.get("status") as string) !== "false",
    regional: str(fd, "regional"),
    team_leader_id: str(fd, "team_leader_id"),
    projeto_id: str(fd, "projeto_id"),
    operadora_id: str(fd, "operadora_id"),
  };
}

export async function createEquipe(formData: FormData) {
  const supabase = createServiceClient();
  const data = payload(formData);
  if (!data.nome) throw new Error("Nome e obrigatorio");

  const { error } = await supabase.from("equipes").insert(data);
  if (error) throw new Error(error.message);

  revalidatePath("/cadastros/equipes");
  redirect("/cadastros/equipes");
}

export async function updateEquipe(id: string, formData: FormData) {
  const supabase = createServiceClient();
  const data = payload(formData);
  if (!data.nome) throw new Error("Nome e obrigatorio");

  const { error } = await supabase.from("equipes").update(data).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/cadastros/equipes");
  redirect("/cadastros/equipes");
}

export async function deleteEquipe(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("equipes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/cadastros/equipes");
}
