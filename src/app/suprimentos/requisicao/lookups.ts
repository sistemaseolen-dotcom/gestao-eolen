import { createServiceClient } from "@/lib/supabase/server";

export type ProdutoLookups = {
  produtos: { id: string; nome: string }[];
};

export async function getProdutoLookups(): Promise<ProdutoLookups> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("tipos_produto").select("id, nome").order("nome");
  return { produtos: data || [] };
}
