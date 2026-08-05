import { createServiceClient } from "@/lib/supabase/server";

export type VeiculoLookups = {
  locadoras: { id: string; nome: string }[];
  pessoas: { id: string; nome: string }[];
  projetos: { id: string; nome: string }[];
};

export async function getVeiculoLookups(): Promise<VeiculoLookups> {
  const supabase = createServiceClient();
  const [locadoras, pessoas, projetos] = await Promise.all([
    supabase.from("locadoras").select("id, nome").order("nome"),
    supabase.from("pessoas").select("id, nome").order("nome"),
    supabase.from("projetos").select("id, nome").order("nome"),
  ]);
  return {
    locadoras: locadoras.data || [],
    pessoas: pessoas.data || [],
    projetos: projetos.data || [],
  };
}
