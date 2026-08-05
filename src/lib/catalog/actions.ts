"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
}

export type CatalogConfig = {
  table: string;
  basePath: string;
  hasLogoUrl?: boolean;
};

function payloadFromForm(fd: FormData, config: CatalogConfig) {
  const payload: Record<string, unknown> = {
    nome: str(fd, "nome"),
    status: (fd.get("status") as string) !== "false",
  };
  if (config.hasLogoUrl) {
    payload.logo_url = str(fd, "logo_url");
  }
  return payload;
}

export async function createCatalogItem(config: CatalogConfig, formData: FormData) {
  const supabase = createServiceClient();
  const payload = payloadFromForm(formData, config);
  if (!payload.nome) throw new Error("Nome e obrigatorio");

  const { error } = await supabase.from(config.table).insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath(config.basePath);
  redirect(config.basePath);
}

export async function updateCatalogItem(config: CatalogConfig, id: string, formData: FormData) {
  const supabase = createServiceClient();
  const payload = payloadFromForm(formData, config);
  if (!payload.nome) throw new Error("Nome e obrigatorio");

  const { error } = await supabase.from(config.table).update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(config.basePath);
  redirect(config.basePath);
}

export async function deleteCatalogItem(config: CatalogConfig, id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from(config.table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(config.basePath);
}
