import { createServiceClient } from "@/lib/supabase/server";

export type SolicitacaoLookups = {
  pessoas: { id: string; nome: string }[];
};

export async function getSolicitacaoLookups(): Promise<SolicitacaoLookups> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("pessoas").select("id, nome").order("nome");
  return { pessoas: data || [] };
}
