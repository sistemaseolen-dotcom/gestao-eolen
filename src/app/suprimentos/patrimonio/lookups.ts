import { createServiceClient } from "@/lib/supabase/server";

export type PatrimonioLookups = {
  pessoas: { id: string; nome: string }[];
};

export async function getPatrimonioLookups(): Promise<PatrimonioLookups> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("pessoas").select("id, nome").order("nome");
  return { pessoas: data || [] };
}
