import { createServiceClient } from "@/lib/supabase/server";

export async function getEquipeLookups() {
  const supabase = createServiceClient();
  const [pessoas, projetos, operadoras] = await Promise.all([
    supabase.from("pessoas").select("id, nome").order("nome"),
    supabase.from("projetos").select("id, nome").order("nome"),
    supabase.from("operadoras").select("id, nome").order("nome"),
  ]);
  return {
    pessoas: pessoas.data || [],
    projetos: projetos.data || [],
    operadoras: operadoras.data || [],
  };
}
export type EquipeLookups = Awaited<ReturnType<typeof getEquipeLookups>>;
